import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CreateBoardItemSubmenuInput,
  CreateBoardItemSubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { X_SCALE_VALUE } from '@constants';
import { XButtonComponent } from '../x-button/x-button.component';

@Component({
  selector: 'app-create-board-item-submenu',
  templateUrl: './create-board-item-submenu.component.html',
  styleUrls: ['./create-board-item-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, XButtonComponent],
})
export class CreateBoardItemSubmenuComponent {
  // Inputs based on CreateBoardItemSubmenuInput
  @Input() placeholder: string = '';
  @Input() buttonText: string = '';

  // Outputs
  @Output() menuAction = new EventEmitter<CreateBoardItemSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  xScale = X_SCALE_VALUE;
  // Component State
  textInputValue: string = '';
  xColor: string = 'var(--neutral-lighter)';
  xHoverColor: string = 'var(--error)';

  // Handle action button click
  onActionClicked() {
    // Emit the menu action with the specified structure

    // If ticket name is empty, do not emit value
    if (this.textInputValue === '') {
      this.close.emit();
    } else {
      this.menuAction.emit({ text: this.textInputValue });
      // Close the submenu
      this.close.emit();
    }
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
