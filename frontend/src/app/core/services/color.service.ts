import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

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
    // Try to retrieve the colors from localStorage
    const colors = localStorage.getItem('colors');

    if (colors) {
      console.log('Accessing color cache');
      try {
        // If colors are found in localStorage, parse and return them as an Observable
        const parsedColors: GetColorsResponse[] = JSON.parse(colors);
        return of(parsedColors); // Return the cached value wrapped in an Observable
      } catch (e) {
        // Handle invalid JSON or parsing errors
        console.error('Error parsing cached colors:', e);
      }
    }

    console.log('Requesting colors from DB');

    // If no cached value, make an HTTP request to fetch colors
    return this.http.get<GetColorsResponse[]>(this.baseUrl).pipe(
      tap((response: GetColorsResponse[]) => {
        // Cache the response in localStorage when the request is successful
        localStorage.setItem('colors', JSON.stringify(response));
      }),
      catchError(this.errorHandlingService.handleError) // Handle errors as usual
    );
  }

  /**
   * Retrieves the HEX code of a color by its ID.
   * @param colorId The ID of the color.
   * @returns An Observable of string representing the HEX code.
   */
  getColorHexById(colorId: string): Observable<string> {
    // Check if colors are cached
    const colors = localStorage.getItem('colors');

    if (colors) {
      try {
        const parsedColors: GetColorsResponse[] = JSON.parse(colors);
        // Try to find the color by ID in the cache
        const color = parsedColors.find((c) => c.id === +colorId);
        if (color) {
          // Return the color hex code from cache
          return of(color.hexCode);
        }
      } catch (e) {
        console.error('Error parsing cached colors:', e);
      }
    }

    // If the color is not found in the cache, proceed with the request
    // First, make sure the cache is populated by calling getAllColors(), and then proceed
    return this.getAllColors().pipe(
      switchMap((allColors: GetColorsResponse[]) => {
        // Find the color by ID from the fresh data
        const color = allColors.find((c) => c.id === +colorId);
        if (color) {
          // Return the color hex code if found
          return of(color.hexCode);
        }

        // If color is not found, make the API call to getColorByHex (fallback)
        const url = `${this.baseUrl}/${colorId}`;
        return this.http
          .get<string>(url)
          .pipe(catchError(this.errorHandlingService.handleError));
      })
    );
  }
}
