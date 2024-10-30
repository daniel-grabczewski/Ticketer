import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.baseURL}/users`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  /**
   * Retrieves the username of the logged-in user.
   * @returns An Observable of string.
   */
  getUsername(): Observable<string> {
    return this.http
      .get<string>(this.baseUrl)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Checks if the user is registered.
   * @returns An Observable of { isRegistered: boolean }.
   */
  isRegistered(): Observable<{ isRegistered: boolean }> {
    const url = `${this.baseUrl}/isRegistered`;
    return this.http
      .get<{ isRegistered: boolean }>(url)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Registers a new user.
   * @returns An Observable of void.
   */
  registerUser(): Observable<void> {
    const url = `${this.baseUrl}/register`;
    return this.http
      .post<void>(url, {})
      .pipe(catchError(this.errorHandlingService.handleError));
  }
}
