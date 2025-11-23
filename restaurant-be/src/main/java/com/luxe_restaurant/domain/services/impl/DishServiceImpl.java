package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.dish.DishRequest;
import com.luxe_restaurant.app.responses.dish.DishResponse;
import com.luxe_restaurant.domain.entities.Category;
import com.luxe_restaurant.domain.entities.Dish;
import com.luxe_restaurant.domain.repositories.CategoryRepository;
import com.luxe_restaurant.domain.repositories.DishRepository;
import com.luxe_restaurant.domain.services.DishService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DishServiceImpl implements DishService {

    private final DishRepository dishRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    // Hàm map dữ liệu an toàn
    private DishResponse mapToResponse(Dish dish) {
        DishResponse response = modelMapper.map(dish, DishResponse.class);
        if (dish.getCategory() != null) {
            response.setCategoryName(dish.getCategory().getName());
            response.setCategoryId(dish.getCategory().getId());
        } else {
            response.setCategoryName("Chưa phân loại");
        }
        response.setActive(dish.isActive());
        return response;
    }

    @Override
    public DishResponse createDish(DishRequest dishRequest) {
        // Tìm danh mục, nếu không thấy thì để null (không báo lỗi 500)
        Category category = null;
        if (dishRequest.getCategoryId() != null) {
            category = categoryRepository.findById(dishRequest.getCategoryId()).orElse(null);
        }

        Dish dish = modelMapper.map(dishRequest, Dish.class);
        dish.setId(null);
        dish.setCategory(category);
        dish.setActive(true); // Món mới mặc định là BẬT

        Dish saveDish = dishRepository.save(dish);
        return mapToResponse(saveDish);
    }

    @Override
    public List<DishResponse> getAllDishes() {
        return dishRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DishResponse updateDish(Long id, DishRequest dishRequest) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish Not Found"));

        Category category = null;
        if (dishRequest.getCategoryId() != null) {
            category = categoryRepository.findById(dishRequest.getCategoryId()).orElse(null);
        }

        dish.setNameDish(dishRequest.getDishName());
        dish.setPrice(dishRequest.getPrice());
        dish.setCategory(category);
        dish.setUrlImage(dishRequest.getUrlImage());

        Dish update = dishRepository.save(dish);
        return mapToResponse(update);
    }

    @Override
    public void deleteDish(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish Not Found"));
        dishRepository.delete(dish);
    }

    @Override
    public DishResponse getDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish Not Found"));
        return mapToResponse(dish);
    }

    @Override
    public DishResponse toggleDishStatus(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish Not Found"));
        dish.setActive(!dish.isActive()); 
        Dish updatedDish = dishRepository.save(dish);
        return mapToResponse(updatedDish);
    }
}