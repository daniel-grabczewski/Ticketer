import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';

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
   * Retrieves username of the logged in user
   * @returns An Observable of string.
   */
  getUsername(): Observable<string> {
    return this.http
      .get<string>(this.baseUrl, {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
}
