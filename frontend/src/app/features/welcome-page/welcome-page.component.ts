import { Component } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-welcome-page',
    imports: [],
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
  constructor (
    public auth0: Auth0Service,
    public authService : AuthService,
    private router: Router
  ){}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  login() {
    this.auth0.loginWithRedirect();
  }

  continueAsGuest() {
    this.authService.generateGuestId().subscribe({
      next: (response) => {
        console.log('Guest session initiated:', response);  
        if (response) {
        this.goToDashboard()
        }
        
      },
      error: (error) => {
        console.error('Failed to initiate guest session:', error);
      },
    });
  }
}
