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
}
