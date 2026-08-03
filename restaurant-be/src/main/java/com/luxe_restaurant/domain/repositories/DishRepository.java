package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DishRepository extends JpaRepository<Dish, Long> {

    Optional<Dish> findByNameDish(String nameDish);
}
