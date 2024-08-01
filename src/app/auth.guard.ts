import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './admin/services/auth.service';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    map(response => {
      if (response.estado && response.rol != "cliente") {
        return true;
      } else {
        router.navigate(['/sesion/sign-in']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/sesion/sign-in']);
      return of(false);
    })
  );
  
};