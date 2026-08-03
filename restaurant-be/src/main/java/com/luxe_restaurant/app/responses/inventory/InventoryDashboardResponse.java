package com.luxe_restaurant.app.responses.inventory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDashboardResponse {

    private long totalActiveIngredients;
    private long lowStockCount;
    private long outOfStockCount;
    private BigDecimal totalStockValue; // sum(quantityOnHand * averageCost)
    private List<InventoryTransactionResponse> recentTransactions;
}
