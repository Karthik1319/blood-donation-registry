package com.blooddonation.registry.donation;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Donations are listed and created under their donor (/api/donors/{id}/donations, the
 * "children of a parent" endpoint) and changed or deleted by their own id (/api/donations/{id}).
 */
@RestController
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping("/api/donors/{donorId}/donations")
    public List<DonationResponse> listForDonor(@PathVariable Long donorId) {
        return donationService.listForDonor(donorId);
    }

    @PostMapping("/api/donors/{donorId}/donations")
    public ResponseEntity<DonationResponse> create(
            @PathVariable Long donorId, @Valid @RequestBody DonationRequest request) {
        DonationResponse created = donationService.create(donorId, request);
        return ResponseEntity.created(URI.create("/api/donations/" + created.id())).body(created);
    }

    @PutMapping("/api/donations/{id}")
    public DonationResponse update(@PathVariable Long id, @Valid @RequestBody DonationRequest request) {
        return donationService.update(id, request);
    }

    @DeleteMapping("/api/donations/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        donationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
