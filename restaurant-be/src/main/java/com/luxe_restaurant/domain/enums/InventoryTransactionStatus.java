package com.luxe_restaurant.domain.enums;

public enum InventoryTransactionStatus {
    DRAFT("Bản nháp"),
    CONFIRMED("Đã xác nhận"),
    CANCELLED("Đã hủy");

    private final String description;

    InventoryTransactionStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
