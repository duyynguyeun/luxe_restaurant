package com.luxe_restaurant.app.requests.users;

import com.luxe_restaurant.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCreateRequest {
    private String userName;

    private String phone;

    private String email;

    private String password;

}

