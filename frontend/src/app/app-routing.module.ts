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
    // Guard removed to allow guest access
  },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
