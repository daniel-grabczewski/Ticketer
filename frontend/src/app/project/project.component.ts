import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'project',
    imports: [MatMenuModule, MatButtonModule, CommonModule],
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  showOverlay = false;

  handleMenuOpened() {
    this.showOverlay = true;
  }

  handleMenuClosed() {
    this.showOverlay = false;
  }

  handleAction() {
    console.log('Action button clicked');
  }
}
