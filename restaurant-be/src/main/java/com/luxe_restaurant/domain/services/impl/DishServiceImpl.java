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

    // 1. Hàm map dữ liệu an toàn (Tránh lỗi 500 khi danh mục bị null)
    private DishResponse mapToResponse(Dish dish) {
        DishResponse response = modelMapper.map(dish, DishResponse.class);
        if (dish.getCategory() != null) {
            response.setCategoryName(dish.getCategory().getName());
            // --- THÊM DÒNG NÀY ĐỂ SỬA LỖI NHẢY LOẠI ---
            response.setCategoryId(dish.getCategory().getId());

        } else {
            response.setCategoryName("Chưa phân loại");
        }
        // --- THÊM DÒNG NÀY CHO CHẮC CHẮN ---
        response.setActive(dish.isActive()); 
        // -----------------------------------
        return response;
    }

    @Override
    public DishResponse createDish(DishRequest dishRequest) {
        Category category = categoryRepository.findById(dishRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

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

        // Tìm Category theo ID gửi lên
        Category category = categoryRepository.findById(dishRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

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

    // 2. Hàm xử lý Bật/Tắt (Logic chuẩn)
    @Override
    public DishResponse toggleDishStatus(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish Not Found"));

        dish.setActive(!dish.isActive()); // Đảo ngược trạng thái
        
        Dish updatedDish = dishRepository.save(dish);
        return mapToResponse(updatedDish);
    }
}