package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
