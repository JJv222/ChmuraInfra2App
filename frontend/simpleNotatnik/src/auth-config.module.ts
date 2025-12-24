import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface CognitoLoginRequest {
  username: string;
  password: string;
}

interface CognitoLoginResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'API_TOKEN';

  constructor(private http: HttpClient) {}

  /**
   * Wywołuje backendowy endpoint /api/auth/login
   * Backend gada z Cognito (USER_PASSWORD_AUTH) i zwraca tokeny.
   */
  login(username: string, password: string): Observable<CognitoLoginResponse> {
    const body: CognitoLoginRequest = { username, password };

    return this.http.post<CognitoLoginResponse>('/api/auth-config/login', body).pipe(
      tap((res) => {
        // zapisujemy tylko accessToken – będzie użyty do Authorization: Bearer
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
