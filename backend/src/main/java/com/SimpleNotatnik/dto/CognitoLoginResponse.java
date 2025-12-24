package com.SimpleNotatnik.dto;

public record CognitoLoginResponse(
   String accessToken,
   String idToken,
   String refreshToken,
   String tokenType,
   Integer expiresIn
) {}
