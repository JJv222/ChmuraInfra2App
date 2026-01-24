import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // Adres Twojego Keycloaka (musi być dostępny z przeglądarki!)
  issuer: 'http://localhost:9081/realms/simple-notatnik',

  // Redirect URI (gdzie wracamy po logowaniu)
  redirectUri: window.location.origin, // czyli http://localhost:4200

  // Client ID, który stworzyliśmy w kroku 1
  clientId: 'frontend-client',

  // Scope (co chcemy pobrać)
  scope: 'openid profile email offline_access',

  // Ważne: to mówi bibliotece, że nie używamy sekretu
  responseType: 'code',
  
  // Wymusza HTTPS (na localhoście wyłączamy, na produkcji musi być true)
  requireHttps: false,
  
  // Pokazuje debug w konsoli przeglądarki (pomocne na start)
  showDebugInformation: true,
};