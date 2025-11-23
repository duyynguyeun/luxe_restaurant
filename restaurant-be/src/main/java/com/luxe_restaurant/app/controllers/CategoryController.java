package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.responses.dish.CategoryResponse;
import com.luxe_restaurant.domain.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/getall")
    public List<CategoryResponse> getAllCategories(){
        return categoryService.getAllCategories();
    }
}