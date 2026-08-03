package com.luxe_restaurant.domain.services.jwt;

import com.luxe_restaurant.domain.entities.User;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class jwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    public String generateAccessToken(User user) {
        JWSHeader header =  new JWSHeader(JWSAlgorithm.HS512);

        Date issueTime = new Date();
        Date experedTime = Date.from(issueTime.toInstant().plus(7, ChronoUnit.DAYS));

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUserName())
                .claim("role", user.getRole().name())
                .issueTime(issueTime)
                .expirationTime(experedTime)
                .build();

        Payload payLoad = new Payload(claimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payLoad);
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
        return jwsObject.serialize();
    }

    public String generateRefreshToken(User user) {
        JWSHeader header =  new JWSHeader(JWSAlgorithm.HS512);

        Date issueTime = new Date();
        Date experedTime = Date.from(issueTime.toInstant().plus(30, ChronoUnit.DAYS));

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUserName())
                .claim("role", user.getRole().name())
                .issueTime(issueTime)
                .expirationTime(experedTime)
                .build();

        Payload payLoad = new Payload(claimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payLoad);
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
        return jwsObject.serialize();
    }
}
