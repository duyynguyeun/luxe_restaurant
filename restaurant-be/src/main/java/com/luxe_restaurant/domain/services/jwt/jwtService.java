package com.luxe_restaurant.domain.services.jwt;

import com.luxe_restaurant.domain.entities.User;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class jwtService {

    private String secretKey = "79a6404a6bb4a8bf6f3912a5b652fcc2ea2c153a1dfc5f5772acb525916599be979414c7a757b890205093dde9a68ea0d127e514823e54c4260835b70c3dd8a6";

    public String generateAccessToken(User user) {
        JWSHeader header =  new JWSHeader(JWSAlgorithm.HS512);

        Date issueTime = new Date();
        Date experedTime = Date.from(issueTime.toInstant().plus(30, ChronoUnit.MINUTES));

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
