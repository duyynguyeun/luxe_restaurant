package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.Ingredient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    Optional<Ingredient> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    @Query("SELECT i FROM Ingredient i WHERE " +
           "(:keyword IS NULL OR LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.code) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:active IS NULL OR i.active = :active)")
    Page<Ingredient> filterIngredients(@Param("keyword") String keyword,
                                       @Param("active") Boolean active,
                                       Pageable pageable);

    List<Ingredient> findByActiveTrue();

    long countByActiveTrue();
}
