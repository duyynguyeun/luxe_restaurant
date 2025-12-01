package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.users.UserCreateRequest;
import com.luxe_restaurant.app.responses.users.UserCreateResponse;
import com.luxe_restaurant.app.responses.users.UserResponse;
import com.luxe_restaurant.domain.entities.User;
import com.luxe_restaurant.domain.enums.Role;
import com.luxe_restaurant.domain.repositories.UserRepository;
import com.luxe_restaurant.domain.services.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    // Định nghĩa Regex
    private static final String PHONE_REGEX = "^0\\d{9}$";
    private static final String PASSWORD_REGEX = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$";

    private void validateUserData(String phone, String password, boolean isPasswordRequired) {
        // 1. Validate Phone
        if (phone == null || !Pattern.matches(PHONE_REGEX, phone)) {
            throw new RuntimeException("Số điện thoại không hợp lệ! Phải đủ 10 số và bắt đầu bằng số 0.");
        }

        // 2. Validate Password
        if (isPasswordRequired) {
            if (password == null || !Pattern.matches(PASSWORD_REGEX, password)) {
                throw new RuntimeException("Mật khẩu phải từ 6 ký tự trở lên và chứa cả chữ và số.");
            }
        } else {
            // Nếu không bắt buộc (trường hợp update), chỉ check nếu user có nhập password mới
            if (password != null && !password.isEmpty() && !Pattern.matches(PASSWORD_REGEX, password)) {
                throw new RuntimeException("Mật khẩu mới phải từ 6 ký tự trở lên và chứa cả chữ và số.");
            }
        }
    }

    @Override
    public UserCreateResponse createUser(UserCreateRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        // --- GỌI HÀM VALIDATE ---
        validateUserData(request.getPhone(), request.getPassword(), true);
        // ------------------------

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        User user = User.builder()
                .userName(request.getUserName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .build();

        userRepository.save(user);
        return UserCreateResponse.builder()
                .email(request.getEmail())
                .phone(request.getPhone())
                .userName(request.getUserName())
                .build();
    }

    @Override
    public UserResponse updateUser(Long id, UserCreateRequest request) {
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));

        validateUserData(request.getPhone(), request.getPassword(), false);

        user.setUserName(request.getUserName());
        user.setPhone(request.getPhone());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                user.setRole(Role.valueOf(request.getRole()));
            } catch (IllegalArgumentException e) {}
        }

        User saveUser = userRepository.save(user);
        return modelMapper.map(saveUser, UserResponse.class);
    }

    @Override
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }

    @Override
    public UserResponse getUserById(Long id){
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        return modelMapper.map(user, UserResponse.class);
    }

    @Override
    public List<UserResponse> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user,UserResponse.class))
                .toList();
    }
}
