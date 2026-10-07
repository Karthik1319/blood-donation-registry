package com.blooddonation.registry.auth;

import com.blooddonation.registry.user.UserResponse;

/** Body of login/refresh: { accessToken, user }. The refresh token goes in a cookie, never here. */
public record SessionResponse(String accessToken, UserResponse user) {
}
