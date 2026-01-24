import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
// Importy z nowego rozwiązania Keycloak
import { OAuthService, NullValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from './auth/auth.config';

@Component({
  selector: 'app-root',
  standalone: true,
  // Łączymy importy: Routery ze starego + CommonModule
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.template.html', // Zostawiamy Twój stary template!
  styleUrl: './app.css',              // Zostawiamy Twoje stare style!
})
export class App implements OnInit {
  // Zmienna kompatybilna ze starym HTMLem
  isAuthenticated = false;
  userName: string | null = null;
  errorMessage: string = '';

  constructor(
    private readonly oauthService: OAuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.configureKeycloak();
  }

  private configureKeycloak() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.setupAutomaticSilentRefresh();

    // Próba zalogowania przy starcie (jeśli user wraca z Keycloaka)
    this.oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        // Aktualizacja statusu po załadowaniu
        this.isAuthenticated = this.oauthService.hasValidAccessToken();
        
        if (this.isAuthenticated) {
          this.loadUserProfile();
          console.log('✅ Zalogowano przez Keycloak!');
        }
      })
      .catch(err => {
        console.error('❌ Błąd Keycloak:', err);
        this.errorMessage = 'Błąd połączenia z serwerem logowania.';
      });
  }

  // Zastępuje starą metodę login() z promptami
  login(): void {
    // Nie pytamy już o hasło w prompcie! Przekierowujemy.
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    this.oauthService.logOut();
    this.isAuthenticated = false;
    this.userName = null;
    this.router.navigateByUrl('/'); // Lub gdzie chcesz po wylogowaniu
  }

  // Pomocnicza metoda do wyciągnięcia imienia
  private loadUserProfile() {
    const claims = this.oauthService.getIdentityClaims() as any;
    if (claims) {
      this.userName = claims['name'] || claims['preferred_username'];
    }
  }
  
  // Metoda pomocnicza dla Twoich serwisów API
  // Jeśli gdzieś w kodzie potrzebujesz tokena, wołasz tę metodę
  get token(): string {
      return this.oauthService.getAccessToken();
  }
}