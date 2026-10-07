package com.blooddonation.registry.donor;

import com.blooddonation.registry.common.PageResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** /api/donors. Who may call each method is set in SecurityConfig. */
@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private static final int MAX_PAGE_SIZE = 50;

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @GetMapping
    public PageResponse<DonorResponse> search(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(MAX_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String bloodGroup) {
        return donorService.search(page, size, search, bloodGroup);
    }

    @GetMapping("/{id}")
    public DonorResponse get(@PathVariable Long id) {
        return donorService.get(id);
    }

    @PostMapping
    public ResponseEntity<DonorResponse> create(@Valid @RequestBody DonorRequest request) {
        DonorResponse created = donorService.create(request);
        return ResponseEntity.created(URI.create("/api/donors/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public DonorResponse update(@PathVariable Long id, @Valid @RequestBody DonorRequest request) {
        return donorService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        donorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
