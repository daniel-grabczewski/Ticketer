import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown-submenu',
  templateUrl: './dropdown-submenu.component.html',
  styleUrls: ['./dropdown-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DropdownSubmenuComponent {
  // Inputs
  @Input() title: string = '';
  @Input() dropdownInputHeader: string = '';
  @Input() dropdownOptions: Array<{ id: string; name: string }> = [];
  @Input() dropdownPlaceholderText: string = '';
  @Input() buttonText: string = '';

  // Outputs
  @Output() menuAction = new EventEmitter<{ type: string; value: { id: string; name: string } }>();
  @Output() close = new EventEmitter<void>();

  // Component State
  selectedOption: { id: string; name: string } | null = null;

  // Handle action button click
  onActionClicked() {
    if (this.selectedOption) {
      // Emit the menu action with the specified structure
      this.menuAction.emit({
        type: 'dropdown-submenu',
        value: this.selectedOption,
      });
    }
    // Close the submenu
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
