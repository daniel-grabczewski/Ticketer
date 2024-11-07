import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  standalone: true,
})
export class HamburgerButtonComponent {
  @Input() scale: number = 1; // Default scale
  @Input() color: string = 'var(--secondary-darker)'; // Default color
  @Input() hoverColor: string = 'var(--primary)'; // Default hover color

  // Original dimensions from the SVG
  private readonly originalWidth = 50;
  private readonly originalHeight = 38;

  // Calculate scaled width and height for the SVG
  getWidth(): number {
    return this.scale * 16;
  }

  getHeight(): number {
    return (this.scale * 16 * this.originalHeight) / this.originalWidth;
  }
}
