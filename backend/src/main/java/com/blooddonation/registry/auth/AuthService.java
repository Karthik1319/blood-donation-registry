package com.blooddonation.registry.auth;

import com.blooddonation.registry.common.ConflictException;
import com.blooddonation.registry.common.ForbiddenException;
import com.blooddonation.registry.common.UnauthorizedException;
import com.blooddonation.registry.user.AppUser;
import com.blooddonation.registry.user.Role;
import com.blooddonation.registry.user.UserRepository;
import com.blooddonation.registry.user.UserResponse;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Login, registration and session refresh/logout. */
@Service
public class AuthService {

    private static final String LOGIN_FAILED = "Invalid email or password";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccessTokenService accessTokenService;
    private final RefreshTokenService refreshTokenService;
    /** Used when the email doesn't exist, so a wrong email takes as long as a wrong password. */
    private final String dummyPasswordHash;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AccessTokenService accessTokenService, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
        this.dummyPasswordHash = passwordEncoder.encode("not-a-real-password");
    }

    /** A new session: the body for the client plus the raw refresh token for the cookie. */
    public record Session(SessionResponse body, String refreshToken) {
    }

    @Transactional
    public Session login(LoginRequest request) {
        AppUser user = userRepository.findByEmail(normalizeEmail(request.email())).orElse(null);
        String hash = user != null ? user.getPasswordHash() : dummyPasswordHash;
        boolean isPasswordCorrect = passwordEncoder.matches(request.password(), hash);
        // Same answer for "no such email" and "wrong password", so emails can't be discovered.
        if (user == null || !isPasswordCorrect) {
            throw new UnauthorizedException(LOGIN_FAILED);
        }
        // Only said after a correct password, so it doesn't reveal which accounts exist.
        if (!user.isEnabled()) {
            throw new ForbiddenException("This account has been disabled");
        }
        return new Session(toResponse(user), refreshTokenService.issue(user));
    }

    @Transactional
    public void register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists");
        }
        String passwordHash = passwordEncoder.encode(request.password());
        userRepository.save(new AppUser(
                request.fullName(), email, request.phone(), request.bloodGroup(), passwordHash, Role.DONOR));
    }

    @Transactional(noRollbackFor = UnauthorizedException.class)
    public Session refresh(String refreshToken) {
        RefreshTokenService.Rotation rotation = refreshTokenService.rotate(refreshToken);
        return new Session(toResponse(rotation.user()), rotation.newToken());
    }

    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
    }

    private SessionResponse toResponse(AppUser user) {
        return new SessionResponse(accessTokenService.createFor(user), UserResponse.from(user));
    }

    private static String normalizeEmail(String email) {
        return email.toLowerCase(Locale.ROOT);
    }
}
