package com.luxe_restaurant.domain.enums;

public enum InventoryTransactionType {
    IMPORT("Nhập kho"),
    MANUAL_EXPORT("Xuất kho thủ công"),
    ORDER_CONSUMPTION("Tiêu thụ theo đơn hàng"),
    ORDER_RETURN("Hoàn kho theo đơn hàng bị hủy"),
    WASTE("Hàng hỏng"),
    EXPIRED("Hàng hết hạn"),
    ADJUSTMENT_IN("Điều chỉnh tăng"),
    ADJUSTMENT_OUT("Điều chỉnh giảm");

    private final String description;

    InventoryTransactionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
