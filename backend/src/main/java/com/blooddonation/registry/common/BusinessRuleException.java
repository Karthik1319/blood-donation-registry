package com.blooddonation.registry.common;

/** Valid input that breaks a business rule, e.g. the 90-day donation rule. Sent as 422. */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
