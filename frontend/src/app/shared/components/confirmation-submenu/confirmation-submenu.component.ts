import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConfirmationSubmenuInput,
  ConfirmationSubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { XButtonComponent } from '../x-button/x-button.component';
import { X_SCALE_VALUE } from '@constants';

@Component({
  selector: 'app-confirmation-submenu',
  templateUrl: './confirmation-submenu.component.html',
  styleUrls: ['./confirmation-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, XButtonComponent],
})
export class ConfirmationSubmenuComponent implements ConfirmationSubmenuInput {
  // Inputs matching ConfirmationSubmenuInput
  @Input() title: string = '';
  @Input() confirmationMessage: string = '';
  @Input() buttonText: string = '';

  // Outputs for ConfirmationSubmenuOutput
  @Output() menuAction = new EventEmitter<ConfirmationSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  xScale = X_SCALE_VALUE;

  // Handle action button click
  onActionClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({
      confirmationStatus: true,
    });
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
