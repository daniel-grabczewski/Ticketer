import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TicketInput } from '../../shared/models/uniqueComponentInputOutput.model';

@Injectable({
  providedIn: 'root',
})
export class TicketUpdateService {
  private ticketUpdatedSource = new Subject<TicketInput>();

  // Observable stream
  ticketUpdated$ = this.ticketUpdatedSource.asObservable();

  // Method to emit updated ticket
  emitTicketUpdate(updatedTicket: TicketInput) {
    this.ticketUpdatedSource.next(updatedTicket);
  }
}
