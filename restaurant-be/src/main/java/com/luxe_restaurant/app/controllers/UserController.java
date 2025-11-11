package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.users.UserCreateRequest;
import com.luxe_restaurant.app.responses.users.UserCreateResponse;
import com.luxe_restaurant.domain.services.UserService;
import org.springframework.ai.chat.client.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public UserCreateResponse createUser(@RequestBody UserCreateRequest request){
        return  userService.createUser(request);
    }
}
