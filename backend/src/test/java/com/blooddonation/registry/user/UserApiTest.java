package com.blooddonation.registry.user;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.blooddonation.registry.auth.RefreshCookies;
import com.blooddonation.registry.support.ApiTestSupport;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

class UserApiTest extends ApiTestSupport {

    private static final String STAFF_EMAIL = "asha@test.org";

    private AppUser admin;
    private AppUser staffUser;
    private String adminBearer;

    @BeforeEach
    void createUsers() {
        admin = saveUser(Role.ADMIN, "admin@test.org");
        staffUser = saveUser(Role.STAFF, STAFF_EMAIL);
        adminBearer = bearerFor(admin);
    }

    @Test
    void listsUsersWithStatus() throws Exception {
        mockMvc.perform(get("/api/users").header(HttpHeaders.AUTHORIZATION, adminBearer))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].enabled").value(true))
                .andExpect(jsonPath("$[1].passwordHash").doesNotExist());
    }

    @Test
    void disablingBlocksTheUsersExistingTokenImmediately() throws Exception {
        String staffBearer = bearerFor(staffUser);
        mockMvc.perform(get("/api/donors").header(HttpHeaders.AUTHORIZATION, staffBearer)).andExpect(status().isOk());

        patchUser(staffUser.getId(), "{\"enabled\":false}").andExpect(jsonPath("$.enabled").value(false));

        // Same, still unexpired token: refused at once because the server checks the database.
        mockMvc.perform(get("/api/donors").header(HttpHeaders.AUTHORIZATION, staffBearer))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void disabledUserCantLogInOrRefresh() throws Exception {
        Cookie refreshCookie = login(STAFF_EMAIL).andReturn().getResponse().getCookie(RefreshCookies.NAME);
        patchUser(staffUser.getId(), "{\"enabled\":false}").andExpect(status().isOk());

        login(STAFF_EMAIL).andExpect(status().isForbidden());
        mockMvc.perform(post("/api/auth/refresh").cookie(refreshCookie)).andExpect(status().isUnauthorized());

        patchUser(staffUser.getId(), "{\"enabled\":true}").andExpect(status().isOk());
        login(STAFF_EMAIL).andExpect(status().isOk());
    }

    @Test
    void roleChangeAppliesToTheExistingTokenImmediately() throws Exception {
        AppUser donor = saveUser(Role.DONOR, "donor@test.org");
        String donorBearer = bearerFor(donor);
        mockMvc.perform(get("/api/donors").header(HttpHeaders.AUTHORIZATION, donorBearer))
                .andExpect(status().isForbidden());

        patchUser(donor.getId(), "{\"role\":\"STAFF\"}").andExpect(jsonPath("$.role").value("STAFF"));

        mockMvc.perform(get("/api/donors").header(HttpHeaders.AUTHORIZATION, donorBearer)).andExpect(status().isOk());
    }

    @Test
    void adminCantChangeTheirOwnAccount() throws Exception {
        patchUser(admin.getId(), "{\"enabled\":false}").andExpect(status().isBadRequest());
        patchUser(admin.getId(), "{\"role\":\"DONOR\"}").andExpect(status().isBadRequest());
    }

    @Test
    void onlyAdminCanManageUsers() throws Exception {
        mockMvc.perform(patch("/api/users/" + admin.getId()).header(HttpHeaders.AUTHORIZATION, bearerFor(staffUser))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"enabled\":false}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void rejectsEmptyOrInvalidChangesAndUnknownUsers() throws Exception {
        patchUser(staffUser.getId(), "{}").andExpect(status().isBadRequest());
        patchUser(staffUser.getId(), "{\"role\":\"SUPERUSER\"}").andExpect(status().isBadRequest());
        patchUser(999L, "{\"enabled\":false}").andExpect(status().isNotFound());
    }

    private ResultActions patchUser(Long id, String body) throws Exception {
        return mockMvc.perform(patch("/api/users/" + id).header(HttpHeaders.AUTHORIZATION, adminBearer)
                .contentType(MediaType.APPLICATION_JSON).content(body));
    }

    private ResultActions login(String email) throws Exception {
        return mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, PASSWORD)));
    }
}
