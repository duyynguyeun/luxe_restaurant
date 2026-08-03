package com.luxe_restaurant.app.requests.inventory;

import com.luxe_restaurant.domain.enums.InventoryTransactionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class InventoryTransactionRequest {

    @NotNull(message = "Loại giao dịch không được để trống")
    private InventoryTransactionType type;

    private String supplierName;

    private String note;

    @NotEmpty(message = "Danh sách chi tiết giao dịch không được rỗng")
    @Valid
    private List<TransactionItemRequest> items;
}
