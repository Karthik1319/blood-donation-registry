package com.blooddonation.registry.donor;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.blooddonation.registry.support.ApiTestSupport;
import com.blooddonation.registry.user.Role;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

class DonorApiTest extends ApiTestSupport {

    private static final String NEW_DONOR = """
            {"name":"Seán O'Brien","bloodGroup":"O-","phone":"9222222222"}
            """;

    @Test
    void requiresAValidToken() throws Exception {
        mockMvc.perform(get("/api/donors")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/donors").header(HttpHeaders.AUTHORIZATION, "Bearer not.a.token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void donorAccountsCannotSeeTheDonorList() throws Exception {
        mockMvc.perform(get("/api/donors").header(HttpHeaders.AUTHORIZATION, bearerFor(Role.DONOR)))
                .andExpect(status().isForbidden());
    }

    @Test
    void staffCanCreateButADuplicatePhoneIsRejected() throws Exception {
        String staff = bearerFor(Role.STAFF);
        createDonor(staff, NEW_DONOR).andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Seán O'Brien"));
        createDonor(staff, NEW_DONOR).andExpect(status().isConflict());
    }

    @Test
    void rejectsInvalidInput() throws Exception {
        String invalid = "{\"name\":\"R2D2\",\"bloodGroup\":\"C+\",\"phone\":\"123\"}";
        createDonor(bearerFor(Role.STAFF), invalid).andExpect(status().isBadRequest());
    }

    @Test
    void onlyAdminCanDelete() throws Exception {
        Long id = saveDonor("Ravi Kumar", "9876500001").getId();
        mockMvc.perform(delete("/api/donors/" + id).header(HttpHeaders.AUTHORIZATION, bearerFor(Role.STAFF)))
                .andExpect(status().isForbidden());
        mockMvc.perform(delete("/api/donors/" + id).header(HttpHeaders.AUTHORIZATION, bearerFor(Role.ADMIN)))
                .andExpect(status().isNoContent());
    }

    @Test
    void searchesFiltersAndPagesSortedByName() throws Exception {
        saveDonor("Ravi Kumar", "9876500001");
        saveDonor("Priya Sharma", "9876500002");
        saveDonor("Anjali Verma", "9876500003");
        String admin = bearerFor(Role.ADMIN);

        mockMvc.perform(get("/api/donors?page=0&size=2").header(HttpHeaders.AUTHORIZATION, admin))
                .andExpect(jsonPath("$.totalElements").value(3))
                .andExpect(jsonPath("$.totalPages").value(2))
                .andExpect(jsonPath("$.content[0].name").value("Anjali Verma"));
        mockMvc.perform(get("/api/donors?search=RAVI").header(HttpHeaders.AUTHORIZATION, admin))
                .andExpect(jsonPath("$.content.length()").value(1));
        mockMvc.perform(get("/api/donors?search=500002").header(HttpHeaders.AUTHORIZATION, admin))
                .andExpect(jsonPath("$.content[0].name").value("Priya Sharma"));
    }

    @Test
    void treatsPercentInSearchAsTextNotAWildcard() throws Exception {
        saveDonor("Ravi Kumar", "9876500001");
        mockMvc.perform(get("/api/donors?search=%25").header(HttpHeaders.AUTHORIZATION, bearerFor(Role.ADMIN)))
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    void returns404WithoutInternalDetails() throws Exception {
        mockMvc.perform(get("/api/donors/999").header(HttpHeaders.AUTHORIZATION, bearerFor(Role.ADMIN)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.trace").doesNotExist());
    }

    private org.springframework.test.web.servlet.ResultActions createDonor(String bearer, String body)
            throws Exception {
        return mockMvc.perform(post("/api/donors").header(HttpHeaders.AUTHORIZATION, bearer)
                .contentType(MediaType.APPLICATION_JSON).content(body));
    }
}
