package com.blooddonation.registry.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** The app.security.* settings from application.yaml. */
@ConfigurationProperties(prefix = "app.security")
public record AppSecurityProperties(
        String jwtSecret, Duration accessTokenTtl, Duration refreshTokenTtl, boolean refreshCookieSecure) {
}
