package com.blooddonation.registry.common;

/** The request is understood but not allowed, e.g. logging in to a disabled account. Sent as 403. */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }
}
