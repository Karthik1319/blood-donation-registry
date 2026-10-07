package com.blooddonation.registry.donor;

import com.blooddonation.registry.common.ValidationRules;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Body of POST /api/donors and PUT /api/donors/{id}. */
public record DonorRequest(
        @NotBlank @Size(min = ValidationRules.NAME_MIN, max = ValidationRules.NAME_MAX)
        @Pattern(regexp = ValidationRules.NAME) String name,
        @NotBlank @Pattern(regexp = ValidationRules.BLOOD_GROUP) String bloodGroup,
        @NotBlank @Pattern(regexp = ValidationRules.PHONE) String phone) {

    public DonorRequest {
        name = ValidationRules.trim(name);
        phone = ValidationRules.trim(phone);
    }
}
