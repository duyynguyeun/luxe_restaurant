package com.luxe_restaurant.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.luxe_restaurant.domain.enums.IngredientUnit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_transaction_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    @JsonIgnore
    private InventoryTransaction transaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Column(name = "input_quantity", nullable = false, precision = 12, scale = 3)
    private BigDecimal inputQuantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "input_unit", nullable = false, length = 20)
    private IngredientUnit inputUnit;

    @Column(name = "base_quantity", nullable = false, precision = 12, scale = 3)
    private BigDecimal baseQuantity;

    @Column(name = "unit_cost", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal unitCost = BigDecimal.ZERO;

    @Column(name = "total_cost", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalCost = BigDecimal.ZERO;

    @Column(name = "batch_code", length = 50)
    private String batchCode;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "stock_before", precision = 12, scale = 3)
    private BigDecimal stockBefore;

    @Column(name = "stock_after", precision = 12, scale = 3)
    private BigDecimal stockAfter;
}
