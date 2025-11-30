package com.luxe_restaurant.domain.services.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailService emailService;

    private final Map<String, String> otpStorage = new HashMap<>();

    public void sendOtp(String email) {
        String otp = String.valueOf((int)(Math.random() * 900000 + 100000));

        otpStorage.put(email, otp);

        emailService.send(
                email,
                "Luxe Restaurant - Mã xác thực OTP",
                "Mã OTP của bạn là: " + otp + " (có hiệu lực 5 phút)."
        );
    }

    public boolean verifyOtp(String email, String otp) {

        String storedOtp = otpStorage.get(email);

        if (storedOtp == null) {
            return false;
        }

        boolean valid = storedOtp.equals(otp);

        if (valid) {
            otpStorage.remove(email); // xoá OTP để tránh verify lại
        }

        return valid;
    }
}