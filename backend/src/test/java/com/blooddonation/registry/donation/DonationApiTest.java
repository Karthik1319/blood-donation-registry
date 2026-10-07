package com.blooddonation.registry.donation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.blooddonation.registry.support.ApiTestSupport;
import com.blooddonation.registry.user.Role;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

class DonationApiTest extends ApiTestSupport {

    private static final LocalDate TODAY = LocalDate.now();

    @Autowired
    private DonationRepository donationRepository;

    private String staff;
    private Long donorId;

    @BeforeEach
    void createDonorAndStaff() {
        staff = bearerFor(Role.STAFF);
        donorId = saveDonor("Ravi Kumar", "9876500001").getId();
    }

    @Test
    void blocksASecondDonationWithin90Days() throws Exception {
        addDonation(TODAY.minusDays(30)).andExpect(status().isCreated());
        addDonation(TODAY).andExpect(status().isUnprocessableContent());
    }

    @Test
    void allowsExactly90DaysLater() throws Exception {
        addDonation(TODAY.minusDays(90)).andExpect(status().isCreated());
        addDonation(TODAY).andExpect(status().isCreated());
    }

    @Test
    void blocksABackFilledDateTooCloseToALaterDonation() throws Exception {
        addDonation(TODAY.minusDays(10)).andExpect(status().isCreated());
        addDonation(TODAY.minusDays(60)).andExpect(status().isUnprocessableContent());
        addDonation(TODAY.minusDays(200)).andExpect(status().isCreated());
    }

    @Test
    void editingKeepsTheRuleButIgnoresTheDonationItself() throws Exception {
        addDonation(TODAY.minusDays(200)).andExpect(status().isCreated());
        addDonation(TODAY.minusDays(20)).andExpect(status().isCreated());
        Long oldest = donationRepository.findByDonorNewestFirst(donorId).get(1).getId();

        updateDonation(oldest, TODAY.minusDays(205)).andExpect(status().isOk());
        updateDonation(oldest, TODAY.minusDays(60)).andExpect(status().isUnprocessableContent());
    }

    @Test
    void rejectsFutureDatesAndQuantitiesOutOfRange() throws Exception {
        addDonation(TODAY.plusDays(1)).andExpect(status().isBadRequest());
        mockMvc.perform(post("/api/donors/" + donorId + "/donations").header(HttpHeaders.AUTHORIZATION, staff)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(TODAY).replace("450", "500")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listsNewestFirstAndOnlyAdminDeletes() throws Exception {
        addDonation(TODAY.minusDays(200));
        addDonation(TODAY.minusDays(10));
        mockMvc.perform(get("/api/donors/" + donorId + "/donations").header(HttpHeaders.AUTHORIZATION, staff))
                .andExpect(jsonPath("$[0].donationDate").value(TODAY.minusDays(10).toString()))
                .andExpect(jsonPath("$[0].donorId").value(donorId));

        Long id = donationRepository.findByDonorNewestFirst(donorId).get(0).getId();
        mockMvc.perform(delete("/api/donations/" + id).header(HttpHeaders.AUTHORIZATION, staff))
                .andExpect(status().isForbidden());
        mockMvc.perform(delete("/api/donations/" + id).header(HttpHeaders.AUTHORIZATION, bearerFor(Role.ADMIN)))
                .andExpect(status().isNoContent());
    }

    @Test
    void deletingADonorDeletesTheirDonations() throws Exception {
        addDonation(TODAY.minusDays(10));
        mockMvc.perform(delete("/api/donors/" + donorId).header(HttpHeaders.AUTHORIZATION, bearerFor(Role.ADMIN)))
                .andExpect(status().isNoContent());
        org.assertj.core.api.Assertions.assertThat(donationRepository.count()).isZero();
    }

    private ResultActions addDonation(LocalDate date) throws Exception {
        return mockMvc.perform(post("/api/donors/" + donorId + "/donations").header(HttpHeaders.AUTHORIZATION, staff)
                .contentType(MediaType.APPLICATION_JSON).content(body(date)));
    }

    private ResultActions updateDonation(Long id, LocalDate date) throws Exception {
        return mockMvc.perform(put("/api/donations/" + id).header(HttpHeaders.AUTHORIZATION, staff)
                .contentType(MediaType.APPLICATION_JSON).content(body(date)));
    }

    private static String body(LocalDate date) {
        return "{\"donationDate\":\"%s\",\"quantity\":450,\"location\":\"City Blood Bank\"}".formatted(date);
    }
}
