import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(OAuthService);
  const token = auth.getAccessToken();
  console.log('AuthInterceptor - token:', token);
  // Tylko do wywołań na backend (Twoje API)
  if (token && req.url.startsWith('/api')) {
    console.log('Dodaję token do żądania HTTP');
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
