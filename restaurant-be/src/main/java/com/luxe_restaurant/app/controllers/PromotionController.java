package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.promotion.PromotionRequest;
import com.luxe_restaurant.app.responses.promotion.PromotionResponse;
import com.luxe_restaurant.domain.services.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotion")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
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

    @DeleteMapping("/delete/{id}")
    public void deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }
}
