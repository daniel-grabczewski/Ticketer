import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropdownSubmenuInput,
  DropdownSubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { XButtonComponent } from '../x-button/x-button.component';
import { X_SCALE_VALUE } from '@constants';

@Component({
  selector: 'app-dropdown-submenu',
  templateUrl: './dropdown-submenu.component.html',
  styleUrls: ['./dropdown-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, XButtonComponent],
})
export class DropdownSubmenuComponent implements DropdownSubmenuInput {
  // Inputs matching DropdownSubmenuInput
  @Input() title: string = '';
  @Input() dropdownInputLabel: string = '';
  @Input() dropdownItems: Array<{ id: string; name: string }> = [];
  @Input() dropdownPlaceholder: string = '';
  @Input() buttonText: string = '';

  // Outputs for DropdownSubmenuOutput
  @Output() menuAction = new EventEmitter<DropdownSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  xScale = X_SCALE_VALUE;

  // Component State
  selectedOption: { id: string; name: string } | null = null;

  // Handle action button click
  onActionClicked() {
    if (this.selectedOption) {
      // Emit the menu action with the specified structure
      this.menuAction.emit(this.selectedOption);
    }
    // Close the submenu
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
