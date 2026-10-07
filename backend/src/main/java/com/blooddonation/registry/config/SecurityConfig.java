package com.blooddonation.registry.config;

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Who may call what. This is the REAL access control: the frontend only hides buttons.
 * Rules are checked top to bottom; anything not listed is denied.
 */
@Configuration
@EnableConfigurationProperties(AppSecurityProperties.class)
public class SecurityConfig {

    private static final String ADMIN = "ADMIN";
    private static final String STAFF = "STAFF";

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Stateless API: the access token travels in the Authorization header, which other sites
                // can't make the browser send, so CSRF tokens aren't needed. The one cookie (refresh) is
                // SameSite=Strict and only sent to /api/auth.
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(POST, "/api/auth/login", "/api/auth/register", "/api/auth/refresh",
                                "/api/auth/logout").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(GET, "/api/users").hasRole(ADMIN)
                        .requestMatchers(DELETE, "/api/donors/**", "/api/donations/**").hasRole(ADMIN)
                        .requestMatchers("/api/donors/**", "/api/donations/**").hasAnyRole(ADMIN, STAFF)
                        .anyRequest().denyAll())
                // Every other request needs "Authorization: Bearer <access token>"; a missing, expired or
                // tampered token is answered with 401, a valid token with the wrong role with 403.
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(rolesFromToken())));
        return http.build();
    }

    /** Reads the "roles" claim of the token (e.g. ["STAFF"]) as Spring roles (ROLE_STAFF). */
    private JwtAuthenticationConverter rolesFromToken() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("roles");
        authorities.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }

    /** BCrypt: slow on purpose and salted, so stolen hashes are hard to crack. */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
