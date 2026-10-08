package com.blooddonation.registry.user;

import jakarta.validation.constraints.AssertTrue;

/** Body of PATCH /api/users/{id}: change the role, enable/disable, or both. Omitted fields stay as they are. */
public record UpdateUserRequest(Role role, Boolean enabled) {

    @AssertTrue(message = "Send a role, an enabled flag, or both")
    public boolean hasAnyChange() {
        return role != null || enabled != null;
    }
}
