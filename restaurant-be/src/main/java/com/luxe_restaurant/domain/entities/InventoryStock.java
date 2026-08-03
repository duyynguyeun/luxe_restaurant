package com.luxe_restaurant.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_stocks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false, unique = true)
    private Ingredient ingredient;

    @Column(name = "quantity_on_hand", nullable = false, precision = 12, scale = 3)
    @Builder.Default
    private BigDecimal quantityOnHand = BigDecimal.ZERO;

    @Column(name = "average_cost", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal averageCost = BigDecimal.ZERO;

    @Version
    private Long version;

    @Column(name = "updated_at", columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}
