package com.luxe_restaurant.app.requests.order;

import com.luxe_restaurant.domain.enums.PaymentMethod;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private Long userId; // <-- THÊM DÒNG NÀY (để biết ai đặt)
    private PaymentMethod paymentMethod;
    private BigDecimal totalPrice;
    private String note;
    private List<OrderItemRequest> items;
    
}