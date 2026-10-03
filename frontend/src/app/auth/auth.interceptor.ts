import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

// Adjunta el token Bearer a las peticiones hacia nuestra API.
// No molesta a recursos externos ni a peticiones sin sesión.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;

  const isApi = req.url.startsWith(environment.apiBaseUrl);
  if (token && isApi) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
