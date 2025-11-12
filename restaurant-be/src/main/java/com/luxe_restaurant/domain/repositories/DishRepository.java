package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishRepository extends JpaRepository<Dish, Long> {

    Long id(Long id);
}
