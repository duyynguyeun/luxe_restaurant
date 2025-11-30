package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.promotion.PromotionRequest;
import com.luxe_restaurant.app.responses.promotion.PromotionResponse;
import com.luxe_restaurant.domain.entities.Promotion;
import com.luxe_restaurant.domain.repositories.PromotionRepository;
import com.luxe_restaurant.domain.services.PromotionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {
    private final PromotionRepository promotionRepository;
    private final ModelMapper modelMapper;

    @Override
    public PromotionResponse CreatePromotion(PromotionRequest promotionRequest) {
        Promotion promotion = Promotion.builder()
                .title(promotionRequest.getTitle())
                .imageUrl(promotionRequest.getImageUrl())
                .description(promotionRequest.getDescription())
                .build();

        promotionRepository.save(promotion);

        return PromotionResponse.builder()
                .id(promotion.getId())
                .title(promotion.getTitle())
                .imageUrl(promotion.getImageUrl())
                .description(promotion.getDescription())
                .createdAt(promotion.getCreatedAt())
                .build();

    }

    @Override
    public PromotionResponse updatePromotion (Long id, PromotionRequest promotionRequest) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion Not Found"));

        promotion.setTitle(promotionRequest.getTitle());
        promotion.setImageUrl(promotionRequest.getImageUrl());
        promotion.setDescription(promotionRequest.getDescription());

        promotionRepository.save(promotion);

        return modelMapper.map(promotion, PromotionResponse.class);
    }
}
