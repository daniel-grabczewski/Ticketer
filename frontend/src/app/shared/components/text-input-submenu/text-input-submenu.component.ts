import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-input-submenu',
  templateUrl: './text-input-submenu.component.html',
  styleUrls: ['./text-input-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TextInputSubmenuComponent {
  // Inputs
  @Input() title: string = '';
  @Input() textInputHeader: string = '';
  @Input() placeholderText: string = '';
  @Input() buttonText: string = '';

  // Outputs
  @Output() menuAction = new EventEmitter<{ type: string; value: string }>();
  @Output() close = new EventEmitter<void>();

  // Component State
  textInputValue: string = '';

  // Handle action button click
  onActionClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({
      type: 'text-input-submenu',
      value: this.textInputValue,
    });
    // Close the submenu
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
