package com.blooddonation.registry.common;

/** The request clashes with existing data, e.g. a duplicate email or phone. Sent as 409. */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
