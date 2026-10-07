package com.blooddonation.registry.support;

import com.blooddonation.registry.TestcontainersConfiguration;
import com.blooddonation.registry.auth.AccessTokenService;
import com.blooddonation.registry.donor.Donor;
import com.blooddonation.registry.donor.DonorRepository;
import com.blooddonation.registry.user.AppUser;
import com.blooddonation.registry.user.Role;
import com.blooddonation.registry.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Base class for API tests: the full app with a real PostgreSQL (Testcontainers), called through
 * MockMvc. Every test starts with empty tables.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
public abstract class ApiTestSupport {

    protected static final String PASSWORD = "Strong@123";

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected DonorRepository donorRepository;

    @Autowired
    private AccessTokenService accessTokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void emptyTables() {
        jdbcTemplate.execute("TRUNCATE donation, donor, refresh_token, app_user RESTART IDENTITY CASCADE");
    }

    /** Saves a user with the given role and returns a valid "Bearer ..." header value for them. */
    protected String bearerFor(Role role) {
        String email = role.name().toLowerCase() + "@test.org";
        AppUser user = userRepository.save(new AppUser(
                "Test " + role.name(), email, "9000000000", "O+", passwordEncoder.encode(PASSWORD), role));
        return "Bearer " + accessTokenService.createFor(user);
    }

    protected Donor saveDonor(String name, String phone) {
        return donorRepository.save(new Donor(name, "B+", phone));
    }
}
