package com.blooddonation.registry.auth;

import com.blooddonation.registry.config.AppSecurityProperties;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

/** Builds the refresh-token cookie: HttpOnly (JavaScript can't read it), Secure, SameSite=Strict. */
@Component
public class RefreshCookies {

    public static final String NAME = "bdr_refresh";
    /** Only sent with /api/auth/* requests (refresh and logout), not with every API call. */
    private static final String PATH = "/api/auth";

    private final AppSecurityProperties properties;

    public RefreshCookies(AppSecurityProperties properties) {
        this.properties = properties;
    }

    public String create(String refreshToken) {
        return base(refreshToken).maxAge(properties.refreshTokenTtl()).build().toString();
    }

    /** An already-expired cookie with the same name, which makes the browser delete it. */
    public String clear() {
        return base("").maxAge(0).build().toString();
    }

    private ResponseCookie.ResponseCookieBuilder base(String value) {
        return ResponseCookie.from(NAME, value)
                .httpOnly(true)
                .secure(properties.refreshCookieSecure())
                .sameSite("Strict")
                .path(PATH);
    }
}
