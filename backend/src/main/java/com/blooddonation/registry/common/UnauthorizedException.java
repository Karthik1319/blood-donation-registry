package com.blooddonation.registry.common;

/** Wrong login, or a missing/expired/revoked refresh token. Sent as 401. */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
