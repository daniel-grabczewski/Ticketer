import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard-page/dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { authGuardFn } from '@auth0/auth0-angular';
import { MenuComponent } from './shared/components/menu/menu.component';
import { WelcomePageComponent } from './features/welcome-page/welcome-page.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent }, // Public route
  { path: 'welcome', component: WelcomePageComponent }, // Public route
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
    path: 'board/:boardId/:boardNameSlug',
    loadComponent: () =>
      import('./features/board-page/board/board.component').then(
        (m) => m.BoardComponent
      ),
    children: [
      {
        path: 'ticket/:ticketId',
        loadComponent: () =>
          import(
            './features/board-page/components/ticket-detailed-view/ticket-detailed-view.component'
          ).then((m) => m.TicketDetailedViewComponent),
      },
    ],
  },
  {
    path: 'board/:boardId',
    loadComponent: () =>
      import('./features/board-page/board/board.component').then(
        (m) => m.BoardComponent
      ),
    children: [
      {
        path: 'ticket/:ticketId',
        loadComponent: () =>
          import(
            './features/board-page/components/ticket-detailed-view/ticket-detailed-view.component'
          ).then((m) => m.TicketDetailedViewComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
