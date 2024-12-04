import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AuthService } from './core/services/auth.service';
import { map, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

export const myAuthGuardFn: CanActivateFn = (route, state) => {
  const auth0 = inject(Auth0Service);
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([
    auth0.isAuthenticated$,
    authService.isAuthenticated$,
  ]).pipe(
    take(1),
    map(([isAuth0Authenticated, isGuestAuthenticated]) => {
      if (isAuth0Authenticated || isGuestAuthenticated) {
        // User is authenticated via Auth0 or as a guest; allow access
        return true;
      } else {
        // User is not authenticated; redirect to /welcome
        router.navigate(['/welcome']);
        return false;
      }
    })
  );
};
