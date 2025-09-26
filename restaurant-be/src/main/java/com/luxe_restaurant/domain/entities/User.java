package com.luxe_restaurant.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.luxe_restaurant.domain.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Table(name = "user_accounts")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Entity
public class User extends BaseEnity{
    @Id
    private String id;

    @Column
    private String userName;

    @Column
    private String email;

    @Column
    private String phone;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

}
