import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const authService = inject(AuthService);
  const router = inject(Router);

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned).pipe(
      catchError((error) => {
        if (
          error?.error?.message === 'Token expirado' ||
          error?.error?.message === 'Token inválido' ||
          error?.status === 401
        ) {
          authService.logout();
          authService.emitirSesionExpirada();
        }
        return throwError(() => error);
      }),
    );
  }

  return next(req);
};
