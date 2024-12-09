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

  console.log('[myAuthGuardFn] Checking route:', state.url);

  return combineLatest([
    auth0.isAuthenticated$,
    authService.isAuthenticated$,
  ]).pipe(
    take(1),
    map(([isAuth0Authenticated, isGuestAuthenticated]) => {
      console.log(
        '[myAuthGuardFn] isAuth0Authenticated:',
        isAuth0Authenticated,
        'isGuestAuthenticated:',
        isGuestAuthenticated
      );

      // Block access to /welcome if user is authenticated or a guest
      if (
        state.url === '/welcome' &&
        (isAuth0Authenticated || isGuestAuthenticated)
      ) {
        console.log(
          '[myAuthGuardFn] Redirecting to dashboard because /welcome is not accessible for authenticated/guest users.'
        );
        router.navigate(['']); // Redirect to the dashboard
        return false;
      }

      // Allow unauthenticated users to access /welcome
      if (
        state.url === '/welcome' &&
        !isAuth0Authenticated &&
        !isGuestAuthenticated
      ) {
        console.log(
          '[myAuthGuardFn] Allowing unauthenticated user to access /welcome.'
        );
        return true;
      }

      // Allow access to all other routes if authenticated or guest
      if (isAuth0Authenticated || isGuestAuthenticated) {
        console.log('[myAuthGuardFn] Access granted to:', state.url);
        return true;
      }

      // Redirect unauthenticated users to /welcome
      console.log('[myAuthGuardFn] Access denied. Redirecting to /welcome.');
      router.navigate(['/welcome']);
      return false;
    })
  );
};
