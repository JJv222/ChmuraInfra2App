import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Używamy sygnału (Signal) do trzymania stanu - to nowoczesne podejście
  // Domyślnie false (niezalogowany)
  private _isLoggedIn = signal(false); 

  // Metoda dla Guarda - czy jestem zalogowany?
  isLoggedIn() {
    return this._isLoggedIn();
  }

  // Metoda do logowania (np. po kliknięciu przycisku)
  login() {
    this._isLoggedIn.set(true);
  }

  // Metoda do wylogowania
  logout() {
    this._isLoggedIn.set(false);
  }
}