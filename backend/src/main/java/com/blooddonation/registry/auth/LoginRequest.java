package com.blooddonation.registry.auth;

import com.blooddonation.registry.common.ValidationRules;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String email, @NotBlank String password) {

    public LoginRequest {
        email = ValidationRules.trim(email);
    }
}
