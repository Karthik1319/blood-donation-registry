package com.blooddonation.registry.donor;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    /**
     * Search by name or phone, optionally filtered by blood group. `pattern` is a LIKE pattern
     * built by DonorService (with % and _ escaped); an empty bloodGroup means "any".
     */
    @Query("""
            select d from Donor d
            where (lower(d.name) like :pattern escape '\\' or d.phone like :pattern escape '\\')
              and (:bloodGroup = '' or d.bloodGroup = :bloodGroup)
            """)
    Page<Donor> search(@Param("pattern") String pattern, @Param("bloodGroup") String bloodGroup, Pageable pageable);

    boolean existsByPhone(String phone);

    boolean existsByPhoneAndIdNot(String phone, Long id);

    /**
     * Loads a donor and locks its row until the transaction ends. Used while saving a donation, so two
     * staff members adding donations for the same donor at the same moment can't both pass the
     * 90-day check: the second one waits and then sees the first one's donation.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from Donor d where d.id = :id")
    Optional<Donor> findByIdForUpdate(@Param("id") Long id);
}
