import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GuestDataDialogComponent } from './shared/components/guest-data-dialog/guest-data-dialog.component';
import { MaterialSharedModule } from './shared/material/material.shared';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './core/services/user.service';
import { AuthService } from './core/services/auth.service';
import { XButtonComponent } from './shared/components/x-button/x-button.component';
import { HamburgerButtonComponent } from './shared/components/hamburger-button/hamburger-button.component';
import { takeUntil } from 'rxjs/operators';
import { ColorService } from './core/services/color.service';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MaterialSharedModule,
        CommonModule,
        GuestDataDialogComponent,
        XButtonComponent,
        HamburgerButtonComponent,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'frontend';
  isGuest: boolean = false;
  isMobileMenuOpen: boolean = false;
  private destroy$ = new Subject<void>();
  isWelcomePage = false
  private routerSubscription!: Subscription

  constructor(
    public auth0: Auth0Service,
    private dialog: MatDialog,
    private userService: UserService,
    public authService: AuthService,
    public colorService : ColorService,
    private router: Router
  ) {
    // Subscribe to cached and real-time authentication status from AuthService

    this.authService.isAuthenticated$
    .pipe(takeUntil(this.destroy$))
    .subscribe(async (isAuthenticated) => {
      console.log('[app.component.ts] isAuthenticated$ changed:', isAuthenticated);
      const isAuth0Authenticated = await firstValueFrom(this.auth0.isAuthenticated$);
      console.log('[app.component.ts] Auth0 isAuthenticated$:', isAuth0Authenticated);
      const isGuestUser = isAuthenticated && !isAuth0Authenticated;
      const isAuth0User = isAuth0Authenticated; 

      console.log('[app.component.ts] Evaluating user type. isGuestUser:', isGuestUser, 'isAuth0User:', isAuth0User);
  
      if (isAuth0User) {
        this.isGuest = false;
        try {
          const isRegistered = await firstValueFrom(this.userService.isRegistered());
          const guestCookieExists = this.checkGuestCookie();
  
          console.log('isRegistered status:', isRegistered);
          console.log('Guest cookie exists:', guestCookieExists);
  
          if (guestCookieExists) {
            console.log('Calling hasGuestData endpoint...');
            const hasGuestDataResponse = await firstValueFrom(this.authService.hasGuestData());
            console.log('HasGuestData response:', hasGuestDataResponse);
            const hasGuestData = hasGuestDataResponse.hasGuestData;
  
            if (!isRegistered && hasGuestData) {
              console.log('Opening dialog...');
              this.openGuestDataDialog();
            } else if (isRegistered && hasGuestData) {
              console.log('Deleting guest data...');
              await this.deleteGuestDataForRegisteredUser();
            } else {
              if (!isRegistered) {
                console.log('Registering user with guest cookie');
                await this.registerUser();
              }
            }
          } else {
            if (!isRegistered) {
              console.log('Registering user without cookie');
              await this.registerUser();
            }
          }
        } catch (error) {
          console.error('Error during authentication handling:', error);
        }
      } else if (isGuestUser) {
        // The user is a guest. Do NOT try to register or transfer data here.
        // Just set this.isGuest = true and let them use the app.
        this.isGuest = true;
        console.log('[app.component.ts] Authenticated as guest user. No Auth0 token present.');
      } else {
        // Not authenticated at all
        this.isGuest = this.checkGuestCookie();
        console.log('[app.component.ts] Not authenticated. Guest status:', this.isGuest);
      }
    });
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isWelcomePage = event.urlAfterRedirects === '/welcome';
      }
    });
  
    this.colorService.getAllColors().subscribe({
      next: (colors) => console.log('Colors loaded and cached:', colors),
      error: (error) => console.error('Failed to load and cache colors:', error),
    });
  
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Method to trigger login
  login() {
    this.auth0.loginWithRedirect();
  }

  // Method to trigger logout
  logout() {
    // Delete the GuestId cookie if it exists
    if (this.checkGuestCookie()) {
      this.deleteGuestCookie();
      this.isGuest = false;
    }

    this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.routerSubscription.unsubscribe()
  }
}
