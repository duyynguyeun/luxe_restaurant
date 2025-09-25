package com.luxe_restaurant.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Id;

public class User extends BaseEnity{
    @Id
    private String id;

    @Column
    private String userName;

    @Column
    private String email;

    @Column
    private String phone;


}
