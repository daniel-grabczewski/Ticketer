import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.baseURL}/users`;
  private isRegisteredSubject = new BehaviorSubject<boolean>(false);
  isRegistered$ = this.isRegisteredSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  /**
   * Retrieves the username of the logged-in user.
   * @returns An Observable of string.
   */
  getUsername(): Observable<string> {
    console.log('[UserService] getUsername called.');
    return this.http.get<string>(this.baseUrl).pipe(
      tap(() => console.log('[UserService] getUsername successful.')),
      catchError((err) => {
        console.error('[UserService] getUsername failed:', err);
        return this.errorHandlingService.handleError(err);
      })
    );
  }

  /**
   * Checks if the user is registered by querying the backend directly.
   * @returns An Observable of boolean indicating registration status.
   */
  isRegistered(): Observable<boolean> {
    const url = `${this.baseUrl}/isRegistered`;
    return this.http
      .get<{ isRegistered: boolean }>(url, { withCredentials: true })
      .pipe(
        // Map the response to extract the boolean value
        map((response) => response.isRegistered),
        tap((isRegistered) => {
          this.isRegisteredSubject.next(isRegistered);
        }),
        catchError((err) => this.errorHandlingService.handleError(err))
      );
  }

  /**
   * Registers a new user.
   * @returns An Observable of void.
   */
  registerUser(): Observable<void> {
    const url = `${this.baseUrl}/register`;
    console.log('[UserService] registerUser called: sending POST to', url);
    return this.http.post<void>(url, {}).pipe(
      tap(() => console.log('[UserService] registerUser successful.')),
      catchError((err) => {
        console.error('[UserService] registerUser failed:', err);
        return this.errorHandlingService.handleError(err);
      })
    );
  }
}
