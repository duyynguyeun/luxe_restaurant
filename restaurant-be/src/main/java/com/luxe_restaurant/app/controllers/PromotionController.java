package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.promotion.PromotionRequest;
import com.luxe_restaurant.app.responses.promotion.PromotionResponse;
import com.luxe_restaurant.domain.services.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotion")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    @PostMapping("/create")
    public PromotionResponse createPromotion(@RequestBody PromotionRequest promotionRequest) {
        return promotionService.CreatePromotion(promotionRequest);
    }

    @PostMapping("/update/{id}")
    public PromotionResponse updatePromotion(@PathVariable Long id, @RequestBody PromotionRequest promotionRequest) {
        return promotionService.updatePromotion(id, promotionRequest);
    }
}
