import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { firstValueFrom } from 'rxjs'; // Import firstValueFrom

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth0: Auth0Service,
    private localAuthService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isAuthenticated = this.localAuthService.isAuthenticatedSubject.value;
    console.log(
      '[AuthInterceptor] Start intercepting. isAuthenticated:',
      isAuthenticated,
      'URL:',
      req.url
    );

    // Check if Auth0 user is authenticated
    return from(firstValueFrom(this.auth0.isAuthenticated$)).pipe(
      switchMap((isAuth0Authenticated) => {
        console.log(
          '[AuthInterceptor] Auth0 isAuthenticated:',
          isAuth0Authenticated
        );

        if (isAuth0Authenticated) {
          // Auth0 user: get token
          console.log(
            '[AuthInterceptor] Auth0 user detected. Getting token...'
          );
          return from(firstValueFrom(this.auth0.getAccessTokenSilently())).pipe(
            switchMap((token) => {
              console.log(
                '[AuthInterceptor] Got Auth0 token. Sending request with bearer token.'
              );
              const authReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
                withCredentials: false,
              });
              return next.handle(authReq);
            }),
            catchError((error) => {
              console.warn(
                '[AuthInterceptor] Failed to get token for Auth0 user. No fallback as this should not happen normally:',
                error
              );
              throw error;
            })
          );
        } else if (isAuthenticated && !isAuth0Authenticated) {
          // Guest user: do NOT try to get token
          console.log(
            '[AuthInterceptor] Guest user detected. Sending request as guest.'
          );
          const guestReq = req.clone({ withCredentials: true });
          return next.handle(guestReq);
        } else {
          // Not authenticated at all
          console.log('[AuthInterceptor] Not authenticated. Sending as guest.');
          const guestReq = req.clone({ withCredentials: true });
          return next.handle(guestReq);
        }
      })
    );
  }
}
