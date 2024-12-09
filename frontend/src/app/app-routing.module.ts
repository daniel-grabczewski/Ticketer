import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard-page/dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { WelcomePageComponent } from './features/welcome-page/welcome-page.component';
import { myAuthGuardFn } from './my-auth.guard';
import { TempLoginPageComponent } from './features/temp-login-page/temp-login-page.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent,  canActivate: [myAuthGuardFn]}, // Public route
  { path: 'welcome', component: WelcomePageComponent, canActivate: [myAuthGuardFn] }, // Public route
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [myAuthGuardFn], // Protected route
  },
  {
    path: 'temp-login',
    component: TempLoginPageComponent,
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
    canActivate: [myAuthGuardFn],
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
    canActivate: [myAuthGuardFn],
  },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
