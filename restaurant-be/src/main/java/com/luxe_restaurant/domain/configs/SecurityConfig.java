package com.luxe_restaurant.domain.configs;

import com.luxe_restaurant.domain.services.jwt.UserCustomizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.http.HttpMethod; // <-- 1. THÊM IMPORT NÀY
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserCustomizeService userDetailsService;

    private static final String[] WHITE_LIST = {
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml",
            "/swagger-resources/**",
            "/api/chatbot",
            "/api/login",
            "/api/user/**",
            "/api/dish/**",
            "/api/dish/update/**",
            "/api/user/update/**",
            "/api/dish/delete/**",
            "/api/user/delete/**",
            "/api/dish/find/**",
            "/api/user/find/**",
            // THÊM DÒNG NÀY VÀO:
            "/api/dish/toggle/**",
            "/api/category/**", // <--- THÊM DÒNG NÀY QUAN TRỌNG cho phan danh muc mon
            "/api/orders/**", // <--- Thêm dòng này cho phan order
            "/api/images",
            "/api/orders/update-status/**",
            "/api/orders/findOrder/**",

            "/api/reservations/**",

            "/api/promotion/**",
            "/api/promotion/update/**",

    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                // 2. THÊM DÒNG NÀY ĐỂ SỬA LỖI CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(WHITE_LIST).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer((oauth2) -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        String key = "79a6404a6bb4a8bf6f3912a5b652fcc2ea2c153a1dfc5f5772acb525916599be979414c7a757b890205093dde9a68ea0d127e514823e54c4260835b70c3dd8a6"; // <-- Phải dùng chung khóa này
        SecretKey secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HS512");
        return NimbusJwtDecoder.withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
