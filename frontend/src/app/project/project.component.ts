import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  /*
    Imports in the imports array: These are Angular modules that provide directives, components, or pipes used in the HTML template (like ngIf, ngFor, ngModel, etc.). They need to be in the imports array because they affect the view layer directly.

    Things not in the imports array (e.g., HttpClient): These are typically services that are not directly connected to the HTML. Instead, they provide functionality (like HTTP requests) to the TypeScript logic of the component. They are injected via the constructor and do not require inclusion in imports: [].
  */

  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  /*
    - The 'implements' keyword tells TypeScript that this class must use implement the members defined in the interface (methods & properties)
    - In this class, the only method inside the OnInit class is ngOnInit(), so as long as this class implement the method, TypeScript will be happy.
    - If this class implement use the ngOnInit() function, then TypeScript will throw an error.
  */

  description: string = '';
  tickets: Ticket[] = [];

  constructor(private http: HttpClient) {}
  /*
   Dependency Injection of HttpClient
   Why not just do `private http = HttpClient`?
      - Because that would just reference the HttpClient class itself, not an instance of it
      - By using the constructor, Angular injects a ready-to-use instance of HttpClient automatically
      - Long story short : This is how Angular was designed to handle dependencies—via the constructor, which allows Angular to provide and manage instances of services like HttpClient.
  */

  ngOnInit(): void {
    this.getTickets(); // Fetch tickets when the component is initialized
  }
  /* 
    - 'ngOnInit' is just a reserved name for a function that has a special meaning to Angular (it recognizes it as a 'lifecycle hook')
    - (All hooks in Angular are 'lifecycle methods', methods that run at specific part of a component's life cycle) e.g.
      - When a component is created 'ngOnInit()'
      - When a component is destroyed 'ngOnDestroy()'
    - 'ngOnInit' doesn't actually do anything on its own. You choose what it does in a component class.
    - Whenever a component is created, Angular looks for a function called 'ngOnInit', and runs whatever is inside of it.
  */

  // Function to submit a new ticket to the backend API
  submitTicket() {
    // Hardcoded ticket data for simplicity
    const ticketData = {
      title: 'Hardcoded Title',
      description: this.description,
      createdAt: '2023-01-01T00:00:00',
      updatedAt: '2023-01-01T00:00:00',
    };

    // Make a POST request to the backend API to create a new ticket
    this.http.post('/api/tickets', ticketData).subscribe({
      next: (response) => {
        console.log('Ticket added successfully: ', response);
        this.getTickets();
      },
      error: (error) => {
        console.log('Failed to add ticket: ', error);
      },
    });
    /*
      .subscribe always listens to an observable object, which either will emit values (response) or an errors (error) and can take two types of paramters:
        - 1: A function. When given a function, .subscribe performs the function with the assumption that there was no error.
          That is, it will have no error catching. E.g. .subscribe((response) => {do stuff}). It always expects a response

        - 2: An object. When given an object, it will have reserved key names (next, error, complete). Each key will have its own function, where it has access to the emitted values/errors from the observable
          'Next' handles what happens upon a value being emmited from the observable
          'Error' handles what happens upon an error from the observable (an error is returned instead of a value)
          'Complete' handles what happens after the request is complete
          E.g. {next : (response) => {do stuff}, error : (response) => {do stuff}, complete : (response) => {do stuff}}
          All of these keys are optional. Technically, you could provide .subscribe with an empty object, {}. Although not functional, it still wouldn't cause an error

          What happens in any of these functions is up to us. There is no requirement to use the response object at all.
          Both of these wouldn't throw any error : 
          .subscribe({next : () => {console.log('hello')}})
          .subscribe(() => {console.log('hello)})

          If an error is emmited from the observable, then the observable terminates. And so subscribe() won't do anything.

    */
  }

  // Function to fetch all tickets from the backend API
  getTickets() {
    // Make a GET request to the backend API to retrieve all tickets
    this.http.get<Ticket[]>('/api/tickets').subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (error) => {
        console.log('An error occurred while fetching data', error);
      },
    });
  }
}
