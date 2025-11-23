package com.luxe_restaurant.domain.enums;

public enum OrderStatus {
    PENDING,    // Chờ xác nhận
    PAID,       // Đã thanh toán
    PREPARING,  // Đang chuẩn bị
    COMPLETED,  // Hoàn thành
    CANCELLED   // Đã hủy
}