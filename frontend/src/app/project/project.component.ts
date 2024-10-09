import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { UtilsService } from '../shared/utils.service';

interface Ticket {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isEditing?: boolean;
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  description: string = '';
  title: string = '';
  tickets: Ticket[] = [];

  constructor(private http: HttpClient, private utilsService: UtilsService) {}
  ngOnInit(): void {
    this.getTickets(); // Fetch tickets when the component is initialized
  }

  // Toggle edit mode for a specific ticket
  toggleEditMode(ticket: Ticket) {
    ticket.isEditing = !ticket.isEditing;
  }

  // Save changes to the ticket (HTTP PUT request)
  updateTicket(ticket: Ticket) {
    const updatedTicket = {
      title: ticket.title,
      description: ticket.description,
      updatedAt: new Date(),
    };

    this.http
      .put(`${environment.baseURL}/tickets/${ticket.id}`, updatedTicket)
      .subscribe({
        next: (response) => {
          console.log('Ticket updated successfully:', response);
          ticket.isEditing = false; // Exit edit mode after saving
          this.getTickets(); // Refresh tickets list
        },
        error: (error) => {
          console.log('Failed to update ticket:', error);
        },
      });
  }

  deleteTicket(ticketId: number) {
    this.http.delete(`${environment.baseURL}/tickets/${ticketId}`).subscribe({
      next: (response) => {
        console.log(
          `Ticket with ID ${ticketId} deleted successfully:`,
          response
        );
        this.getTickets();
      },
      error: (error) => {
        console.log(`Failed to delete ticket with ID ${ticketId}`, error);
      },
    });
  }

  submitTicket() {
    const now = new Date();

    const ticketData = {
      title: this.title,
      description: this.description,
      createdAt: now,
      updatedAt: now,
    };

    this.http.post(`${environment.baseURL}/tickets`, ticketData).subscribe({
      next: (response) => {
        console.log('Ticket added successfully:', response);
        this.getTickets();
      },
      error: (error) => {
        console.log('Failed to add ticket:', error);
      },
    });
  }

  getTickets() {
    this.http.get<Ticket[]>(`${environment.baseURL}/tickets`).subscribe({
      next: (data) => {
        this.tickets = data.map((ticket) => ({
          ...ticket,
          updatedAt: this.utilsService.formatDateTime(
            new Date(ticket.updatedAt)
          ),
          isEditing: false, // Initialize edit mode to false
        }));
      },
      error: (error) => {
        console.log('An error occurred while fetching data', error);
      },
    });
  }
}
