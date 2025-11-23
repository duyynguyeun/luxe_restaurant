package com.luxe_restaurant.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.luxe_restaurant.domain.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Data
@Table(name = "user_accounts")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
public class User extends BaseEnity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String userName;

    @Column
    private String email;

    @Column
    private String phone;

    @Column
    private BigDecimal point;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column
    private Role role;
}
