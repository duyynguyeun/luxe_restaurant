package com.luxe_restaurant.app.responses.inventory;

import com.luxe_restaurant.domain.enums.InventoryTransactionStatus;
import com.luxe_restaurant.domain.enums.InventoryTransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionResponse {

    private Long id;
    private String code;
    private InventoryTransactionType type;
    private InventoryTransactionStatus status;
    private String referenceType;
    private String referenceId;
    private String supplierName;
    private String note;
    private BigDecimal totalValue;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime confirmedAt;
    private String confirmedBy;
    private List<TransactionItemResponse> items;
}
