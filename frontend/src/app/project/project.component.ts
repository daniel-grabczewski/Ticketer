import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { UtilsService } from '../shared/utils.service';
UtilsService;

interface Ticket {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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

  // Function to delete a new ticket to the backend API
  deleteTicket(ticketId: number) {
    // Make a DELETE request to the backend API to delete a ticket, given its ID
    this.http.delete(`${environment.baseURL}/tickets/${ticketId}`).subscribe({
      next: (response) => {
        console.log(
          `Ticket with ID ${ticketId} delete successfully: `,
          response
        );
        this.getTickets();
      },
      error: (error) => {
        console.log(`Failed to delete ticket with ID ${ticketId}`, error);
      },
    });
  }

  // Function to submit a new ticket to the backend API
  submitTicket() {
    const now = new Date();

    const ticketData = {
      title: this.title,
      description: this.description,
      createdAt: now,
      updatedAt: now,
    };

    // Make a POST request to the backend API to create a new ticket
    this.http.post(`${environment.baseURL}/tickets`, ticketData).subscribe({
      next: (response) => {
        console.log('Ticket added successfully: ', response);
        this.getTickets();
      },
      error: (error) => {
        console.log('Failed to add ticket: ', error);
      },
    });
  }

  // Function to fetch all tickets from the backend API
  getTickets() {
    this.http.get<Ticket[]>(`${environment.baseURL}/tickets`).subscribe({
      next: (data) => {
        // Format the updatedAt field for each ticket
        this.tickets = data.map((ticket) => ({
          ...ticket,
          updatedAt: this.utilsService.formatDateTime(
            new Date(ticket.updatedAt)
          ), // Format updatedAt as needed
        }));
      },
      error: (error) => {
        console.log('An error occurred while fetching data', error);
      },
    });
  }
}
