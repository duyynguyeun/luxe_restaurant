package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.users.UserCreateRequest;
import com.luxe_restaurant.app.responses.users.UserCreateResponse;

public interface UserService {
    public UserCreateResponse createUser(UserCreateRequest request);
}
