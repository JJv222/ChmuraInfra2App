package com.SimpleNotatnik.controller;

import com.SimpleNotatnik.dto.AuthConfigDto;
import com.SimpleNotatnik.dto.CognitoLoginRequest;
import com.SimpleNotatnik.dto.CognitoLoginResponse;
import com.SimpleNotatnik.services.CognitoAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth-config")
public class AuthConfigController {

   @Value("${cognito.issuer-uri}")
   private String issuerUri;

   @Value("${cognito.client-id}")
   private String clientId;

   @Value("${cognito.redirect.url}")
   private String redirectUrl;

   @Value("${cognito.logout.url}")
   private String logoutUrl;

   @Value("${cognito.scope}")
   private String scope;

   @GetMapping
   public AuthConfigDto getAuthConfig() {
      AuthConfigDto dto = new AuthConfigDto();
      dto.setAuthority(issuerUri);
      dto.setClientId(clientId);
      dto.setRedirectUrl(redirectUrl);
      dto.setLogoutUrl(logoutUrl);
      dto.setScope(scope);
      dto.setResponseType("code");
      return dto;
   }

   private final CognitoAuthService cognitoAuthService;

   public AuthConfigController(CognitoAuthService cognitoAuthService) {
      this.cognitoAuthService = cognitoAuthService;
   }

   @PostMapping("/login")
   public ResponseEntity<?> login(@RequestBody CognitoLoginRequest request) {
      try {
         CognitoLoginResponse resp = cognitoAuthService.login(request.username(), request.password());
         return ResponseEntity.ok(resp);
      } catch (RuntimeException ex) {
         // tu możesz rozróżniać komunikaty jeśli chcesz
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
      }
   }
}
