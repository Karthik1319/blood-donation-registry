package com.blooddonation.registry.config;

import com.blooddonation.registry.user.AppUser;
import com.blooddonation.registry.user.UserRepository;
import java.util.List;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

/**
 * Runs on every API request after the token's signature and expiry are checked. Looks the user up
 * in the database instead of trusting the token alone, so that:
 * - a disabled (or deleted) account is refused on its very next request (401), and
 * - a role change applies immediately, because the role is read from the database, not the token.
 * Without this, an already-issued token would keep its old rights until it expires (up to 15 min).
 * Cost: one primary-key lookup per request.
 */
@Component
public class CurrentUserAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserRepository userRepository;

    public CurrentUserAuthenticationConverter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        AppUser user = userRepository.findById(Long.valueOf(jwt.getSubject()))
                .filter(AppUser::isEnabled)
                .orElseThrow(() -> new InvalidBearerTokenException("Account not found or disabled"));
        SimpleGrantedAuthority role = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        return new JwtAuthenticationToken(jwt, List.of(role), jwt.getSubject());
    }
}
