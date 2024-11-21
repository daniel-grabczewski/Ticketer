import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cog-button',
  templateUrl: './cog-button.component.html',
  styleUrls: ['./cog-button.component.scss'],
  standalone: true,
})
export class CogButtonComponent {
  @Input() scale: number = 1; // Default scale
  @Input() color: string = 'var(--secondary)'; // Default color
  @Input() hoverColor: string = 'var(--secondary-darker)'; // Default hover color
}
