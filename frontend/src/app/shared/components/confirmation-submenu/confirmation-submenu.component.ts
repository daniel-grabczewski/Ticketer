import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-submenu',
  templateUrl: './confirmation-submenu.component.html',
  styleUrls: ['./confirmation-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ConfirmationSubmenuComponent {
  // Inputs
  @Input() title: string = '';
  @Input() confirmationMessage: string = '';
  @Input() buttonText: string = '';

  // Outputs
  @Output() menuAction = new EventEmitter<{ type: string; value: boolean }>();
  @Output() close = new EventEmitter<void>();

  // Handle action button click
  onActionClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({
      type: 'confirmation-submenu',
      value: true,
    });
    // Close the submenu
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
