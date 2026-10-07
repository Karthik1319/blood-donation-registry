package com.blooddonation.registry.donor;

import com.blooddonation.registry.common.ConflictException;
import com.blooddonation.registry.common.NotFoundException;
import com.blooddonation.registry.common.PageResponse;
import java.util.Locale;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DonorService {

    private static final String PHONE_TAKEN = "Another donor already uses this phone number";

    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<DonorResponse> search(int page, int size, String search, String bloodGroup) {
        // Sorted by name; id as tie-breaker keeps the order stable between pages.
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("name").and(Sort.by("id")));
        return PageResponse.from(
                donorRepository.search(toLikePattern(search), bloodGroup.strip(), pageRequest), DonorResponse::from);
    }

    @Transactional(readOnly = true)
    public DonorResponse get(Long id) {
        return DonorResponse.from(find(id));
    }

    @Transactional
    public DonorResponse create(DonorRequest request) {
        if (donorRepository.existsByPhone(request.phone())) {
            throw new ConflictException(PHONE_TAKEN);
        }
        Donor donor = new Donor(request.name(), request.bloodGroup(), request.phone());
        return DonorResponse.from(donorRepository.save(donor));
    }

    @Transactional
    public DonorResponse update(Long id, DonorRequest request) {
        Donor donor = find(id);
        if (donorRepository.existsByPhoneAndIdNot(request.phone(), id)) {
            throw new ConflictException(PHONE_TAKEN);
        }
        donor.update(request.name(), request.bloodGroup(), request.phone());
        return DonorResponse.from(donor);
    }

    /** The database deletes the donor's donations too (ON DELETE CASCADE). */
    @Transactional
    public void delete(Long id) {
        donorRepository.delete(find(id));
    }

    private Donor find(Long id) {
        return donorRepository.findById(id).orElseThrow(() -> new NotFoundException("Donor", id));
    }

    /** "ra%" → "%ra\%%": the user's text is matched literally, so % or _ can't act as wildcards. */
    private static String toLikePattern(String search) {
        String escaped = search.strip().toLowerCase(Locale.ROOT)
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
        return "%" + escaped + "%";
    }
}
