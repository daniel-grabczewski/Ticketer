// src/app/auth-interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, from } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the user is authenticated
    return this.auth.isAuthenticated$.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          // If authenticated, get the token and clone the request with the Authorization header
          return from(this.auth.getAccessTokenSilently()).pipe(
            switchMap((token) => {
              const authReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
              });
              return next.handle(authReq);
            })
          );
        } else {
          // If not authenticated, proceed without modifying the request
          return next.handle(req);
        }
      })
    );
  }
}
