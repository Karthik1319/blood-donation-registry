package com.blooddonation.registry.common;

/**
 * Validation patterns, kept the same as the frontend (src/constants/validation.js) so a form that
 * passes in the browser also passes here. The server checks again because anyone can call the API.
 */
public final class ValidationRules {

    /** Letters in any language, then letters, spaces, apostrophes, hyphens or dots. */
    public static final String NAME = "^\\p{L}[\\p{L} .'-]*$";
    public static final String PHONE = "^\\d{10}$";
    public static final String BLOOD_GROUP = "^(A|B|AB|O)[+-]$";
    /** 8-64 characters with an uppercase letter, a lowercase letter, a digit and a special character. */
    public static final String PASSWORD = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,64}$";

    public static final int NAME_MIN = 2;
    public static final int NAME_MAX = 50;
    public static final int EMAIL_MAX = 100;
    public static final int LOCATION_MAX = 100;
    public static final int QUANTITY_MIN_ML = 350;
    public static final int QUANTITY_MAX_ML = 450;

    private ValidationRules() {
    }

    /** Trims text input; keeps null as null so @NotBlank reports it. */
    public static String trim(String value) {
        return value == null ? null : value.strip();
    }
}
