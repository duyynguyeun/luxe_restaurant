package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.users.UserCreateRequest;
import com.luxe_restaurant.app.requests.ResetPasswordRequest;
import com.luxe_restaurant.app.responses.users.UserCreateResponse;
import com.luxe_restaurant.app.responses.users.UserResponse;
import com.luxe_restaurant.domain.repositories.UserRepository;
import com.luxe_restaurant.domain.services.UserService;
import com.luxe_restaurant.domain.services.mail.OtpService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final OtpService otpService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        boolean valid = otpService.verifyOtp(email, otp);

        if (!valid) {
            return ResponseEntity.badRequest().body("OTP không đúng!");
        }

        UserCreateResponse response = userService.createUser(request);

        return ResponseEntity.ok(response);
    }

    // 1. Gửi OTP reset password
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendForgotPasswordOtp(@RequestParam String email) {

        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email không tồn tại!");
        }

        otpService.sendOtp(email);
        return ResponseEntity.ok("OTP khôi phục mật khẩu đã được gửi!");
    }

    // 2. Kiểm tra OTP reset password
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<?> verifyForgotPasswordOtp(
            @RequestParam String email,
            @RequestParam String otp) {

        boolean valid = otpService.verifyOtp(email, otp);

        if (!valid) {
            return ResponseEntity.badRequest().body("OTP không chính xác!");
        }

        return ResponseEntity.ok("OTP hợp lệ! Bạn có thể đổi mật khẩu.");
    }

    // 3. Đặt mật khẩu mới
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Đổi mật khẩu thành công!");
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
