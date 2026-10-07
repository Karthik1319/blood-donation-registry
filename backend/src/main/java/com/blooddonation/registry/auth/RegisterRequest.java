package com.blooddonation.registry.auth;

import com.blooddonation.registry.common.ValidationRules;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Self-registration. There is deliberately no "role" field: new accounts are always DONOR. */
public record RegisterRequest(
        @NotBlank @Size(min = ValidationRules.NAME_MIN, max = ValidationRules.NAME_MAX)
        @Pattern(regexp = ValidationRules.NAME) String fullName,
        @NotBlank @Email @Size(max = ValidationRules.EMAIL_MAX) String email,
        @NotBlank @Pattern(regexp = ValidationRules.PHONE) String phone,
        @NotBlank @Pattern(regexp = ValidationRules.BLOOD_GROUP) String bloodGroup,
        @NotBlank @Pattern(regexp = ValidationRules.PASSWORD) String password) {

    public RegisterRequest {
        fullName = ValidationRules.trim(fullName);
        email = ValidationRules.trim(email);
        phone = ValidationRules.trim(phone);
    }
}
