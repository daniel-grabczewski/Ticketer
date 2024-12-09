import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { catchError, distinctUntilChanged, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.baseURL}/auth`;
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth0: Auth0Service,
    private errorHandlingService: ErrorHandlingService
  ) {
    console.log('[AuthService] Constructor running.');
    this.initializeAuthenticationState();
  }

  /**
   * Initializes authentication state based on Auth0 and guest cookie.
   */
  private initializeAuthenticationState(): void {
    const guestCookieExists = document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('GuestId='));

    if (guestCookieExists) {
      console.log('[AuthService] GuestId cookie found at startup. Setting isAuthenticated to true.');
      this.isAuthenticatedSubject.next(true);
    }

    this.auth0.isAuthenticated$
      .pipe(distinctUntilChanged())
      .subscribe((auth0IsAuthenticated) => {
        console.log('[AuthService] Auth0 isAuthenticated$ changed:', auth0IsAuthenticated);

        const guestCookie = document.cookie
          .split(';')
          .some((item) => item.trim().startsWith('GuestId='));

        if (auth0IsAuthenticated) {
          console.log('[AuthService] Auth0 says we are authenticated. Setting isAuthenticated = true.');
          this.isAuthenticatedSubject.next(true);
        } else {
          // Auth0 says false. If we have a guest cookie, remain authenticated as a guest.
          if (guestCookie) {
            console.log('[AuthService] Auth0 is false, but guest cookie exists. Keeping isAuthenticated = true (guest mode).');
            // Do nothing, remain true since guest mode is valid
          } else {
            console.log('[AuthService] Auth0 is false and no guest cookie. Setting isAuthenticated = false.');
            this.isAuthenticatedSubject.next(false);
          }
        }
      });
  }

  public setGuestAuthenticated(): void {
    console.log('[AuthService] setGuestAuthenticated called.');
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Generates a Guest ID and sets the cookie.
   * @returns An Observable of any.
   */
  generateGuestId(): Observable<any> {
    console.log('[AuthService] generateGuestId called.');
    const url = `${this.baseUrl}/generateGuestId`;
    return this.http
      .get<any>(url, { withCredentials: true })
      .pipe(
        tap(() => {
          console.log('[AuthService] generateGuestId successful. Setting isAuthenticated = true (guest).');
          this.isAuthenticatedSubject.next(true);
        }),
        catchError((err) => {
          console.error('[AuthService] generateGuestId failed:', err);
          return this.errorHandlingService.handleError(err);
        })
      );
  }

  /**
   * Checks if there is guest data associated with the Guest ID.
   * @returns An Observable of { hasGuestData: boolean }.
   */
  hasGuestData(): Observable<{ hasGuestData: boolean }> {
    console.log('[AuthService] hasGuestData called.');
    const url = `${this.baseUrl}/hasGuestData`;
    return this.http
      .get<{ hasGuestData: boolean }>(url, { withCredentials: true })
      .pipe(
        tap((res) => console.log('[AuthService] hasGuestData response:', res)),
        catchError((err) => {
          console.error('[AuthService] hasGuestData failed:', err);
          return this.errorHandlingService.handleError(err);
        })
      );
  }

  /**
   * Transfers guest data to the authenticated user.
   * @returns An Observable of void.
   */
  transferGuestData(): Observable<void> {
    console.log('[AuthService] transferGuestData called.');
    const url = `${this.baseUrl}/transferGuestData`;
    return this.http
      .post<void>(url, {}, { withCredentials: true })
      .pipe(
        tap(() => console.log('[AuthService] transferGuestData successful.')),
        catchError((err) => {
          console.error('[AuthService] transferGuestData failed:', err);
          return this.errorHandlingService.handleError(err);
        })
      );
  }

  /**
   * Deletes guest data and removes the Guest ID cookie.
   * @returns An Observable of void.
   */
  deleteGuestData(): Observable<void> {
    console.log('[AuthService] deleteGuestData called.');
    const url = `${this.baseUrl}/deleteGuestData`;
    return this.http
      .post<void>(url, {}, { withCredentials: true })
      .pipe(
        tap(() => console.log('[AuthService] deleteGuestData successful.')),
        catchError((err) => {
          console.error('[AuthService] deleteGuestData failed:', err);
          return this.errorHandlingService.handleError(err);
        })
      );
  }

  /**
   * Deletes guest data for a registered user.
   * @returns An Observable of void.
   */
  deleteGuestDataForRegisteredUser(): Observable<void> {
    console.log('[AuthService] deleteGuestDataForRegisteredUser called.');
    const url = `${this.baseUrl}/deleteGuestDataForRegisteredUser`;
    return this.http
      .post<void>(url, {}, { withCredentials: true })
      .pipe(
        tap(() => console.log('[AuthService] deleteGuestDataForRegisteredUser successful.')),
        catchError((err) => {
          console.error('[AuthService] deleteGuestDataForRegisteredUser failed:', err);
          return this.errorHandlingService.handleError(err);
        })
      );
  }
}
