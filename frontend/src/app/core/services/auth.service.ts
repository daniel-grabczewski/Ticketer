import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.baseURL}/auth`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  /**
   * Generates a Guest ID and sets the cookie.
   * @returns An Observable of any (adjust based on backend response if necessary).
   */
  generateGuestId(): Observable<any> {
    const url = `${this.baseUrl}/generateGuestId`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Checks if there is guest data associated with the Guest ID.
   * @returns An Observable of { hasGuestData: boolean }.
   */
  hasGuestData(): Observable<{ hasGuestData: boolean }> {
    const url = `${this.baseUrl}/hasGuestData`;
    return this.http
      .get<{ hasGuestData: boolean }>(url)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Transfers guest data to the authenticated user.
   * @returns An Observable of void.
   */
  transferGuestData(): Observable<void> {
    const url = `${this.baseUrl}/transferGuestData`;
    return this.http
      .post<void>(url, {})
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Deletes guest data and removes the Guest ID cookie.
   * @returns An Observable of void.
   */
  deleteGuestData(): Observable<void> {
    const url = `${this.baseUrl}/deleteGuestData`;
    return this.http
      .post<void>(url, {})
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Deletes guest data for a registered user.
   * @returns An Observable of void.
   */
  deleteGuestDataForRegisteredUser(): Observable<void> {
    const url = `${this.baseUrl}/deleteGuestDataForRegisteredUser`;
    return this.http
      .post<void>(url, {})
      .pipe(catchError(this.errorHandlingService.handleError));
  }
}
