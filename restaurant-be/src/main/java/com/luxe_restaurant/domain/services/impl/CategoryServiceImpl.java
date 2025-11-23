package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.responses.dish.CategoryResponse;
import com.luxe_restaurant.domain.entities.Category;
import com.luxe_restaurant.domain.repositories.CategoryRepository;
import com.luxe_restaurant.domain.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> modelMapper.map(category, CategoryResponse.class))
                .collect(Collectors.toList());
    }
}