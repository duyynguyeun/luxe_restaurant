package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.responses.dish.CategoryResponse;
import java.util.List;

public interface CategoryService {
    // Khai báo hàm này để Class Impl có thể @Override
    List<CategoryResponse> getAllCategories();
}