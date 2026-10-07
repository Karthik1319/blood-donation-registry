package com.blooddonation.registry.donation;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    /** A donor's donations, newest first. */
    @Query("select d from Donation d where d.donor.id = :donorId order by d.donationDate desc, d.id desc")
    List<Donation> findByDonorNewestFirst(@Param("donorId") Long donorId);
}
