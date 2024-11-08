import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'project',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, CommonModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  handleAction() {
    console.log('Action button clicked');
  }
}
