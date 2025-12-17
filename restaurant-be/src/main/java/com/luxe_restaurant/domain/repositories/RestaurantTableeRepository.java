package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantTableeRepository extends JpaRepository<RestaurantTable, Long> {
}
