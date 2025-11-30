package com.luxe_restaurant.app.requests.promotion;

import lombok.Data;

@Data
public class PromotionRequest {
    private String title;
    private String imageUrl;
    private String description;
}
