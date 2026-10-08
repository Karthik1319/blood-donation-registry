package com.blooddonation.registry.user;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** /api/users: account management. Admin only (see SecurityConfig). */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> listUsers() {
        return userService.listUsers();
    }

    /** The logged-in admin's id comes from the token's subject, never from the request body. */
    @PatchMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id, @Valid @RequestBody UpdateUserRequest request, @AuthenticationPrincipal Jwt jwt) {
        return userService.updateUser(id, request, Long.valueOf(jwt.getSubject()));
    }
}
