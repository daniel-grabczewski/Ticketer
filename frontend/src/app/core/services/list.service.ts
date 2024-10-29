import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Import interfaces from the shared models
import {
  GetAllListsDetailsResponse,
  CreateDuplicateListRequest,
  CreateListRequest,
  UpdateListRequest,
  UpdateListPositionRequest,
} from '../../shared/models/list.model';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private baseUrl = `${environment.baseURL}/lists`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  /**
   * Retrieves all lists within a board by board ID.
   * The lists are ordered based on their position.
   * @param boardId The ID of the board.
   * @returns An Observable of an array of GetAllListsDetailsResponse.
   */
  getAllLists(boardId: string): Observable<GetAllListsDetailsResponse[]> {
    const url = `${this.baseUrl}/${boardId}`;
    return this.http
      .get<GetAllListsDetailsResponse[]>(url)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Duplicates an existing list.
   * @param request The request object containing duplication details.
   * @returns An Observable of void.
   */
  duplicateList(request: CreateDuplicateListRequest): Observable<void> {
    const url = `${this.baseUrl}/duplicate`;
    return this.http
      .post<void>(url, request)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Creates a new list.
   * @param request The request object containing list details.
   * @returns An Observable of void.
   */
  createList(request: CreateListRequest): Observable<void> {
    return this.http
      .post<void>(this.baseUrl, request)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Updates an existing list's name.
   * @param request The request object containing updated list details.
   * @returns An Observable of void.
   */
  updateList(request: UpdateListRequest): Observable<void> {
    return this.http
      .put<void>(this.baseUrl, request)
      .pipe(catchError(this.errorHandlingService.handleError));
  }
}
