package com.SimpleNotatnik.services;
import com.SimpleNotatnik.dto.CognitoLoginResponse;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CognitoAuthService {

   private final AWSCognitoIdentityProvider cognitoClient;
   private final String clientId;

   public CognitoAuthService(
      @Value("${cognito.region}") String region,
      @Value("${cognito.client-id}") String clientId
   ) {
      this.clientId = clientId;
      this.cognitoClient = AWSCognitoIdentityProviderClientBuilder.standard()
         .withRegion(Regions.fromName(region))
         .build();
   }

   public CognitoLoginResponse login(String username, String password) {
      Map<String, String> authParams = new HashMap<>();
      authParams.put("USERNAME", username);
      authParams.put("PASSWORD", password);

      InitiateAuthRequest request = new InitiateAuthRequest()
         .withAuthFlow(AuthFlowType.USER_PASSWORD_AUTH)
         .withClientId(clientId)
         .withAuthParameters(authParams);

      try {
         InitiateAuthResult result = cognitoClient.initiateAuth(request);

         AuthenticationResultType authResult = result.getAuthenticationResult();
         if (authResult == null) {
            // np. gdy Cognito żąda dodatkowego challenge (MFA itd.)
            throw new RuntimeException("Authentication challenge required, not handled in this flow");
         }

         return new CognitoLoginResponse(
            authResult.getAccessToken(),
            authResult.getIdToken(),
            authResult.getRefreshToken(),
            authResult.getTokenType(),
            authResult.getExpiresIn()
         );
      } catch (NotAuthorizedException e) {
         throw new RuntimeException("Invalid username or password", e);
      } catch (UserNotConfirmedException e) {
         throw new RuntimeException("User not confirmed", e);
      } catch (Exception e) {
         throw new RuntimeException("Cognito login failed", e);
      }
   }
}
