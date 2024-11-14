import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.baseURL}/users`;
  private readonly registrationKey = 'isRegistered';
  private isRegisteredSubject = new BehaviorSubject<boolean>(
    this.getCachedIsRegistered()
  );

  // Public observable for components to subscribe to
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
    return this.http
      .get<string>(this.baseUrl)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Checks if the user is registered.
   * @returns An Observable of boolean indicating registration status.
   */
  isRegistered(): Observable<boolean> {
    const cachedValue = this.getCachedIsRegistered();
    if (cachedValue !== null) {
      this.isRegisteredSubject.next(cachedValue);
    }

    // Perform background HTTP check to validate isRegistered status from the backend
    const url = `${this.baseUrl}/isRegistered`;
    this.http
      .get<{ isRegistered: boolean }>(url, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (response.isRegistered !== cachedValue) {
            localStorage.setItem(
              this.registrationKey,
              JSON.stringify(response.isRegistered)
            );
            this.isRegisteredSubject.next(response.isRegistered);
          }
        }),
        catchError(this.errorHandlingService.handleError)
      )
      .subscribe();

    return this.isRegistered$;
  }

  /**
   * Retrieves the cached isRegistered value from localStorage.
   * Returns false if no value is found.
   */
  private getCachedIsRegistered(): boolean {
    const cached = localStorage.getItem(this.registrationKey);
    return cached !== null ? JSON.parse(cached) : false;
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
