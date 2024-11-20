import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-plus-button',
  templateUrl: './plus-button.component.html',
  styleUrls: ['./plus-button.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PlusButtonComponent {
  @Input() scale: number = 1; // Default scale
  @Input() color: string = 'var(--secondary)'; // Default color
  @Input() hoverColor: string = 'var(--primary)'; // Default hover color
  @Input() label?: string;
  @Input() isFullWidth?: boolean = false;
  @Input() height?: string = '';

  getStrokeWidth(): number {
    return 5 * Math.sqrt(this.scale); // Adjust the scaling factor as needed
  }
}
