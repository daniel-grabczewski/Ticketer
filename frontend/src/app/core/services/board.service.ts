import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Import interfaces from the shared models
import {
  GetAllBoardsDetailsResponse,
  GetBoardFullDetailsResponse,
  CreateDuplicateBoardRequest,
  CreateBoardRequest,
  UpdateBoardRequest,
} from '../../shared/models/board.model';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private baseUrl = `${environment.baseURL}/boards`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  /**
   * Retrieves all boards created by the user.
   * @returns An Observable of an array of GetAllBoardsDetailsResponse.
   */
  getAllBoards(): Observable<GetAllBoardsDetailsResponse[]> {
    return this.http
      .get<GetAllBoardsDetailsResponse[]>(this.baseUrl)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Retrieves full details of a board by its ID.
   * @param boardId The ID of the board.
   * @returns An Observable of GetBoardFullDetailsResponse.
   */
  getBoardById(boardId: string): Observable<GetBoardFullDetailsResponse> {
    const url = `${this.baseUrl}/${boardId}`;
    return this.http
      .get<GetBoardFullDetailsResponse>(url)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Creates a new board.
   * After receiving success status, navigate to /board/{board-id}/{board-name-slug}.
   * The navigation should be handled in the component subscribing to this method.
   * @param request The request object containing board details.
   * @returns An Observable of void
   */
  createBoard(request: CreateBoardRequest): Observable<void> {
    return this.http
      .post<void>(this.baseUrl, request)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Duplicates an existing board.
   * @param request The request object containing duplication details.
   * @returns An Observable of void
   */
  duplicateBoard(request: CreateDuplicateBoardRequest): Observable<void> {
    const url = `${this.baseUrl}/duplicate`;
    return this.http
      .post<void>(url, request)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Updates an existing board.
   * @param request The request object containing updated board details.
   * @returns An Observable of void
   */
  updateBoard(request: UpdateBoardRequest): Observable<void> {
    return this.http
      .put<void>(this.baseUrl, request)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Deletes a board.
   * @param request The board ID in the URL of the board to be deleted
   * @returns An Observable of void (adjust the type based on backend response if needed).
   */
  deleteBoard(boardId: string): Observable<void> {
    const url = `${this.baseUrl}/${boardId}`;
    return this.http
      .delete<void>(url)
      .pipe(catchError(this.errorHandlingService.handleError));
  }
}
