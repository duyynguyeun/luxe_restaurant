package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.inventory.InventoryTransactionRequest;
import com.luxe_restaurant.app.requests.inventory.TransactionItemRequest;
import com.luxe_restaurant.app.responses.inventory.InventoryTransactionResponse;
import com.luxe_restaurant.domain.entities.Ingredient;
import com.luxe_restaurant.domain.entities.InventoryStock;
import com.luxe_restaurant.domain.entities.InventoryTransaction;
import com.luxe_restaurant.domain.entities.InventoryTransactionItem;
import com.luxe_restaurant.domain.enums.IngredientUnit;
import com.luxe_restaurant.domain.enums.InventoryTransactionStatus;
import com.luxe_restaurant.domain.enums.InventoryTransactionType;
import com.luxe_restaurant.domain.exception.BusinessException;
import com.luxe_restaurant.domain.repositories.DishRepository;
import com.luxe_restaurant.domain.repositories.IngredientRepository;
import com.luxe_restaurant.domain.repositories.InventoryStockRepository;
import com.luxe_restaurant.domain.repositories.InventoryTransactionRepository;
import com.luxe_restaurant.domain.repositories.MenuItemIngredientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class InventoryServiceImplTest {

    private InventoryTransactionRepository transactionRepository;
    private InventoryStockRepository stockRepository;
    private IngredientRepository ingredientRepository;
    private DishRepository dishRepository;
    private MenuItemIngredientRepository menuItemIngredientRepository;
    private InventoryServiceImpl inventoryService;

    private Ingredient testIngredient;

    @BeforeEach
    void setUp() {
        transactionRepository = mock(InventoryTransactionRepository.class);
        stockRepository = mock(InventoryStockRepository.class);
        ingredientRepository = mock(IngredientRepository.class);
        dishRepository = mock(DishRepository.class);
        menuItemIngredientRepository = mock(MenuItemIngredientRepository.class);

        inventoryService = new InventoryServiceImpl(
                transactionRepository,
                stockRepository,
                ingredientRepository,
                dishRepository,
                menuItemIngredientRepository
        );

        testIngredient = Ingredient.builder()
                .id(1L)
                .code("ING_BO")
                .name("Thịt bò")
                .baseUnit(IngredientUnit.GRAM)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Xác nhận phiếu nhập kho (IMPORT) thành công: Tăng tồn kho và tính lại Average Cost")
    void testConfirmImportTransaction_Success() {
        InventoryStock stock = InventoryStock.builder()
                .id(1L)
                .ingredient(testIngredient)
                .quantityOnHand(new BigDecimal("1000")) // Tồn cũ 1000g
                .averageCost(new BigDecimal("200"))       // Giá cũ 200/g
                .build();

        InventoryTransactionItem item = InventoryTransactionItem.builder()
                .id(10L)
                .ingredient(testIngredient)
                .inputQuantity(new BigDecimal("2"))        // Mua 2 KG
                .inputUnit(IngredientUnit.KILOGRAM)
                .baseQuantity(new BigDecimal("2000"))      // Quy đổi 2000 GRAM
                .unitCost(new BigDecimal("300000"))        // 300.000 / KG -> 300 / GRAM
                .build();

        InventoryTransaction transaction = InventoryTransaction.builder()
                .id(100L)
                .code("IMP-20260802-001")
                .type(InventoryTransactionType.IMPORT)
                .status(InventoryTransactionStatus.DRAFT)
                .items(List.of(item))
                .build();

        item.setTransaction(transaction);

        when(transactionRepository.findById(100L)).thenReturn(Optional.of(transaction));
        when(stockRepository.findByIngredientId(1L)).thenReturn(Optional.of(stock));
        when(transactionRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        InventoryTransactionResponse response = inventoryService.confirmTransaction(100L);

        assertEquals(InventoryTransactionStatus.CONFIRMED, response.getStatus());

        // Kiểm tra tồn kho mới: 1000 + 2000 = 3000g
        assertEquals(new BigDecimal("3000"), stock.getQuantityOnHand());

        // Giá vốn cũ: (1000 * 200) + (2000 * 300) = 200.000 + 600.000 = 800.000 / 3000 = 266.67
        assertEquals(new BigDecimal("266.67"), stock.getAverageCost());
    }

    @Test
    @DisplayName("Confirm phiếu 2 lần có tính chất Idempotent (không cộng dồn tồn kho 2 lần)")
    void testConfirmTransaction_Idempotency() {
        InventoryTransaction transaction = InventoryTransaction.builder()
                .id(100L)
                .code("IMP-20260802-001")
                .type(InventoryTransactionType.IMPORT)
                .status(InventoryTransactionStatus.CONFIRMED) // Đã confirm rồi
                .items(new ArrayList<>())
                .build();

        when(transactionRepository.findById(100L)).thenReturn(Optional.of(transaction));

        InventoryTransactionResponse response = inventoryService.confirmTransaction(100L);

        assertEquals(InventoryTransactionStatus.CONFIRMED, response.getStatus());
        verify(stockRepository, never()).save(any());
    }

    @Test
    @DisplayName("Xuất kho vượt quá số lượng tồn kho hiện tại sẽ báo lỗi INSUFFICIENT_STOCK và Rollback")
    void testConfirmExportTransaction_InsufficientStock() {
        InventoryStock stock = InventoryStock.builder()
                .id(1L)
                .ingredient(testIngredient)
                .quantityOnHand(new BigDecimal("500")) // Tồn kho chỉ có 500g
                .build();

        InventoryTransactionItem item = InventoryTransactionItem.builder()
                .id(10L)
                .ingredient(testIngredient)
                .inputQuantity(new BigDecimal("1"))        // Xuất 1 KG = 1000g
                .inputUnit(IngredientUnit.KILOGRAM)
                .baseQuantity(new BigDecimal("1000"))
                .build();

        InventoryTransaction transaction = InventoryTransaction.builder()
                .id(101L)
                .code("EXP-20260802-001")
                .type(InventoryTransactionType.MANUAL_EXPORT)
                .status(InventoryTransactionStatus.DRAFT)
                .items(List.of(item))
                .build();

        item.setTransaction(transaction);

        when(transactionRepository.findById(101L)).thenReturn(Optional.of(transaction));
        when(stockRepository.findByIngredientId(1L)).thenReturn(Optional.of(stock));

        assertThrows(BusinessException.class, () -> inventoryService.confirmTransaction(101L));
        // Tồn kho không bị thay đổi
        assertEquals(new BigDecimal("500"), stock.getQuantityOnHand());
    }
}
