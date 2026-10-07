package com.blooddonation.registry.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.blooddonation.registry.support.ApiTestSupport;
import com.blooddonation.registry.user.Role;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

class AuthApiTest extends ApiTestSupport {

    private static final String REGISTER_BODY = """
            {"fullName":"Asha Rao","email":"Asha@Example.com","phone":"9111111111",
             "bloodGroup":"A+","password":"Strong@123","role":"ADMIN"}
            """;

    @BeforeEach
    void registerAsha() throws Exception {
        postJson("/api/auth/register", REGISTER_BODY).andExpect(status().isCreated());
    }

    @Test
    void registrationAlwaysCreatesADonorEvenIfARoleIsSent() {
        assertThat(userRepository.findByEmail("asha@example.com")).get()
                .extracting(user -> user.getRole()).isEqualTo(Role.DONOR);
    }

    @Test
    void rejectsADuplicateEmailInAnyCase() throws Exception {
        postJson("/api/auth/register", REGISTER_BODY.replace("Asha@Example.com", "ASHA@example.COM"))
                .andExpect(status().isConflict());
    }

    @Test
    void rejectsAWeakPassword() throws Exception {
        postJson("/api/auth/register", REGISTER_BODY.replace("Strong@123", "weakpass"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginReturnsTheUserAndSetsAnHttpOnlyRefreshCookie() throws Exception {
        login("asha@example.com", PASSWORD)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isString())
                .andExpect(jsonPath("$.user.role").value("DONOR"))
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist())
                .andExpect(cookie().httpOnly(RefreshCookies.NAME, true))
                .andExpect(cookie().secure(RefreshCookies.NAME, true))
                .andExpect(cookie().path(RefreshCookies.NAME, "/api/auth"));
    }

    @Test
    void wrongPasswordAndUnknownEmailGetTheSameAnswer() throws Exception {
        login("asha@example.com", "Wrong@123").andExpect(status().isUnauthorized());
        login("nobody@example.com", "Wrong@123").andExpect(status().isUnauthorized());
    }

    @Test
    void refreshRotatesTheTokenAndDetectsReuse() throws Exception {
        Cookie first = login("asha@example.com", PASSWORD).andReturn().getResponse().getCookie(RefreshCookies.NAME);
        Cookie second = refresh(first).andExpect(status().isOk())
                .andReturn().getResponse().getCookie(RefreshCookies.NAME);

        // The first token was already used: treat it as stolen, end every session of the user.
        refresh(first).andExpect(status().isUnauthorized());
        refresh(second).andExpect(status().isUnauthorized());
    }

    @Test
    void logoutRevokesTheRefreshTokenAndClearsTheCookie() throws Exception {
        Cookie token = login("asha@example.com", PASSWORD).andReturn().getResponse().getCookie(RefreshCookies.NAME);
        mockMvc.perform(post("/api/auth/logout").cookie(token))
                .andExpect(status().isNoContent())
                .andExpect(cookie().maxAge(RefreshCookies.NAME, 0));
        refresh(token).andExpect(status().isUnauthorized());
    }

    @Test
    void refreshWithoutACookieIsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/auth/refresh")).andExpect(status().isUnauthorized());
    }

    private ResultActions login(String email, String password) throws Exception {
        return postJson("/api/auth/login", "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, password));
    }

    private ResultActions refresh(Cookie cookie) throws Exception {
        return mockMvc.perform(post("/api/auth/refresh").cookie(cookie));
    }

    private ResultActions postJson(String url, String body) throws Exception {
        return mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(body));
    }
}
