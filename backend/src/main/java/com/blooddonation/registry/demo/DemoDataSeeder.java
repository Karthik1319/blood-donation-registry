package com.blooddonation.registry.demo;

import com.blooddonation.registry.donation.Donation;
import com.blooddonation.registry.donation.DonationRepository;
import com.blooddonation.registry.donor.Donor;
import com.blooddonation.registry.donor.DonorRepository;
import com.blooddonation.registry.user.AppUser;
import com.blooddonation.registry.user.Role;
import com.blooddonation.registry.user.UserRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Local development only (DEMO_DATA=true): fills an EMPTY database with the demo accounts, donors and
 * donations used in the README, so the app can be tried right away. Donation dates are relative to
 * today, so some donors are always "not eligible yet" and others eligible.
 */
@Component
@ConditionalOnProperty(name = "app.demo-data", havingValue = "true")
public class DemoDataSeeder implements ApplicationRunner {

    private static final Logger LOG = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final DonationRepository donationRepository;
    private final PasswordEncoder passwordEncoder;
    private final Clock clock;

    public DemoDataSeeder(UserRepository userRepository, DonorRepository donorRepository,
            DonationRepository donationRepository, PasswordEncoder passwordEncoder, Clock clock) {
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.donationRepository = donationRepository;
        this.passwordEncoder = passwordEncoder;
        this.clock = clock;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            return;
        }
        seedUsers();
        seedDonorsAndDonations();
        LOG.info("Demo data created (DEMO_DATA=true)");
    }

    private void seedUsers() {
        userRepository.saveAll(List.of(
                user("Demo Admin", "admin@blood.org", "9876543210", "O+", "Admin@123", Role.ADMIN),
                user("Demo Staff", "staff@blood.org", "9876543211", "A+", "Staff@123", Role.STAFF),
                user("Demo Donor", "donor@blood.org", "9876543212", "B+", "Donor@123", Role.DONOR)));
    }

    private AppUser user(String name, String email, String phone, String group, String password, Role role) {
        return new AppUser(name, email, phone, group, passwordEncoder.encode(password), role);
    }

    private void seedDonorsAndDonations() {
        List<Donor> donors = donorRepository.saveAll(List.of(
                new Donor("Ravi Kumar", "B+", "9876500001"), new Donor("Priya Sharma", "O+", "9876500002"),
                new Donor("Arjun Reddy", "A+", "9876500003"), new Donor("Meena Iyer", "AB+", "9876500004"),
                new Donor("Suresh Babu", "O-", "9876500005"), new Donor("Anjali Verma", "B-", "9876500006"),
                new Donor("Kiran Rao", "A-", "9876500007"), new Donor("Deepa Nair", "O+", "9876500008"),
                new Donor("Vikram Singh", "AB-", "9876500009"), new Donor("Lakshmi Devi", "B+", "9876500010"),
                new Donor("Rahul Mehta", "A+", "9876500011"), new Donor("Sneha Patil", "O+", "9876500012")));
        Donor ravi = donors.get(0);
        Donor priya = donors.get(1);
        Donor arjun = donors.get(2);
        Donor deepa = donors.get(7);
        donationRepository.saveAll(List.of(
                donation(ravi, 56, 450, "City Blood Bank, Hyderabad"),
                donation(ravi, 160, 450, "Red Cross Camp, Secunderabad"),
                donation(ravi, 309, 350, "City Blood Bank, Hyderabad"),
                donation(priya, 36, 450, "Apollo Hospital, Chennai"),
                donation(arjun, 80, 450, "NIMS Blood Centre"),
                donation(arjun, 216, 450, "NIMS Blood Centre"),
                donation(deepa, 107, 350, "Lions Club Camp, Pune")));
    }

    private Donation donation(Donor donor, int daysAgo, int quantity, String location) {
        return new Donation(donor, LocalDate.now(clock).minusDays(daysAgo), quantity, location);
    }
}
