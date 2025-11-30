package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.promotion.PromotionRequest;
import com.luxe_restaurant.app.responses.promotion.PromotionResponse;

public interface PromotionService {
    PromotionResponse CreatePromotion(PromotionRequest promotionRequest);
    PromotionResponse updatePromotion (Long id, PromotionRequest promotionRequest);
}
