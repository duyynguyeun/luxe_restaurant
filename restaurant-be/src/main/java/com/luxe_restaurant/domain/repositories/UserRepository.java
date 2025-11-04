package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
