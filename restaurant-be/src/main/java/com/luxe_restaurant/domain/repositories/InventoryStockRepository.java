package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.InventoryStock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryStockRepository extends JpaRepository<InventoryStock, Long> {

    Optional<InventoryStock> findByIngredientId(Long ingredientId);

    @Query("SELECT s FROM InventoryStock s JOIN FETCH s.ingredient i WHERE i.active = true AND s.quantityOnHand <= i.lowStockThreshold")
    List<InventoryStock> findLowStockIngredients();

    @Query("SELECT s FROM InventoryStock s JOIN FETCH s.ingredient i WHERE " +
           "(:keyword IS NULL OR LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.code) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:lowStockOnly IS FALSE OR s.quantityOnHand <= i.lowStockThreshold)")
    Page<InventoryStock> filterStocks(@Param("keyword") String keyword,
                                      @Param("lowStockOnly") Boolean lowStockOnly,
                                      Pageable pageable);
}
