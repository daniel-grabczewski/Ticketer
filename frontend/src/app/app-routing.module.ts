import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard-page/dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { authGuardFn } from '@auth0/auth0-angular';
import { MenuComponent } from './shared/components/menu/menu.component';
import { BoardComponent } from './features/board-page/board/board.component';
import { TicketDetailedViewComponent } from './features/board-page/components/ticket-detailed-view/ticket-detailed-view.component';

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
    component: MenuComponent,
    // Guard removed to allow guest access
  },
  {
    path: 'board/:boardId/:boardNameSlug',
    component: BoardComponent,
    children: [
      {
        path: 'ticket/:ticketId',
        component: TicketDetailedViewComponent,
      },
    ],
  },
  {
    path: 'board/:boardId',
    component: BoardComponent,
    children: [
      {
        path: 'ticket/:ticketId',
        component: TicketDetailedViewComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
