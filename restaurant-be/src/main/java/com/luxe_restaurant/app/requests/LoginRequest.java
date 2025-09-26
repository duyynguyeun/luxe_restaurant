package com.luxe_restaurant.app.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LoginRequest {
    @NotNull
    private String userName;

    @NotNull
    @NotBlank
    private String password;
}
