package com.blooddonation.registry.common;

/** Invalid input that annotations can't check (e.g. a date in the future). Sent as 400. */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
