package com.blooddonation.registry.donor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "donor")
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private String phone;

    protected Donor() {
        // Required by JPA.
    }

    public Donor(String name, String bloodGroup, String phone) {
        this.name = name;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
    }

    public void update(String newName, String newBloodGroup, String newPhone) {
        this.name = newName;
        this.bloodGroup = newBloodGroup;
        this.phone = newPhone;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public String getPhone() {
        return phone;
    }
}
