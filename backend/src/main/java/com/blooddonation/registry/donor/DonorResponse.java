package com.blooddonation.registry.donor;

public record DonorResponse(Long id, String name, String bloodGroup, String phone) {

    public static DonorResponse from(Donor donor) {
        return new DonorResponse(donor.getId(), donor.getName(), donor.getBloodGroup(), donor.getPhone());
    }
}
