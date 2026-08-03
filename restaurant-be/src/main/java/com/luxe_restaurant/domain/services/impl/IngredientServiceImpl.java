package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.ingredient.IngredientRequest;
import com.luxe_restaurant.app.responses.ingredient.IngredientResponse;
import com.luxe_restaurant.app.responses.page.PageResponse;
import com.luxe_restaurant.domain.entities.Ingredient;
import com.luxe_restaurant.domain.entities.InventoryStock;
import com.luxe_restaurant.domain.exception.BusinessException;
import com.luxe_restaurant.domain.exception.ErrorCode;
import com.luxe_restaurant.domain.exception.NotFoundException;
import com.luxe_restaurant.domain.repositories.IngredientRepository;
import com.luxe_restaurant.domain.repositories.InventoryStockRepository;
import com.luxe_restaurant.domain.services.IngredientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class IngredientServiceImpl implements IngredientService {

    private final IngredientRepository ingredientRepository;
    private final InventoryStockRepository inventoryStockRepository;

    @Override
    @Transactional
    public IngredientResponse createIngredient(IngredientRequest request) {
        if (ingredientRepository.existsByCode(request.getCode())) {
            throw new BusinessException(ErrorCode.INGREDIENT_002);
        }

        String currentUser = getCurrentUsername();

        Ingredient ingredient = Ingredient.builder()
                .code(request.getCode().trim().toUpperCase())
                .name(request.getName().trim())
                .baseUnit(request.getBaseUnit())
                .description(request.getDescription())
                .lowStockThreshold(request.getLowStockThreshold() != null ? request.getLowStockThreshold() : BigDecimal.ZERO)
                .active(request.getActive() != null ? request.getActive() : true)
                .createdBy(currentUser)
                .updatedBy(currentUser)
                .build();

        Ingredient saved = ingredientRepository.save(ingredient);

        // Khởi tạo bản ghi tồn kho mặc định
        InventoryStock stock = InventoryStock.builder()
                .ingredient(saved)
                .quantityOnHand(BigDecimal.ZERO)
                .averageCost(BigDecimal.ZERO)
                .build();
        inventoryStockRepository.save(stock);

        return mapToResponse(saved, stock);
    }

    @Override
    @Transactional
    public IngredientResponse updateIngredient(Long id, IngredientRequest request) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.INGREDIENT_001));

        if (ingredientRepository.existsByCodeAndIdNot(request.getCode().trim().toUpperCase(), id)) {
            throw new BusinessException(ErrorCode.INGREDIENT_002);
        }

        String currentUser = getCurrentUsername();

        ingredient.setCode(request.getCode().trim().toUpperCase());
        ingredient.setName(request.getName().trim());

        // Nếu thay đổi baseUnit, cần kiểm tra nếu đã có giao dịch kho/công thức hay chưa (ở đây chỉ cho phép nếu chưa phát sinh tồn kho)
        InventoryStock stock = inventoryStockRepository.findByIngredientId(id)
                .orElseGet(() -> inventoryStockRepository.save(InventoryStock.builder().ingredient(ingredient).build()));

        if (stock.getQuantityOnHand().compareTo(BigDecimal.ZERO) > 0 && ingredient.getBaseUnit() != request.getBaseUnit()) {
            throw new BusinessException(ErrorCode.INVALID_UNIT_CONVERSION, "Không thể thay đổi đơn vị cơ sở khi nguyên liệu đã có tồn kho > 0");
        }

        ingredient.setBaseUnit(request.getBaseUnit());
        ingredient.setDescription(request.getDescription());
        if (request.getLowStockThreshold() != null) {
            ingredient.setLowStockThreshold(request.getLowStockThreshold());
        }
        if (request.getActive() != null) {
            ingredient.setActive(request.getActive());
        }
        ingredient.setUpdatedBy(currentUser);

        Ingredient updated = ingredientRepository.save(ingredient);
        return mapToResponse(updated, stock);
    }

    @Override
    @Transactional
    public IngredientResponse toggleIngredientStatus(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.INGREDIENT_001));

        ingredient.setActive(!ingredient.isActive());
        ingredient.setUpdatedBy(getCurrentUsername());
        Ingredient saved = ingredientRepository.save(ingredient);

        InventoryStock stock = inventoryStockRepository.findByIngredientId(id).orElse(null);
        return mapToResponse(saved, stock);
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientResponse getIngredientById(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.INGREDIENT_001));

        InventoryStock stock = inventoryStockRepository.findByIngredientId(id).orElse(null);
        return mapToResponse(ingredient, stock);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<IngredientResponse> filterIngredients(String keyword, Boolean active, Pageable pageable) {
        Page<Ingredient> page = ingredientRepository.filterIngredients(keyword, active, pageable);
        Page<IngredientResponse> responsePage = page.map(ing -> {
            InventoryStock stock = inventoryStockRepository.findByIngredientId(ing.getId()).orElse(null);
            return mapToResponse(ing, stock);
        });
        return new PageResponse<>(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IngredientResponse> getLowStockIngredients() {
        List<InventoryStock> lowStocks = inventoryStockRepository.findLowStockIngredients();
        return lowStocks.stream()
                .map(stock -> mapToResponse(stock.getIngredient(), stock))
                .toList();
    }

    private IngredientResponse mapToResponse(Ingredient ingredient, InventoryStock stock) {
        return IngredientResponse.builder()
                .id(ingredient.getId())
                .code(ingredient.getCode())
                .name(ingredient.getName())
                .baseUnit(ingredient.getBaseUnit())
                .description(ingredient.getDescription())
                .lowStockThreshold(ingredient.getLowStockThreshold())
                .active(ingredient.isActive())
                .quantityOnHand(stock != null ? stock.getQuantityOnHand() : BigDecimal.ZERO)
                .averageCost(stock != null ? stock.getAverageCost() : BigDecimal.ZERO)
                .createdAt(ingredient.getCreatedAt())
                .createdBy(ingredient.getCreatedBy())
                .updatedAt(ingredient.getUpdatedAt())
                .updatedBy(ingredient.getUpdatedBy())
                .build();
    }

    private String getCurrentUsername() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "SYSTEM";
        }
    }
}
