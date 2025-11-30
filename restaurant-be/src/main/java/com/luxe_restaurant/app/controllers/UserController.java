package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.users.UserCreateRequest;
import com.luxe_restaurant.app.responses.users.UserCreateResponse;
import com.luxe_restaurant.app.responses.users.UserResponse;
import com.luxe_restaurant.domain.services.UserService;
import com.luxe_restaurant.domain.services.mail.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        otpService.sendOtp(email);
        return ResponseEntity.ok("OTP đã được gửi tới email");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestBody UserCreateRequest request) {

        // Kiểm tra OTP
        boolean valid = otpService.verifyOtp(email, otp);

        if (!valid) {
            return ResponseEntity.badRequest().body("OTP không đúng!");
        }

        // OTP hợp lệ → tạo tài khoản
        UserCreateResponse response = userService.createUser(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public UserCreateResponse createUser(@RequestBody UserCreateRequest request){
        return userService.createUser(request);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }

    @PutMapping("/update/{id}")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody UserCreateRequest request){
        return userService.updateUser(id, request);
    }

    @GetMapping("/getall")
    public List<UserResponse> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/find/{id}")
    public UserResponse findUser(@PathVariable Long id){
        return userService.getUserById(id);
    }
}
