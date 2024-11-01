import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Import interfaces from the shared models
import { GetColorsResponse } from '../../shared/models/color.model';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private baseUrl = `${environment.baseURL}/colors`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  /**
   * Retrieves all colors.
   * @returns An Observable of an array of GetColorsResponse.
   */
  getAllColors(): Observable<GetColorsResponse[]> {
    return this.http
      .get<GetColorsResponse[]>(this.baseUrl)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Retrieves the HEX code of a color by its ID.
   * @param colorId The ID of the color.
   * @returns An Observable of string representing the HEX code.
   */
  getColorHexById(colorId: string): Observable<string> {
    const url = `${this.baseUrl}/${colorId}`;
    return this.http
      .get<string>(url)
      .pipe(catchError(this.errorHandlingService.handleError));
  }
}
