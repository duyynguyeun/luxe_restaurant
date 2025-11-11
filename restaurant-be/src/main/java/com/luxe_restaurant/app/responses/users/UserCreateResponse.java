package com.luxe_restaurant.app.responses.users;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCreateResponse {
    private String userName;

    private String phone;

    private String email;
}
