package com.blooddonation.registry.donation;

import static org.assertj.core.api.Assertions.assertThat;

import com.blooddonation.registry.donation.DonationEligibility.DatedDonation;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;

/** The 90-day rule on its own, no database. Same cases as the frontend's unit tests. */
class DonationEligibilityTest {

    private static final DatedDonation JAN = new DatedDonation(1L, LocalDate.parse("2026-01-10"));
    private static final DatedDonation JUNE = new DatedDonation(2L, LocalDate.parse("2026-06-01"));
    private static final List<DatedDonation> DONATIONS = List.of(JAN, JUNE);

    @Test
    void allowsExactly90DaysAfterTheLastDonation() {
        assertThat(DonationEligibility.findTooClose(DONATIONS, LocalDate.parse("2026-08-30"), null)).isEmpty();
    }

    @Test
    void blocks89DaysAfterTheLastDonation() {
        assertThat(DonationEligibility.findTooClose(DONATIONS, LocalDate.parse("2026-08-29"), null)).contains(JUNE);
    }

    @Test
    void blocksABackFilledDateTooCloseToALaterDonation() {
        assertThat(DonationEligibility.findTooClose(DONATIONS, LocalDate.parse("2026-05-01"), null)).contains(JUNE);
    }

    @Test
    void allowsABackFilledDateFarFromEveryDonation() {
        assertThat(DonationEligibility.findTooClose(DONATIONS, LocalDate.parse("2025-10-01"), null)).isEmpty();
    }

    @Test
    void ignoresTheDonationBeingEdited() {
        assertThat(DonationEligibility.findTooClose(DONATIONS, LocalDate.parse("2026-06-05"), 2L)).isEmpty();
    }

    @Test
    void allowsAnythingForAFirstTimeDonor() {
        assertThat(DonationEligibility.findTooClose(List.of(), LocalDate.parse("2026-06-01"), null)).isEmpty();
    }
}
