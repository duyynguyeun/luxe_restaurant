package com.luxe_restaurant.app.responses.dish;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {
    private Long id;      // Đã đổi thành Long cho khớp với Database
    private String name;  
}