package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.inventory.InventoryTransactionRequest;
import com.luxe_restaurant.app.requests.inventory.TransactionItemRequest;
import com.luxe_restaurant.app.responses.ingredient.IngredientResponse;
import com.luxe_restaurant.app.responses.inventory.InventoryDashboardResponse;
import com.luxe_restaurant.app.responses.inventory.InventoryTransactionResponse;
import com.luxe_restaurant.app.responses.inventory.TransactionItemResponse;
import com.luxe_restaurant.app.responses.page.PageResponse;
import com.luxe_restaurant.domain.entities.Ingredient;
import com.luxe_restaurant.domain.entities.InventoryStock;
import com.luxe_restaurant.domain.entities.InventoryTransaction;
import com.luxe_restaurant.domain.entities.InventoryTransactionItem;
import com.luxe_restaurant.domain.enums.InventoryTransactionStatus;
import com.luxe_restaurant.domain.enums.InventoryTransactionType;
import com.luxe_restaurant.domain.exception.BusinessException;
import com.luxe_restaurant.domain.exception.ErrorCode;
import com.luxe_restaurant.domain.exception.NotFoundException;
import com.luxe_restaurant.domain.entities.Dish;
import com.luxe_restaurant.domain.entities.MenuItemIngredient;
import com.luxe_restaurant.domain.entities.Order;
import com.luxe_restaurant.domain.entities.OrderDetail;
import com.luxe_restaurant.domain.repositories.DishRepository;
import com.luxe_restaurant.domain.repositories.IngredientRepository;
import com.luxe_restaurant.domain.repositories.InventoryStockRepository;
import com.luxe_restaurant.domain.repositories.InventoryTransactionRepository;
import com.luxe_restaurant.domain.repositories.MenuItemIngredientRepository;
import com.luxe_restaurant.domain.services.InventoryService;
import com.luxe_restaurant.domain.utils.UnitConverter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService {

    private final InventoryTransactionRepository transactionRepository;
    private final InventoryStockRepository stockRepository;
    private final IngredientRepository ingredientRepository;
    private final DishRepository dishRepository;
    private final MenuItemIngredientRepository menuItemIngredientRepository;

    @Override
    @Transactional
    public InventoryTransactionResponse createTransaction(InventoryTransactionRequest request) {
        String currentUser = getCurrentUsername();
        String code = generateTransactionCode(request.getType());

        InventoryTransaction transaction = InventoryTransaction.builder()
                .code(code)
                .type(request.getType())
                .status(InventoryTransactionStatus.DRAFT)
                .supplierName(request.getSupplierName())
                .note(request.getNote())
                .createdBy(currentUser)
                .build();

        List<InventoryTransactionItem> items = new ArrayList<>();
        for (TransactionItemRequest itemReq : request.getItems()) {
            Ingredient ingredient = ingredientRepository.findById(itemReq.getIngredientId())
                    .orElseThrow(() -> new NotFoundException(ErrorCode.INGREDIENT_001));

            if (!ingredient.isActive()) {
                throw new BusinessException(ErrorCode.INGREDIENT_003,
                        "Nguyên liệu '" + ingredient.getName() + "' hiện đang không hoạt động");
            }

            BigDecimal baseQty = UnitConverter.convertToBaseUnit(itemReq.getQuantity(), itemReq.getUnit(), ingredient.getBaseUnit());

            BigDecimal unitCostInput = itemReq.getUnitCost() != null ? itemReq.getUnitCost() : BigDecimal.ZERO;
            BigDecimal totalCost = itemReq.getQuantity().multiply(unitCostInput);

            InventoryTransactionItem item = InventoryTransactionItem.builder()
                    .transaction(transaction)
                    .ingredient(ingredient)
                    .inputQuantity(itemReq.getQuantity())
                    .inputUnit(itemReq.getUnit())
                    .baseQuantity(baseQty)
                    .unitCost(unitCostInput)
                    .totalCost(totalCost)
                    .batchCode(itemReq.getBatchCode())
                    .expiryDate(itemReq.getExpiryDate())
                    .build();

            items.add(item);
        }

        transaction.setItems(items);
        InventoryTransaction saved = transactionRepository.save(transaction);
        return mapToTransactionResponse(saved);
    }

    @Override
    @Transactional
    public InventoryTransactionResponse confirmTransaction(Long transactionId) {
        InventoryTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.INVENTORY_TRANSACTION_NOT_FOUND));

        // Idempotent Check: Nếu đã CONFIRMED thì trả về luôn, không cập nhật kho 2 lần
        if (transaction.getStatus() == InventoryTransactionStatus.CONFIRMED) {
            log.info("Phiếu giao dịch kho #{} đã được xác nhận trước đó. Trả về kết quả idempotent.", transactionId);
            return mapToTransactionResponse(transaction);
        }

        if (transaction.getStatus() == InventoryTransactionStatus.CANCELLED) {
            throw new BusinessException(ErrorCode.INVENTORY_TRANSACTION_ALREADY_CONFIRMED, "Phiếu giao dịch đã bị hủy, không thể xác nhận");
        }

        String currentUser = getCurrentUsername();
        InventoryTransactionType type = transaction.getType();

        for (InventoryTransactionItem item : transaction.getItems()) {
            Ingredient ingredient = item.getIngredient();
            InventoryStock stock = stockRepository.findByIngredientId(ingredient.getId())
                    .orElseGet(() -> stockRepository.save(InventoryStock.builder().ingredient(ingredient).build()));

            BigDecimal oldStock = stock.getQuantityOnHand() != null ? stock.getQuantityOnHand() : BigDecimal.ZERO;
            BigDecimal oldAvgCost = stock.getAverageCost() != null ? stock.getAverageCost() : BigDecimal.ZERO;
            BigDecimal baseQty = item.getBaseQuantity();

            item.setStockBefore(oldStock);

            if (type == InventoryTransactionType.IMPORT || type == InventoryTransactionType.ADJUSTMENT_IN) {
                // TĂNG KHO
                BigDecimal newStock = oldStock.add(baseQty);

                // Tính Đơn giá theo baseUnit
                BigDecimal unitCostBase = UnitConverter.convertUnitCostToBase(item.getUnitCost(), item.getInputUnit(), ingredient.getBaseUnit());

                BigDecimal newAvgCost;
                if (oldStock.compareTo(BigDecimal.ZERO) <= 0) {
                    newAvgCost = unitCostBase;
                } else {
                    BigDecimal oldTotalValue = oldStock.multiply(oldAvgCost);
                    BigDecimal newImportValue = baseQty.multiply(unitCostBase);
                    newAvgCost = oldTotalValue.add(newImportValue).divide(newStock, 2, RoundingMode.HALF_UP);
                }

                stock.setQuantityOnHand(newStock);
                stock.setAverageCost(newAvgCost);
                item.setStockAfter(newStock);

            } else {
                // GIẢM KHO (MANUAL_EXPORT, WASTE, EXPIRED, ADJUSTMENT_OUT)
                if (oldStock.compareTo(baseQty) < 0) {
                    throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK,
                            String.format("Nguyên liệu '%s' (%s) không đủ tồn kho. Cần: %s %s, Tồn hiện tại: %s %s",
                                    ingredient.getName(), ingredient.getCode(), baseQty, ingredient.getBaseUnit(), oldStock, ingredient.getBaseUnit()));
                }

                BigDecimal newStock = oldStock.subtract(baseQty);
                stock.setQuantityOnHand(newStock);
                // Giữ nguyên averageCost khi xuất kho
                item.setStockAfter(newStock);
            }

            stockRepository.save(stock);
        }

        transaction.setStatus(InventoryTransactionStatus.CONFIRMED);
        transaction.setConfirmedAt(LocalDateTime.now());
        transaction.setConfirmedBy(currentUser);

        InventoryTransaction saved = transactionRepository.save(transaction);
        return mapToTransactionResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryTransactionResponse getTransactionById(Long id) {
        InventoryTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.INVENTORY_TRANSACTION_NOT_FOUND));
        return mapToTransactionResponse(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<InventoryTransactionResponse> filterTransactions(
            String transactionCode,
            InventoryTransactionType type,
            InventoryTransactionStatus status,
            String referenceId,
            Long ingredientId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {

        Page<InventoryTransaction> page = transactionRepository.filterTransactions(
                transactionCode, type, status, referenceId, ingredientId, startDate, endDate, pageable);

        Page<InventoryTransactionResponse> responsePage = page.map(this::mapToTransactionResponse);
        return new PageResponse<>(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<IngredientResponse> filterStocks(String keyword, Boolean lowStockOnly, Pageable pageable) {
        Page<InventoryStock> page = stockRepository.filterStocks(keyword, lowStockOnly, pageable);

        Page<IngredientResponse> responsePage = page.map(stock -> {
            Ingredient ing = stock.getIngredient();
            return IngredientResponse.builder()
                    .id(ing.getId())
                    .code(ing.getCode())
                    .name(ing.getName())
                    .baseUnit(ing.getBaseUnit())
                    .description(ing.getDescription())
                    .lowStockThreshold(ing.getLowStockThreshold())
                    .active(ing.isActive())
                    .quantityOnHand(stock.getQuantityOnHand())
                    .averageCost(stock.getAverageCost())
                    .createdAt(ing.getCreatedAt())
                    .createdBy(ing.getCreatedBy())
                    .updatedAt(ing.getUpdatedAt())
                    .updatedBy(ing.getUpdatedBy())
                    .build();
        });

        return new PageResponse<>(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryDashboardResponse getDashboardSummary() {
        long totalActive = ingredientRepository.countByActiveTrue();

        List<InventoryStock> allStocks = stockRepository.findAll();

        long lowStockCount = 0;
        long outOfStockCount = 0;
        BigDecimal totalValue = BigDecimal.ZERO;

        for (InventoryStock stock : allStocks) {
            if (stock.getIngredient() != null && stock.getIngredient().isActive()) {
                BigDecimal qty = stock.getQuantityOnHand() != null ? stock.getQuantityOnHand() : BigDecimal.ZERO;
                BigDecimal avgCost = stock.getAverageCost() != null ? stock.getAverageCost() : BigDecimal.ZERO;

                totalValue = totalValue.add(qty.multiply(avgCost));

                if (qty.compareTo(BigDecimal.ZERO) <= 0) {
                    outOfStockCount++;
                } else if (qty.compareTo(stock.getIngredient().getLowStockThreshold()) <= 0) {
                    lowStockCount++;
                }
            }
        }

        Pageable recentPageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<InventoryTransaction> recentPage = transactionRepository.findAll(recentPageable);
        List<InventoryTransactionResponse> recentList = recentPage.stream().map(this::mapToTransactionResponse).toList();

        return InventoryDashboardResponse.builder()
                .totalActiveIngredients(totalActive)
                .lowStockCount(lowStockCount)
                .outOfStockCount(outOfStockCount)
                .totalStockValue(totalValue.setScale(2, RoundingMode.HALF_UP))
                .recentTransactions(recentList)
                .build();
    }

    private InventoryTransactionResponse mapToTransactionResponse(InventoryTransaction transaction) {
        BigDecimal totalValue = BigDecimal.ZERO;
        List<TransactionItemResponse> itemResponses = new ArrayList<>();

        if (transaction.getItems() != null) {
            for (InventoryTransactionItem item : transaction.getItems()) {
                Ingredient ing = item.getIngredient();
                BigDecimal itemTotal = item.getTotalCost() != null ? item.getTotalCost() : BigDecimal.ZERO;
                totalValue = totalValue.add(itemTotal);

                itemResponses.add(TransactionItemResponse.builder()
                        .id(item.getId())
                        .ingredientId(ing.getId())
                        .ingredientCode(ing.getCode())
                        .ingredientName(ing.getName())
                        .inputQuantity(item.getInputQuantity())
                        .inputUnit(item.getInputUnit())
                        .baseQuantity(item.getBaseQuantity())
                        .baseUnit(ing.getBaseUnit())
                        .unitCost(item.getUnitCost())
                        .totalCost(itemTotal)
                        .batchCode(item.getBatchCode())
                        .expiryDate(item.getExpiryDate())
                        .stockBefore(item.getStockBefore())
                        .stockAfter(item.getStockAfter())
                        .build());
            }
        }

        return InventoryTransactionResponse.builder()
                .id(transaction.getId())
                .code(transaction.getCode())
                .type(transaction.getType())
                .status(transaction.getStatus())
                .referenceType(transaction.getReferenceType())
                .referenceId(transaction.getReferenceId())
                .supplierName(transaction.getSupplierName())
                .note(transaction.getNote())
                .totalValue(totalValue.setScale(2, RoundingMode.HALF_UP))
                .createdAt(transaction.getCreatedAt())
                .createdBy(transaction.getCreatedBy())
                .confirmedAt(transaction.getConfirmedAt())
                .confirmedBy(transaction.getConfirmedBy())
                .items(itemResponses)
                .build();
    }

    private String generateTransactionCode(InventoryTransactionType type) {
        String prefix = (type == InventoryTransactionType.IMPORT) ? "IMP" :
                (type == InventoryTransactionType.ADJUSTMENT_IN || type == InventoryTransactionType.ADJUSTMENT_OUT) ? "ADJ" : "EXP";
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomStr = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return prefix + "-" + dateStr + "-" + randomStr;
    }

    private String getCurrentUsername() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "SYSTEM";
        }
    }

    @Override
    @Transactional
    public void deductStockForOrder(Order order) {
        if (order == null || order.getId() == null) return;
        String orderIdStr = String.valueOf(order.getId());

        // 1. Idempotency Check
        Optional<InventoryTransaction> existingConsumption = transactionRepository
                .findByReferenceTypeAndReferenceIdAndTypeAndStatus(
                        "ORDER", orderIdStr, InventoryTransactionType.ORDER_CONSUMPTION, InventoryTransactionStatus.CONFIRMED);
        if (existingConsumption.isPresent()) {
            log.info("Đơn hàng #{} đã được trừ kho trước đó. Bỏ qua để đảm bảo tính Idempotent.", order.getId());
            return;
        }

        if (order.getOrderDetails() == null || order.getOrderDetails().isEmpty()) {
            log.warn("Đơn hàng #{} không có chi tiết món ăn để trừ kho.", order.getId());
            return;
        }

        // 2. Tính tổng số lượng từng nguyên liệu cần cho đơn hàng (Gộp trùng lặp)
        Map<Ingredient, BigDecimal> requiredMap = new HashMap<>();

        for (OrderDetail detail : order.getOrderDetails()) {
            Dish dish = detail.getDish();
            if (dish == null && detail.getDishName() != null) {
                dish = dishRepository.findByNameDish(detail.getDishName()).orElse(null);
            }

            if (dish == null) {
                log.warn("Không tìm thấy món ăn cho chi tiết đơn hàng: {}", detail.getDishName());
                continue;
            }

            List<MenuItemIngredient> recipeItems = menuItemIngredientRepository.findByDishIdWithIngredient(dish.getId());
            if (recipeItems.isEmpty()) {
                continue;
            }

            BigDecimal orderedDishQty = new BigDecimal(detail.getQuantity());

            for (MenuItemIngredient recipeItem : recipeItems) {
                Ingredient ingredient = recipeItem.getIngredient();
                BigDecimal recipeIngredientQty = recipeItem.getQuantity();
                BigDecimal totalNeeded = recipeIngredientQty.multiply(orderedDishQty);

                requiredMap.put(ingredient, requiredMap.getOrDefault(ingredient, BigDecimal.ZERO).add(totalNeeded));
            }
        }

        if (requiredMap.isEmpty()) {
            log.info("Đơn hàng #{} không chứa món nào có cấu hình công thức nguyên liệu.", order.getId());
            return;
        }

        // 3. Validation: Kiểm tra tồn kho của TẤT CẢ nguyên liệu trước
        List<String> missingDetails = new ArrayList<>();

        for (Map.Entry<Ingredient, BigDecimal> entry : requiredMap.entrySet()) {
            Ingredient ingredient = entry.getKey();
            BigDecimal requiredQty = entry.getValue();

            InventoryStock stock = stockRepository.findByIngredientId(ingredient.getId())
                    .orElseGet(() -> stockRepository.save(InventoryStock.builder().ingredient(ingredient).build()));

            BigDecimal availableQty = stock.getQuantityOnHand() != null ? stock.getQuantityOnHand() : BigDecimal.ZERO;

            if (availableQty.compareTo(requiredQty) < 0) {
                missingDetails.add(String.format("Nguyên liệu '%s' (%s): cần %s %s, hiện có %s %s",
                        ingredient.getName(), ingredient.getCode(), requiredQty, ingredient.getBaseUnit(), availableQty, ingredient.getBaseUnit()));
            }
        }

        // 4. Nếu thiếu dù chỉ 1 nguyên liệu -> Báo lỗi & Rollback toàn bộ đơn hàng
        if (!missingDetails.isEmpty()) {
            String errorMsg = "Không đủ nguyên liệu trong kho để thực hiện đơn hàng #" + order.getId() + ": " + String.join("; ", missingDetails);
            log.error(errorMsg);
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK, errorMsg);
        }

        // 5. Nếu đủ -> Tạo giao dịch ORDER_CONSUMPTION và trừ kho
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String transCode = "ORD-" + dateStr + "-" + order.getId();

        InventoryTransaction transaction = InventoryTransaction.builder()
                .code(transCode)
                .type(InventoryTransactionType.ORDER_CONSUMPTION)
                .status(InventoryTransactionStatus.CONFIRMED)
                .referenceType("ORDER")
                .referenceId(orderIdStr)
                .note("Trừ kho tự động theo đơn hàng #" + order.getId())
                .confirmedAt(LocalDateTime.now())
                .confirmedBy("SYSTEM")
                .createdBy("SYSTEM")
                .build();

        List<InventoryTransactionItem> transItems = new ArrayList<>();

        for (Map.Entry<Ingredient, BigDecimal> entry : requiredMap.entrySet()) {
            Ingredient ingredient = entry.getKey();
            BigDecimal requiredQty = entry.getValue();

            InventoryStock stock = stockRepository.findByIngredientId(ingredient.getId()).orElseThrow();
            BigDecimal oldStock = stock.getQuantityOnHand();
            BigDecimal newStock = oldStock.subtract(requiredQty);

            stock.setQuantityOnHand(newStock);
            stockRepository.save(stock);

            BigDecimal avgCost = stock.getAverageCost() != null ? stock.getAverageCost() : BigDecimal.ZERO;
            BigDecimal itemTotalCost = requiredQty.multiply(avgCost);

            InventoryTransactionItem item = InventoryTransactionItem.builder()
                    .transaction(transaction)
                    .ingredient(ingredient)
                    .inputQuantity(requiredQty)
                    .inputUnit(ingredient.getBaseUnit())
                    .baseQuantity(requiredQty)
                    .unitCost(avgCost)
                    .totalCost(itemTotalCost)
                    .stockBefore(oldStock)
                    .stockAfter(newStock)
                    .build();

            transItems.add(item);
        }

        transaction.setItems(transItems);
        transactionRepository.save(transaction);
        log.info("Đã trừ kho thành công cho đơn hàng #{}, giao dịch: {}", order.getId(), transCode);
    }

    @Override
    @Transactional
    public void returnStockForOrder(Order order) {
        if (order == null || order.getId() == null) return;
        String orderIdStr = String.valueOf(order.getId());

        // 1. Kiểm tra đơn hàng đã từng bị trừ kho chưa
        Optional<InventoryTransaction> consumptionOpt = transactionRepository
                .findByReferenceTypeAndReferenceIdAndTypeAndStatus(
                        "ORDER", orderIdStr, InventoryTransactionType.ORDER_CONSUMPTION, InventoryTransactionStatus.CONFIRMED);

        if (consumptionOpt.isEmpty()) {
            log.info("Đơn hàng #{} chưa từng bị trừ kho nên không cần hoàn kho.", order.getId());
            return;
        }

        // 2. Idempotency Check: Kiểm tra đơn hàng đã từng hoàn kho chưa
        Optional<InventoryTransaction> existingReturn = transactionRepository
                .findByReferenceTypeAndReferenceIdAndTypeAndStatus(
                        "ORDER", orderIdStr, InventoryTransactionType.ORDER_RETURN, InventoryTransactionStatus.CONFIRMED);

        if (existingReturn.isPresent()) {
            log.info("Đơn hàng #{} đã được hoàn kho trước đó. Bỏ qua để đảm bảo tính Idempotent.", order.getId());
            return;
        }

        InventoryTransaction consumptionTx = consumptionOpt.get();
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String transCode = "RET-" + dateStr + "-" + order.getId();

        InventoryTransaction returnTx = InventoryTransaction.builder()
                .code(transCode)
                .type(InventoryTransactionType.ORDER_RETURN)
                .status(InventoryTransactionStatus.CONFIRMED)
                .referenceType("ORDER")
                .referenceId(orderIdStr)
                .note("Hoàn kho tự động theo đơn hàng bị hủy #" + order.getId())
                .confirmedAt(LocalDateTime.now())
                .confirmedBy("SYSTEM")
                .createdBy("SYSTEM")
                .build();

        List<InventoryTransactionItem> returnItems = new ArrayList<>();

        // Sử dụng SNAPSHOT từ giao dịch tiêu thụ ban đầu
        for (InventoryTransactionItem consumptionItem : consumptionTx.getItems()) {
            Ingredient ingredient = consumptionItem.getIngredient();
            BigDecimal returnQty = consumptionItem.getBaseQuantity();

            InventoryStock stock = stockRepository.findByIngredientId(ingredient.getId())
                    .orElseGet(() -> stockRepository.save(InventoryStock.builder().ingredient(ingredient).build()));

            BigDecimal oldStock = stock.getQuantityOnHand() != null ? stock.getQuantityOnHand() : BigDecimal.ZERO;
            BigDecimal newStock = oldStock.add(returnQty);

            stock.setQuantityOnHand(newStock);
            stockRepository.save(stock);

            InventoryTransactionItem item = InventoryTransactionItem.builder()
                    .transaction(returnTx)
                    .ingredient(ingredient)
                    .inputQuantity(returnQty)
                    .inputUnit(ingredient.getBaseUnit())
                    .baseQuantity(returnQty)
                    .unitCost(stock.getAverageCost())
                    .totalCost(returnQty.multiply(stock.getAverageCost() != null ? stock.getAverageCost() : BigDecimal.ZERO))
                    .stockBefore(oldStock)
                    .stockAfter(newStock)
                    .build();

            returnItems.add(item);
        }

        returnTx.setItems(returnItems);
        transactionRepository.save(returnTx);
        log.info("Đã hoàn kho thành công cho đơn hàng bị hủy #{}, giao dịch: {}", order.getId(), transCode);
    }
}
