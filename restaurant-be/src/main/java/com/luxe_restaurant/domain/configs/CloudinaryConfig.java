package com.luxe_restaurant.domain.configs;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "drggaedqy",
                "api_key", "445265431785824",
                "api_secret", "eREHD0A0MbkGFZFRAqJsrGICd-0"
        ));
    }
}
