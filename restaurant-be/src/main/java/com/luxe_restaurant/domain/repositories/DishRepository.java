package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.Dish;
import org.springframework.data.repository.CrudRepository;

public interface DishRepository extends CrudRepository<Dish, Long> {

}
