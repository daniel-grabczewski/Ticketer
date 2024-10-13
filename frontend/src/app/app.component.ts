import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';

// Import Angular Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatListModule,
    MatMenuModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
  isGuest: boolean = false;

  constructor(
    public auth: AuthService,
    private http: HttpClient
  ) {
    // Subscribe to authentication status
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.isGuest = false;
      } else {
        // Check if GuestId cookie exists
        this.isGuest = this.checkGuestCookie();
      }
    });
  }

  // Method to trigger login
  login() {
    if (this.isGuest) {
      const transferData = confirm('Do you want to transfer your data to your new account?');
      if (transferData) {
        // Transfer guest data before logging in
        this.transferGuestData().then(() => {
          this.auth.loginWithRedirect();
        });
      } else {
        // Delete guest data and proceed with login
        this.deleteGuestData().then(() => {
          this.auth.loginWithRedirect();
        });
      }
    } else {
      this.auth.loginWithRedirect();
    }
  }

  // Method to trigger logout
  logout() {
    // Delete the GuestId cookie if it exists
    if (this.checkGuestCookie()) {
      this.deleteGuestCookie();
      this.isGuest = false;
    }

    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  // Method to continue as guest
  continueAsGuest() {
    // Call the backend API to generate a GuestId and set the cookie
    this.http.get(`${environment.baseURL}/auth/generateGuestId`, { withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Guest session initiated:', response);
        this.isGuest = true;
        // Optionally, navigate to a specific route
      },
      error: (error) => {
        console.error('Failed to initiate guest session:', error);
      },
    });
  }

  // Method to check if GuestId cookie exists
  checkGuestCookie(): boolean {
    return document.cookie.split(';').some((item) => item.trim().startsWith('GuestId='));
  }

  // Method to transfer guest data to Auth0 user
  async transferGuestData() {
    try {
      await firstValueFrom(
        this.http.post(`${environment.baseURL}/auth/transferGuestData`, {}, { withCredentials: true })
      );
      console.log('Guest data transferred successfully.');
      this.isGuest = false;
    } catch (error) {
      console.error('Failed to transfer guest data:', error);
    }
  }

  // Method to delete guest data and remove GuestId cookie
  async deleteGuestData() {
    try {
      await firstValueFrom(
        this.http.post(`${environment.baseURL}/auth/deleteGuestData`, {}, { withCredentials: true })
      );
      console.log('Guest data deleted successfully.');
      this.isGuest = false;
    } catch (error) {
      console.error('Failed to delete guest data:', error);
    }
  }

  // Method to delete the GuestId cookie
  deleteGuestCookie() {
    document.cookie = 'GuestId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
