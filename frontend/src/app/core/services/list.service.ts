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
}
