package com.luxe_restaurant.app.responses.promotion;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PromotionResponse {
    private Long id;
    private String title;
    private String imageUrl;
    private String description;
    private LocalDateTime createdAt;
}
