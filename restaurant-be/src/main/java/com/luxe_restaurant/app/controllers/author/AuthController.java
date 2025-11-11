package com.luxe_restaurant.app.controllers.author;

import com.luxe_restaurant.app.requests.LoginRequest;
import com.luxe_restaurant.app.responses.LoginResponse;
import com.luxe_restaurant.domain.services.jwt.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/login")
public class AuthController {
    private final AuthenticationService authenticationService;

    @PostMapping()
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authenticationService.login(request);
    }
}
