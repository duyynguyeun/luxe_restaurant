package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.inventory.InventoryTransactionRequest;
import com.luxe_restaurant.app.responses.ingredient.IngredientResponse;
import com.luxe_restaurant.app.responses.inventory.InventoryDashboardResponse;
import com.luxe_restaurant.app.responses.inventory.InventoryTransactionResponse;
import com.luxe_restaurant.app.responses.page.PageResponse;
import com.luxe_restaurant.domain.enums.InventoryTransactionStatus;
import com.luxe_restaurant.domain.enums.InventoryTransactionType;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface InventoryService {

    InventoryTransactionResponse createTransaction(InventoryTransactionRequest request);

    InventoryTransactionResponse confirmTransaction(Long transactionId);

    InventoryTransactionResponse getTransactionById(Long id);

    PageResponse<InventoryTransactionResponse> filterTransactions(
            String transactionCode,
            InventoryTransactionType type,
            InventoryTransactionStatus status,
            String referenceId,
            Long ingredientId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable);

    PageResponse<IngredientResponse> filterStocks(String keyword, Boolean lowStockOnly, Pageable pageable);

    InventoryDashboardResponse getDashboardSummary();

    void deductStockForOrder(com.luxe_restaurant.domain.entities.Order order);

    void returnStockForOrder(com.luxe_restaurant.domain.entities.Order order);
}
