package com.blooddonation.registry.donation;

import com.blooddonation.registry.common.BadRequestException;
import com.blooddonation.registry.common.BusinessRuleException;
import com.blooddonation.registry.common.NotFoundException;
import com.blooddonation.registry.donation.DonationEligibility.DatedDonation;
import com.blooddonation.registry.donor.Donor;
import com.blooddonation.registry.donor.DonorRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final DonorRepository donorRepository;
    private final Clock clock;

    public DonationService(DonationRepository donationRepository, DonorRepository donorRepository, Clock clock) {
        this.donationRepository = donationRepository;
        this.donorRepository = donorRepository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<DonationResponse> listForDonor(Long donorId) {
        if (!donorRepository.existsById(donorId)) {
            throw new NotFoundException("Donor", donorId);
        }
        return donationRepository.findByDonorNewestFirst(donorId).stream().map(DonationResponse::from).toList();
    }

    @Transactional
    public DonationResponse create(Long donorId, DonationRequest request) {
        Donor donor = lockDonor(donorId);
        checkRules(donorId, request.donationDate(), null);
        Donation donation = new Donation(donor, request.donationDate(), request.quantity(), request.location());
        return DonationResponse.from(donationRepository.save(donation));
    }

    @Transactional
    public DonationResponse update(Long id, DonationRequest request) {
        Donation donation = find(id);
        lockDonor(donation.getDonorId());
        checkRules(donation.getDonorId(), request.donationDate(), id);
        donation.update(request.donationDate(), request.quantity(), request.location());
        return DonationResponse.from(donation);
    }

    @Transactional
    public void delete(Long id) {
        donationRepository.delete(find(id));
    }

    private Donation find(Long id) {
        return donationRepository.findById(id).orElseThrow(() -> new NotFoundException("Donation", id));
    }

    /** See DonorRepository.findByIdForUpdate: stops two parallel saves both passing the 90-day check. */
    private Donor lockDonor(Long donorId) {
        return donorRepository.findByIdForUpdate(donorId).orElseThrow(() -> new NotFoundException("Donor", donorId));
    }

    private void checkRules(Long donorId, LocalDate date, Long editingId) {
        if (date.isAfter(LocalDate.now(clock))) {
            throw new BadRequestException("Donation date cannot be in the future");
        }
        List<DatedDonation> existing = donationRepository.findByDonorNewestFirst(donorId).stream()
                .map(donation -> new DatedDonation(donation.getId(), donation.getDonationDate()))
                .toList();
        DonationEligibility.findTooClose(existing, date, editingId).ifPresent(tooClose -> {
            throw new BusinessRuleException("Not eligible: this donor has a donation on " + tooClose.date()
                    + ". Donations must be at least " + DonationEligibility.MIN_DAYS_BETWEEN_DONATIONS
                    + " days apart.");
        });
    }
}
