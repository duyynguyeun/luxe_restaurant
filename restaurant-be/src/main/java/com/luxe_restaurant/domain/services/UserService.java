package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.users.UserCreateRequest;
import com.luxe_restaurant.app.responses.users.UserCreateResponse;
import com.luxe_restaurant.app.responses.users.UserResponse;
import com.luxe_restaurant.domain.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;

public interface UserService {
    UserCreateResponse createUser(UserCreateRequest request);
    UserResponse updateUser(@PathVariable  Long id, UserCreateRequest request);
    void deleteUser(@PathVariable  Long id);
    Page<User> getAllUsers(String role, Pageable pageable);
    UserResponse getUserById(@PathVariable  Long id);
}
