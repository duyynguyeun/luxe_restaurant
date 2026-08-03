package com.luxe_restaurant.domain.entities;

import com.luxe_restaurant.domain.enums.InventoryTransactionStatus;
import com.luxe_restaurant.domain.enums.InventoryTransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inventory_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private InventoryTransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InventoryTransactionStatus status;

    @Column(name = "reference_type", length = 30)
    private String referenceType;

    @Column(name = "reference_id", length = 50)
    private String referenceId;

    @Column(name = "supplier_name", length = 255)
    private String supplierName;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at", columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "confirmed_at", columnDefinition = "DATETIME")
    private LocalDateTime confirmedAt;

    @Column(name = "confirmed_by")
    private String confirmedBy;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InventoryTransactionItem> items = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = InventoryTransactionStatus.DRAFT;
        }
    }
}
