package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.MenuItemIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemIngredientRepository extends JpaRepository<MenuItemIngredient, Long> {

    List<MenuItemIngredient> findByDishId(Long dishId);

    void deleteByDishId(Long dishId);

    boolean existsByIngredientId(Long ingredientId);

    @Query("SELECT r FROM MenuItemIngredient r JOIN FETCH r.ingredient i WHERE r.dish.id = :dishId")
    List<MenuItemIngredient> findByDishIdWithIngredient(@Param("dishId") Long dishId);
}
