package com.blooddonation.registry.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, Long> {

    /** Emails are saved in lower case, so callers pass a lower-case email. */
    Optional<AppUser> findByEmail(String email);

    boolean existsByEmail(String email);

    List<AppUser> findAllByOrderByIdAsc();
}
