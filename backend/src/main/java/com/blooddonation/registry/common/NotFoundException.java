package com.blooddonation.registry.common;

/** The requested record does not exist. Sent to the client as 404. */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String recordType, Long id) {
        super(recordType + " " + id + " was not found");
    }
}
