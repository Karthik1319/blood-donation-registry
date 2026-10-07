package com.blooddonation.registry.donation;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * The project's edge case: a donor must wait at least 90 days between donations. Same rule as the
 * frontend's src/utils/donationEligibility.js; the frontend checks for fast feedback, this is the
 * check that actually decides. Pure code (no database), so it's easy to unit-test.
 */
public final class DonationEligibility {

    public static final int MIN_DAYS_BETWEEN_DONATIONS = 90;

    private DonationEligibility() {
    }

    /** The parts of a donation the rule needs. */
    public record DatedDonation(Long id, LocalDate date) {
    }

    /**
     * Returns an existing donation less than 90 days away from `date`, before OR after it (so a
     * back-filled date is checked against later donations too). `ignoreId` is the donation being
     * edited, so it isn't compared with itself; pass null when adding a new one.
     */
    public static Optional<DatedDonation> findTooClose(List<DatedDonation> donations, LocalDate date, Long ignoreId) {
        return donations.stream()
                .filter(donation -> !Objects.equals(donation.id(), ignoreId))
                .filter(donation -> Math.abs(ChronoUnit.DAYS.between(donation.date(), date))
                        < MIN_DAYS_BETWEEN_DONATIONS)
                .findFirst();
    }
}
