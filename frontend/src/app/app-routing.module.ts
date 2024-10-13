import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { authGuardFn } from '@auth0/auth0-angular';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Public route
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuardFn], // Protected route
  },
  {
    path: 'project',
    component: ProjectComponent,
    // Remove or adjust the guard to allow guest access
    // canActivate: [authGuardFn], // Comment out or remove
  },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
