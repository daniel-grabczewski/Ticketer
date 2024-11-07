import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-x-button',
  templateUrl: './x-button.component.html',
  styleUrls: ['./x-button.component.scss'],
  standalone: true,
})
export class XButtonComponent {
  @Input() scale: number = 1; // Default scale
  @Input() color: string = 'var(--neutral-darker)'; // Default color
  @Input() hoverColor: string = 'var(--background-lighter)'; // Default hover color

  getStrokeWidth(): number {
    return 7.4 * Math.sqrt(this.scale); // Adjust the scale function as needed
  }
}
