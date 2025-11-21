package com.luxe_restaurant.domain.services.jwt;
import com.luxe_restaurant.domain.entities.CustomUserDetail; // <-- 1. THÊM IMPORT NÀY
import com.luxe_restaurant.domain.entities.User; // <-- 2. THÊM IMPORT NÀY
import com.luxe_restaurant.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCustomizeService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User does not exist"));

    return new CustomUserDetail(user); // <-- Phải trả về đối tượng này
}

}
