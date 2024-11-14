// src/app/auth-interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, from, of } from 'rxjs';
import { switchMap, take, catchError } from 'rxjs/operators';
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
    // Use cached authentication state from local AuthService
    const isAuthenticated = this.localAuthService.isAuthenticatedSubject.value;

    if (isAuthenticated) {
      // If cached state indicates authenticated, attempt to retrieve token
      return from(this.auth0.getAccessTokenSilently()).pipe(
        switchMap((token) => {
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
            withCredentials: false,
          });
          return next.handle(authReq);
        }),
        catchError((error) => {
          // If token retrieval fails, fallback to handling the request as a guest
          const guestReq = req.clone({ withCredentials: true });
          return next.handle(guestReq);
        })
      );
    } else {
      // If not authenticated, clone the request with withCredentials: true to handle as a guest
      const guestReq = req.clone({
        withCredentials: true,
      });
      return next.handle(guestReq);
    }
  }
}
