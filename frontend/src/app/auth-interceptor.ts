// src/app/auth-interceptor.ts
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
    console.log('[AuthInterceptor] Start intercepting. isAuthenticated:', isAuthenticated, 'URL:', req.url);

    if (isAuthenticated) {
      console.log('[AuthInterceptor] User is authenticated. Attempting to get Auth0 token. URL:', req.url);
      return from(this.auth0.getAccessTokenSilently()).pipe(
        switchMap((token) => {
          // If we got a token successfully, proceed to send the request
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          return next.handle(authReq).pipe(
            // If the request itself fails after we got a token, do not fallback to guest.
            // Just rethrow the error so the error-handling.service can handle it.
            catchError((error) => {
              console.warn('[AuthInterceptor] Request failed after token retrieval. Not falling back to guest mode. Re-throwing error:', error);
              throw error; // Re-throw the error to be handled by your global error handler
            })
          );
        }),
        catchError((tokenError) => {
          // This catchError only triggers if getAccessTokenSilently() itself fails
          console.warn('[AuthInterceptor] Token retrieval failed. Falling back to guest mode.', tokenError);
          const guestReq = req.clone({ withCredentials: true });
          return next.handle(guestReq);
        })
      );
    } else {
      console.log('[AuthInterceptor] User not authenticated. Sending request as guest with credentials. URL:', req.url);
      const guestReq = req.clone({
        withCredentials: true,
      });
      return next.handle(guestReq);
    }
  }
}
