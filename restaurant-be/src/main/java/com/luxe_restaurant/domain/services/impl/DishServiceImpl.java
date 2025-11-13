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

    @Override
    public DishResponse createDish(DishRequest dishRequest){
        Category category = categoryRepository.findById(dishRequest.getCategoryId())
                .orElseThrow(()-> new RuntimeException("Category Not Found"));

        Dish dish = modelMapper.map(dishRequest,Dish.class);
        dish.setId(null);

        dish.setCategory(category);

        Dish saveDish = dishRepository.save(dish);

        return  modelMapper.map(saveDish,DishResponse.class);
    }

    @Override
    public List<DishResponse> getAllDishes() {
        return dishRepository.findAll()
                .stream()
                .map(dish -> modelMapper.map(dish, DishResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public DishResponse updateDish(Long id, DishRequest dishRequest){
        Dish dish = dishRepository.findById(id).orElseThrow(()-> new RuntimeException("Dish Not Found"));
        Category category = categoryRepository.findById(id).orElseThrow(()-> new RuntimeException("Category Not Found"));

        dish.setNameDish(dishRequest.getDishName());
        dish.setPrice(dishRequest.getPrice());
        dish.setCategory(category);
        dish.setUrlImage(dishRequest.getUrlImage());

        Dish update =  dishRepository.save(dish);

        return   modelMapper.map(update,DishResponse.class);
    }

    @Override
    public void deleteDish(Long id){
        Dish dish = dishRepository.findById(id).orElseThrow(()-> new RuntimeException("Dish Not Found"));
        dishRepository.delete(dish);
    }

    @Override
    public DishResponse getDishById(Long id){
        Dish dish = dishRepository.findById(id).orElseThrow(()-> new RuntimeException("Dish Not Found"));
        return modelMapper.map(dish, DishResponse.class);
    }
}
