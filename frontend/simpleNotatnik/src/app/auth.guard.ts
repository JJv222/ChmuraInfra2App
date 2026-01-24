import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc'; // <--- Używamy tego co masz

export const authGuard: CanActivateFn = (route, state) => {
  const oauthService = inject(OAuthService);
  const router = inject(Router);

  // Sprawdzamy, czy użytkownik ma ważny token
  // Biblioteka robi to za nas (sprawdza obecność i czas wygaśnięcia)
  const isLogged = oauthService.hasValidAccessToken(); 

  if (isLogged) {
    return true; // Wpuszczamy
  } else {
    // Nie ma tokena? Przekieruj na WelcomePage
    return router.createUrlTree(['/']); 
  }
};