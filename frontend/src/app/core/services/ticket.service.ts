import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Import interfaces from the shared models
import {
  GetTicketDetailsResponse,
  CreateTicketRequest,
  UpdateTicketPositionRequest,
  UpdateTicketRequest,
} from '../../shared/models/ticket.model';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private baseUrl = `${environment.baseURL}/tickets`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  /**
   * Retrieves ticket details by ticket ID.
   * @param ticketId The ID of the ticket.
   * @returns An Observable of GetTicketDetailsResponse.
   */
  getTicketById(ticketId: string): Observable<GetTicketDetailsResponse> {
    const url = `${this.baseUrl}/${ticketId}`;
    return this.http
      .get<GetTicketDetailsResponse>(url)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Creates a new ticket.
   * @param request The request object containing ticket details.
   * @returns An Observable of void.
   */
  createTicket(request: CreateTicketRequest): Observable<void> {
    return this.http
      .post<void>(this.baseUrl, request)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  /**
   * Updates the position of a ticket.
   * If newPosition is not provided, the backend defaults it to 1.
   * @param request The request object containing ticket ID, list ID, and optional new position.
   * @returns An Observable of void.
   */
  updateTicketPosition(
    request: UpdateTicketPositionRequest
  ): Observable<void> {
    const url = `${this.baseUrl}/changePosition`;
    return this.http
      .put<void>(url, request)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

    /**
   * Updates an existing ticket.
   * @param request The request object containing updated ticket details.
   * @returns An Observable of void.
   */
    updateTicket(request: UpdateTicketRequest): Observable<void> {
      return this.http
        .put<void>(this.baseUrl, request)
        .pipe(catchError(this.errorHandlingService.handleError));
    }
}
