package com.blooddonation.registry.user;

/** What the API returns about a user: never the password hash. */
public record UserResponse(Long id, String fullName, String email, Role role) {

    public static UserResponse from(AppUser user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
