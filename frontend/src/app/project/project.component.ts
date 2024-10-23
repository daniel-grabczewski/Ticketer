import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { UtilsService } from '../shared/utils.service';
import { AuthService } from '@auth0/auth0-angular';
import { MaterialSharedModule } from '../shared/material.shared';

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
  imports: [CommonModule, FormsModule, MaterialSharedModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  description: string = '';
  title: string = '';
  tickets: Ticket[] = [];

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    public auth: AuthService
  ) {}

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
      .put(`${environment.baseURL}/tickets/${ticket.id}`, updatedTicket, {
        withCredentials: true, // Include cookies in the request
      })
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
    this.http
      .delete(`${environment.baseURL}/tickets/${ticketId}`, {
        withCredentials: true, // Include cookies in the request
      })
      .subscribe({
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
    const ticketData = {
      title: this.title,
      description: this.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.http
      .post(`${environment.baseURL}/tickets`, ticketData, {
        withCredentials: true, // Include cookies in the request
      })
      .subscribe({
        next: (response) => {
          console.log('Ticket added successfully:', response);
          this.getTickets();
          // Reset the form fields
          this.title = '';
          this.description = '';
        },
        error: (error) => {
          console.log('Failed to add ticket:', error);
        },
      });
  }

  getTickets() {
    this.auth.getAccessTokenSilently().subscribe((token) => {
      console.log('Access Token:', token);
    });

    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('User is authenticated:', isAuthenticated);
    });

    this.http
      .get<Ticket[]>(`${environment.baseURL}/tickets`, {
        withCredentials: true, // Include cookies in the request
      })
      .subscribe({
        next: (data) => {
          this.tickets = data.map((ticket) => ({
            ...ticket,
            isEditing: false, // Initialize edit mode to false
          }));
        },
        error: (error) => {
          console.log('An error occurred while fetching data', error);
        },
      });
  }
}
