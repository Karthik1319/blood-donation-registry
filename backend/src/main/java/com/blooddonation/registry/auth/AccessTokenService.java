package com.blooddonation.registry.auth;

import com.blooddonation.registry.config.AppSecurityProperties;
import com.blooddonation.registry.user.AppUser;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

/** Creates short-lived signed access tokens (JWT) carrying the user id and role. */
@Service
public class AccessTokenService {

    private static final String ISSUER = "blood-donation-registry";

    private final JwtEncoder jwtEncoder;
    private final AppSecurityProperties properties;
    private final Clock clock;

    public AccessTokenService(JwtEncoder jwtEncoder, AppSecurityProperties properties, Clock clock) {
        this.jwtEncoder = jwtEncoder;
        this.properties = properties;
        this.clock = clock;
    }

    public String createFor(AppUser user) {
        Instant now = clock.instant();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .subject(String.valueOf(user.getId()))
                .issuedAt(now)
                .expiresAt(now.plus(properties.accessTokenTtl()))
                // For information only: the server reads the current role from the database on each request.
                .claim("roles", List.of(user.getRole().name()))
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
