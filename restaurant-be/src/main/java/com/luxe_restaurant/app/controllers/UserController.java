package com.luxe_restaurant.app.controllers;


import com.luxe_restaurant.app.requests.users.UserCreateRequest;
import com.luxe_restaurant.app.responses.users.UserCreateResponse;
import com.luxe_restaurant.app.responses.users.UserResponse;
import com.luxe_restaurant.domain.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

// Dev FE thêm
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/create")
    public UserCreateResponse createUser(@RequestBody UserCreateRequest request){
        return  userService.createUser(request);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable  Long id){
        userService.deleteUser(id);
    }

    @PutMapping("/update/{id}")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody UserCreateRequest request){
        return  userService.updateUser(id, request);
    }

    @GetMapping("/getall")
    public List<UserResponse> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/find/{id}")
    public UserResponse findUser(@PathVariable  Long id){
        return userService.getUserById(id);
    }
}
