// src/app/app.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../auth-config.module';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.template.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  isAuthenticated = false;

  constructor(private readonly authService: AuthService, private readonly router: Router,) {}

  ngOnInit(): void {
    this.isAuthenticated = !!this.authService.getToken();
  }

  login(): void {
    const email = prompt('Email (Cognito)');
    const password = prompt('Hasło');
    if (!email || !password) return;

    this.authService.login(email, password).subscribe({
      next: () => {
        console.log('Logged in via Cognito');
        this.isAuthenticated = true;
      },
      error: (err) => {
        console.error('Login error', err);
        alert('Błędny email / hasło albo błąd backendu');
        this.isAuthenticated = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigateByUrl('/notes');
  }
}
