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
          console.log('[AuthInterceptor] Successfully got token. Adding Bearer header. URL:', req.url);
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
            withCredentials: false,
          });
          return next.handle(authReq);
        }),
        catchError((error) => {
          console.warn('[AuthInterceptor] Failed to retrieve token. Falling back to guest mode. URL:', req.url, 'Error:', error);
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
