package com.blooddonation.registry.donation;

import java.time.LocalDate;

public record DonationResponse(Long id, Long donorId, LocalDate donationDate, int quantity, String location) {

    public static DonationResponse from(Donation donation) {
        return new DonationResponse(donation.getId(), donation.getDonorId(), donation.getDonationDate(),
                donation.getQuantity(), donation.getLocation());
    }
}
