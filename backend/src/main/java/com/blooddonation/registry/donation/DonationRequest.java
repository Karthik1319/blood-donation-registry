package com.blooddonation.registry.donation;

import com.blooddonation.registry.common.ValidationRules;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/** Body of POST /api/donors/{id}/donations and PUT /api/donations/{id}. Date as "YYYY-MM-DD". */
public record DonationRequest(
        @NotNull LocalDate donationDate,
        @NotNull @Min(ValidationRules.QUANTITY_MIN_ML) @Max(ValidationRules.QUANTITY_MAX_ML) Integer quantity,
        @NotBlank @Size(max = ValidationRules.LOCATION_MAX) String location) {

    public DonationRequest {
        location = ValidationRules.trim(location);
    }
}
