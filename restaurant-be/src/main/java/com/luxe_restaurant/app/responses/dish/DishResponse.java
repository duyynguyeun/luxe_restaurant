package com.luxe_restaurant.app.responses.dish;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishResponse {
    private String id;
    private String nameDish;
    private String urlImage;
    private BigDecimal price;
    private String categoryName;
    // --- QUAN TRỌNG: DÒNG NÀY GIÚP LƯU TRẠNG THÁI ---
    private boolean active;
    
    // --- BẮT BUỘC PHẢI CÓ DÒNG NÀY ---
    private Long categoryId;
    
}
