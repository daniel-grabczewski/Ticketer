import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-plus-button',
  templateUrl: './plus-button.component.html',
  styleUrls: ['./plus-button.component.scss'],
  standalone: true,
})
export class PlusButtonComponent {
  @Input() scale: number = 1; // Default scale
  @Input() color: string = 'var(--secondary)'; // Default color
  @Input() hoverColor: string = 'var(--primary)'; // Default hover color

  // Method to calculate stroke width based on scale
  getStrokeWidth(): number {
    return 7 * Math.sqrt(this.scale); // Adjust the scaling factor as needed
  }
}
