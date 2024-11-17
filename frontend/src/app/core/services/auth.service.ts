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
    // Keep the BehaviorSubject and localStorage synced with Auth0's authentication status
    this.auth0.isAuthenticated$
      .pipe(distinctUntilChanged())
      .subscribe((isAuthenticated) => {
        this.updateAuthenticationStatus(isAuthenticated);
      });
  }

  /**
   * Updates authentication status in BehaviorSubject and localStorage.
   * @param isAuthenticated - The current authentication status from Auth0.
   */
  private updateAuthenticationStatus(isAuthenticated: boolean) {
    // Only update if there's a difference
    const currentStatus = this.isAuthenticatedSubject.value;
    if (currentStatus !== isAuthenticated) {
      this.isAuthenticatedSubject.next(isAuthenticated);
      localStorage.setItem(this.authKey, JSON.stringify(isAuthenticated));
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
