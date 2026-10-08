package com.blooddonation.registry.user;

import com.blooddonation.registry.auth.RefreshTokenRepository;
import com.blooddonation.registry.common.BadRequestException;
import com.blooddonation.registry.common.NotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Account management for admins: list users, change roles, enable or disable accounts. */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public UserService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAllByOrderByIdAsc().stream().map(UserResponse::from).toList();
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request, Long currentUserId) {
        // Stops an admin from disabling or demoting themselves (and so locking everyone out).
        if (id.equals(currentUserId)) {
            throw new BadRequestException("You can't change your own account");
        }
        AppUser user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User", id));
        if (request.role() != null) {
            user.changeRole(request.role());
        }
        if (request.enabled() != null) {
            user.setEnabled(request.enabled());
        }
        // Old sessions end, so the user logs in again with the new role or can't log in at all.
        refreshTokenRepository.revokeAllForUser(id);
        return UserResponse.from(user);
    }
}
