package com.blooddonation.registry.donation;

import com.blooddonation.registry.donor.Donor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "donation")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "donor_id")
    private Donor donor;

    @Column(name = "donation_date", nullable = false)
    private LocalDate donationDate;

    @Column(name = "quantity_ml", nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String location;

    protected Donation() {
        // Required by JPA.
    }

    public Donation(Donor donor, LocalDate donationDate, int quantity, String location) {
        this.donor = donor;
        this.donationDate = donationDate;
        this.quantity = quantity;
        this.location = location;
    }

    public void update(LocalDate newDate, int newQuantity, String newLocation) {
        this.donationDate = newDate;
        this.quantity = newQuantity;
        this.location = newLocation;
    }

    public Long getId() {
        return id;
    }

    public Long getDonorId() {
        return donor.getId();
    }

    public LocalDate getDonationDate() {
        return donationDate;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getLocation() {
        return location;
    }
}
