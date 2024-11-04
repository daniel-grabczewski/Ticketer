import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard-page/dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { authGuardFn } from '@auth0/auth0-angular';
import { BackgroundSelectionPanelComponent } from './shared/components/background-selection-panel/background-selection-panel.component';
import { GenerateBoardSubmenuComponent } from './shared/components/generate-board-submenu/generate-board-submenu.component';
import { BackgroundSelectionSubmenuComponent } from './shared/components/background-selection-submenu/background-selection-submenu.component';
import { ConfirmationSubmenuComponent } from './shared/components/confirmation-submenu/confirmation-submenu.component';
import { TextInputSubmenuComponent } from './shared/components/text-input-submenu/text-input-submenu.component';
import { DropdownSubmenuComponent } from './shared/components/dropdown-submenu/dropdown-submenu.component';
import { ColorSelectionPanelComponent } from './shared/components/color-selection-panel/color-selection-panel.component';
import { ColorSelectionSubmenuComponent } from './shared/components/color-selection-submenu/color-selection-submenu.component';
import { CreateBoardItemSubmenuComponent } from './shared/components/create-board-item-submenu/create-board-item-submenu.component';
import { MenuComponent } from './shared/components/menu/menu.component';

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
    path: 'board',
    component: MenuComponent,
    // Guard removed to allow guest access
  },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
