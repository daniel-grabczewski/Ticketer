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
}
