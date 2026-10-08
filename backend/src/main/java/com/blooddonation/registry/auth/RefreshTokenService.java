package com.blooddonation.registry.auth;

import com.blooddonation.registry.common.UnauthorizedException;
import com.blooddonation.registry.config.AppSecurityProperties;
import com.blooddonation.registry.user.AppUser;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.util.Base64;
import java.util.HexFormat;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Issues, rotates and revokes refresh tokens. A refresh token is a random value given to the
 * browser in an HttpOnly cookie; the database only keeps its SHA-256 hash.
 */
@Service
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 32;
    private static final String SESSION_ENDED = "Session expired or revoked";

    private final RefreshTokenRepository refreshTokenRepository;
    private final AppSecurityProperties properties;
    private final Clock clock;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository, AppSecurityProperties properties, Clock clock) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.properties = properties;
        this.clock = clock;
    }

    /** The user of a rotated token, plus the new raw token to put in the cookie. */
    public record Rotation(AppUser user, String newToken) {
    }

    /** Creates a new refresh token for the user and returns the raw value (only the hash is saved). */
    @Transactional
    public String issue(AppUser user) {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        refreshTokenRepository.save(
                new RefreshToken(user, hash(rawToken), clock.instant().plus(properties.refreshTokenTtl())));
        return rawToken;
    }

    /**
     * Swaps a valid refresh token for a new one (rotation: each token works only once).
     * If an already-used token comes back, someone may have stolen it, so ALL of that user's
     * sessions are ended. noRollbackFor keeps that revocation even though a 401 is thrown.
     */
    @Transactional(noRollbackFor = UnauthorizedException.class)
    public Rotation rotate(String rawToken) {
        RefreshToken token = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new UnauthorizedException(SESSION_ENDED));
        AppUser user = token.getUser();
        if (token.isRevoked()) {
            refreshTokenRepository.revokeAllForUser(user.getId());
            throw new UnauthorizedException(SESSION_ENDED);
        }
        if (token.isExpired(clock.instant()) || !user.isEnabled()) {
            throw new UnauthorizedException(SESSION_ENDED);
        }
        token.revoke();
        return new Rotation(user, issue(user));
    }

    /** Logout: the token stops working immediately. Unknown tokens are ignored. */
    @Transactional
    public void revoke(String rawToken) {
        refreshTokenRepository.findByTokenHash(hash(rawToken)).ifPresent(RefreshToken::revoke);
    }

    private static String hash(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            // Every Java runtime must support SHA-256, so this can't happen.
            throw new IllegalStateException(exception);
        }
    }
}
