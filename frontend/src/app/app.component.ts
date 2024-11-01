import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GuestDataDialogComponent } from './shared/components/guest-data-dialog/guest-data-dialog.component';
import { MaterialSharedModule } from './shared/material/material.shared';
import { MatDialog } from '@angular/material/dialog';

// Import the new services
import { UserService } from './core/services/user.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MaterialSharedModule,
    CommonModule,
    GuestDataDialogComponent, // Include the dialog component
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  isGuest: boolean = false;

  constructor(
    public auth: Auth0Service,
    private dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService
  ) {
    // Subscribe to authentication status
    this.auth.isAuthenticated$.subscribe(async (isAuthenticated) => {
      if (isAuthenticated) {
        this.isGuest = false;

        try {
          // Check if user is registered
          const isRegisteredResponse = await firstValueFrom(
            this.userService.isRegistered()
          );
          const isRegistered = isRegisteredResponse.isRegistered;

          // Check if GuestId cookie exists
          const guestCookieExists = this.checkGuestCookie();

          console.log('IsRegistered response:', isRegisteredResponse);
          console.log('Guest cookie exists:', guestCookieExists);

          if (guestCookieExists) {
            // Check if there is guest data associated with the GuestId
            console.log('Calling hasGuestData endpoint...');
            const hasGuestDataResponse = await firstValueFrom(
              this.authService.hasGuestData()
            );
            console.log('HasGuestData response:', hasGuestDataResponse);
            const hasGuestData = hasGuestDataResponse.hasGuestData;

            if (!isRegistered && hasGuestData) {
              // Show dialog to transfer guest data
              console.log('Opening dialog...');
              this.openGuestDataDialog();
            } else if (isRegistered && hasGuestData) {
              // User is registered, delete guest data without prompting
              console.log('Deleting guest data...');
              await this.deleteGuestDataForRegisteredUser();
            } else {
              // No guest data to handle
              if (!isRegistered) {
                // Register the user
                console.log('Registering user with guest cookie');
                await this.registerUser();
              }
            }
          } else {
            // No GuestId cookie, but if user is not registered, register them
            if (!isRegistered) {
              console.log('Registering user without cookie');
              await this.registerUser();
            }
          }
        } catch (error) {
          console.error('Error during authentication handling:', error);
        }
      } else {
        // Check if GuestId cookie exists
        this.isGuest = this.checkGuestCookie();
      }
    });
  }

  // Method to trigger login
  login() {
    this.auth.loginWithRedirect();
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
    this.authService.generateGuestId().subscribe({
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
    return document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('GuestId='));
  }

  // Method to transfer guest data to Auth0 user
  async transferGuestData() {
    try {
      await firstValueFrom(this.authService.transferGuestData());
      console.log('Guest data transferred successfully.');
      this.isGuest = false;
    } catch (error) {
      console.error('Failed to transfer guest data:', error);
    }
  }

  // Method to delete guest data and remove GuestId cookie
  async deleteGuestData() {
    try {
      await firstValueFrom(this.authService.deleteGuestData());
      console.log('Guest data deleted successfully.');
      this.isGuest = false;
    } catch (error) {
      console.error('Failed to delete guest data:', error);
    }
  }

  // Method to delete the GuestId cookie
  deleteGuestCookie() {
    document.cookie =
      'GuestId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  // Method to open the guest data transfer dialog
  openGuestDataDialog() {
    const dialogRef = this.dialog.open(GuestDataDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        // User chose to transfer data
        await this.transferGuestData();
      } else {
        // User chose not to transfer data
        await this.deleteGuestData();
      }

      // Register the user after handling guest data
      await this.registerUser();
    });
  }

  // Method to register the user
  async registerUser() {
    try {
      await firstValueFrom(this.userService.registerUser());
      console.log('User registered successfully.');
    } catch (error) {
      console.error('Failed to register user:', error);
    }
  }

  // Method to delete guest data for a registered user
  async deleteGuestDataForRegisteredUser() {
    try {
      await firstValueFrom(this.authService.deleteGuestDataForRegisteredUser());
      console.log('Guest data deleted for registered user.');
      this.isGuest = false;
    } catch (error) {
      console.error('Failed to delete guest data for registered user:', error);
    }
  }
}
