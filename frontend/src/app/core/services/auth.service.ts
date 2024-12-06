import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { catchError, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.baseURL}/auth`;
  private readonly authKey = 'isAuthenticated';
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.getCachedIsAuthenticated()
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth0: Auth0Service,
    private errorHandlingService: ErrorHandlingService
  ) {
    // Check for GuestId cookie at startup
    const guestCookieExists = document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('GuestId='));
  
    // If guest cookie exists and we're not authenticated yet, set as authenticated
    if (guestCookieExists && !this.isAuthenticatedSubject.value) {
      this.updateAuthenticationStatus(true);
      console.log('[AuthService] GuestId cookie found at startup. Setting isAuthenticated to true.');
    }
  
    // Keep BehaviorSubject and localStorage synced with Auth0's authentication status
    this.auth0.isAuthenticated$
  .pipe(distinctUntilChanged())
  .subscribe((auth0IsAuthenticated) => {
    console.log('[AuthService] Auth0 isAuthenticated$ changed:', auth0IsAuthenticated);

    const guestCookieExists = document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('GuestId='));

    // If Auth0 says authenticated is true, we always trust that and set isAuthenticated to true.
    if (auth0IsAuthenticated) {
      console.log('[AuthService] Auth0 says we are authenticated. Setting isAuthenticated = true.');
      this.updateAuthenticationStatus(true);
    } else {
      // Auth0 says false. If we have a guest cookie, we remain authenticated as a guest.
      // If no guest cookie, then we are not authenticated.
      if (guestCookieExists) {
        console.log('[AuthService] Auth0 is false, but we have a guest cookie. Keeping isAuthenticated = true (guest mode).');
        // Do not call updateAuthenticationStatus(false) here, just do nothing.
      } else {
        console.log('[AuthService] Auth0 is false and no guest cookie. Setting isAuthenticated = false.');
        this.updateAuthenticationStatus(false);
      }
    }
  });
  }
  

  public setGuestAuthenticated(): void {
    console.log('[AuthService] setGuestAuthenticated called.');
    this.updateAuthenticationStatus(true);
  }



  /**
   * Updates authentication status in BehaviorSubject and localStorage.
   * @param isAuthenticated - The current authentication status from Auth0.
   */
  private updateAuthenticationStatus(isAuthenticated: boolean) {
    const currentStatus = this.isAuthenticatedSubject.value;
    if (currentStatus !== isAuthenticated) {
      console.log('[AuthService] Updating isAuthenticated from', currentStatus, 'to', isAuthenticated);
      this.isAuthenticatedSubject.next(isAuthenticated);
      localStorage.setItem(this.authKey, JSON.stringify(isAuthenticated));
    } else {
      console.log('[AuthService] updateAuthenticationStatus called but status unchanged:', isAuthenticated);
    }
  }

  /**
   * Retrieves the cached isAuthenticated value from localStorage.
   * Returns false if no value is found.
   */
  private getCachedIsAuthenticated(): boolean {
    const cached = localStorage.getItem(this.authKey);
    return cached !== null ? JSON.parse(cached) : false;
  }

  // Guest data related methods:

  /**
   * Generates a Guest ID and sets the cookie.
   * @returns An Observable of any (adjust based on backend response if necessary).
   */
  generateGuestId(): Observable<any> {
    this.updateAuthenticationStatus(true)
    const url = `${this.baseUrl}/generateGuestId`;
    return this.http
      .get<any>(url, { withCredentials: true })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Checks if there is guest data associated with the Guest ID.
   * @returns An Observable of { hasGuestData: boolean }.
   */
  hasGuestData(): Observable<{ hasGuestData: boolean }> {
    const url = `${this.baseUrl}/hasGuestData`;
    return this.http
      .get<{ hasGuestData: boolean }>(url, { withCredentials: true })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Transfers guest data to the authenticated user.
   * @returns An Observable of void.
   */
  transferGuestData(): Observable<void> {
    const url = `${this.baseUrl}/transferGuestData`;
    return this.http
      .post<void>(url, {}, { withCredentials: true })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Deletes guest data and removes the Guest ID cookie.
   * @returns An Observable of void.
   */
  deleteGuestData(): Observable<void> {
    const url = `${this.baseUrl}/deleteGuestData`;
    return this.http
      .post<void>(url, {}, { withCredentials: true })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Deletes guest data for a registered user.
   * @returns An Observable of void.
   */
  deleteGuestDataForRegisteredUser(): Observable<void> {
    const url = `${this.baseUrl}/deleteGuestDataForRegisteredUser`;
    return this.http
      .post<void>(url, {}, { withCredentials: true })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
}
