package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.users.UserCreateRequest;
import com.luxe_restaurant.app.responses.users.UserCreateResponse;
import com.luxe_restaurant.app.responses.users.UserResponse;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface UserService {
    UserCreateResponse createUser(UserCreateRequest request);
    UserResponse updateUser(@PathVariable  Long id, UserCreateRequest request);
    void deleteUser(@PathVariable  Long id);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(@PathVariable  Long id);
}
