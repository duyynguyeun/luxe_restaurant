package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.domain.entities.*;
import com.luxe_restaurant.domain.enums.IngredientUnit;
import com.luxe_restaurant.domain.enums.InventoryTransactionStatus;
import com.luxe_restaurant.domain.enums.InventoryTransactionType;
import com.luxe_restaurant.domain.exception.BusinessException;
import com.luxe_restaurant.domain.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderInventoryIntegrationTest {

    private InventoryTransactionRepository transactionRepository;
    private InventoryStockRepository stockRepository;
    private IngredientRepository ingredientRepository;
    private DishRepository dishRepository;
    private MenuItemIngredientRepository menuItemIngredientRepository;
    private InventoryServiceImpl inventoryService;

    private Dish testDish;
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

        testDish = new Dish();
        testDish.setId(10L);
        testDish.setNameDish("Phở Bò");

        testIngredient = Ingredient.builder()
                .id(1L)
                .code("ING_BO")
                .name("Thịt bò")
                .baseUnit(IngredientUnit.GRAM)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Tự động trừ kho theo đơn hàng khi đủ tồn kho")
    void testDeductStockForOrder_Success() {
        Order order = new Order();
        order.setId(100L);

        OrderDetail detail = OrderDetail.builder()
                .dish(testDish)
                .dishName("Phở Bò")
                .quantity(2)
                .build();
        order.setOrderDetails(List.of(detail));

        // Công thức: 1 bát Phở = 150g Thịt bò -> 2 bát = 300g
        MenuItemIngredient recipe = MenuItemIngredient.builder()
                .dish(testDish)
                .ingredient(testIngredient)
                .quantity(new BigDecimal("150"))
                .build();

        InventoryStock stock = InventoryStock.builder()
                .id(1L)
                .ingredient(testIngredient)
                .quantityOnHand(new BigDecimal("1000"))
                .averageCost(new BigDecimal("200"))
                .build();

        when(transactionRepository.findByReferenceTypeAndReferenceIdAndTypeAndStatus(
                "ORDER", "100", InventoryTransactionType.ORDER_CONSUMPTION, InventoryTransactionStatus.CONFIRMED))
                .thenReturn(Optional.empty());

        when(menuItemIngredientRepository.findByDishIdWithIngredient(10L)).thenReturn(List.of(recipe));
        when(stockRepository.findByIngredientId(1L)).thenReturn(Optional.of(stock));

        inventoryService.deductStockForOrder(order);

        // Kiểm tra tồn kho sau khi trừ: 1000 - 300 = 700g
        assertEquals(new BigDecimal("700"), stock.getQuantityOnHand());
        verify(transactionRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Trừ kho tự động khi thiếu nguyên liệu sẽ báo lỗi INSUFFICIENT_STOCK")
    void testDeductStockForOrder_InsufficientStock() {
        Order order = new Order();
        order.setId(101L);

        OrderDetail detail = OrderDetail.builder()
                .dish(testDish)
                .dishName("Phở Bò")
                .quantity(5) // 5 bát = 750g
                .build();
        order.setOrderDetails(List.of(detail));

        MenuItemIngredient recipe = MenuItemIngredient.builder()
                .dish(testDish)
                .ingredient(testIngredient)
                .quantity(new BigDecimal("150"))
                .build();

        InventoryStock stock = InventoryStock.builder()
                .id(1L)
                .ingredient(testIngredient)
                .quantityOnHand(new BigDecimal("500")) // Chỉ có 500g
                .build();

        when(transactionRepository.findByReferenceTypeAndReferenceIdAndTypeAndStatus(
                "ORDER", "101", InventoryTransactionType.ORDER_CONSUMPTION, InventoryTransactionStatus.CONFIRMED))
                .thenReturn(Optional.empty());

        when(menuItemIngredientRepository.findByDishIdWithIngredient(10L)).thenReturn(List.of(recipe));
        when(stockRepository.findByIngredientId(1L)).thenReturn(Optional.of(stock));

        assertThrows(BusinessException.class, () -> inventoryService.deductStockForOrder(order));
        assertEquals(new BigDecimal("500"), stock.getQuantityOnHand()); // Tồn không bị đổi
    }

    @Test
    @DisplayName("Hoàn kho khi đơn hàng bị hủy dựa vào SNAPSHOT ban đầu")
    void testReturnStockForOrder_Success() {
        Order order = new Order();
        order.setId(102L);

        InventoryTransactionItem consumptionItem = InventoryTransactionItem.builder()
                .ingredient(testIngredient)
                .baseQuantity(new BigDecimal("300")) // Tiêu thụ 300g
                .build();

        InventoryTransaction consumptionTx = InventoryTransaction.builder()
                .id(500L)
                .code("ORD-20260802-102")
                .type(InventoryTransactionType.ORDER_CONSUMPTION)
                .status(InventoryTransactionStatus.CONFIRMED)
                .items(List.of(consumptionItem))
                .build();

        InventoryStock stock = InventoryStock.builder()
                .id(1L)
                .ingredient(testIngredient)
                .quantityOnHand(new BigDecimal("700"))
                .averageCost(new BigDecimal("200"))
                .build();

        // 1. Đã từng trừ kho (nhận về consumptionTx)
        when(transactionRepository.findByReferenceTypeAndReferenceIdAndTypeAndStatus(
                "ORDER", "102", InventoryTransactionType.ORDER_CONSUMPTION, InventoryTransactionStatus.CONFIRMED))
                .thenReturn(Optional.of(consumptionTx));

        // 2. Chưa từng hoàn kho
        when(transactionRepository.findByReferenceTypeAndReferenceIdAndTypeAndStatus(
                "ORDER", "102", InventoryTransactionType.ORDER_RETURN, InventoryTransactionStatus.CONFIRMED))
                .thenReturn(Optional.empty());

        when(stockRepository.findByIngredientId(1L)).thenReturn(Optional.of(stock));

        inventoryService.returnStockForOrder(order);

        // Kiểm tra tồn kho sau hoàn: 700 + 300 = 1000g
        assertEquals(new BigDecimal("1000"), stock.getQuantityOnHand());
        verify(transactionRepository, times(1)).save(any());
    }
}
