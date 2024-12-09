import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/auth-interceptor';
import { provideAppInitializer, inject } from '@angular/core';
import { AuthService } from './app/core/services/auth.service';

export function initializeAuth(): Promise<void> {
  console.log('[main.ts] initializeAuth started');
  const authService = inject(AuthService);
  return new Promise((resolve) => {
    const guestCookieExists = document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('GuestId='));

    console.log('[main.ts] Guest cookie exists at init?', guestCookieExists);
    console.log('[main.ts] Current isAuthenticatedSubject value:', authService.isAuthenticatedSubject.value);

    if (guestCookieExists && !authService.isAuthenticatedSubject.value) {
      console.log('[main.ts] Setting guest authenticated at startup.');
      authService.setGuestAuthenticated();
    }

    console.log('[main.ts] initializeAuth complete');
    resolve();
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        audience: environment.auth.audience,
        scope:
          'openid profile email read:tickets create:tickets update:tickets delete:ticket read:boards create:boards update:boards delete:boards read:lists create:lists update:lists delete:lists read:colors create:colors update:colors delete:colors read:users create:users update:users delete:user',
        redirect_uri: window.location.origin,
      },
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideAppInitializer(initializeAuth),
  ],
}).catch((err) => console.error(err));
