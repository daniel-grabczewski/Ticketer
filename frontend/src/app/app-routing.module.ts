import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard-page/dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { authGuardFn } from '@auth0/auth0-angular';
import { BackgroundSelectionPanelComponent } from './shared/components/background-selection-panel/background-selection-panel.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent }, // Public route
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
  {
    path: 'test',
    component: BackgroundSelectionPanelComponent,
    // Guard removed to allow guest access
  },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
