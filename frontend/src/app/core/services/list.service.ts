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
   * By default, the position of the duplicated list will be to the right of the original list. So it will shift all other lists to the right of it. If the original list is at position 3, the duplicated list will be at position 4. So all the following lists will be shifted.
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
   * By default, the position of the list will be the highest, making it the furthest on the right
   * (where 1 is the first list on the left, and each incrementing number is to the right)
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

  /**
   * Changes the position of a list.
   * This will update the relevant surrounding lists' positions in the backend.
   * @param request The request object containing the list ID and new position.
   * @returns An Observable of void.
   */
  updateListPosition(request: UpdateListPositionRequest): Observable<void> {
    const url = `${this.baseUrl}/changePosition`;
    return this.http
      .put<void>(url, request)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Deletes a list by its ID.
   * This will update the relevant surrounding lists' positions in the backend.
   * @param listId The ID of the list to delete.
   * @returns An Observable of void.
   */
  deleteList(listId: string): Observable<void> {
    const url = `${this.baseUrl}/${listId}`;
    return this.http
      .delete<void>(url)
      .pipe(catchError(this.errorHandlingService.handleError));
  }
}
