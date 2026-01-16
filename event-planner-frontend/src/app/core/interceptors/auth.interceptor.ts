import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('auth_token');

  const authReq = token
    ? request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      })
    : request;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearAuth();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
