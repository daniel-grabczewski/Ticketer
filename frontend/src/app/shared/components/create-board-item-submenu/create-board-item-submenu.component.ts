import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CreateBoardItemSubmenuInput,
  CreateBoardItemSubmenuOutput,
} from '../../models/submenuInputOutput.model';

@Component({
  selector: 'app-create-board-item-submenu',
  templateUrl: './create-board-item-submenu.component.html',
  styleUrls: ['./create-board-item-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateBoardItemSubmenuComponent {
  // Inputs based on CreateBoardItemSubmenuInput
  @Input() placeholder: string = '';
  @Input() buttonText: string = '';

  // Outputs
  @Output() menuAction = new EventEmitter<CreateBoardItemSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  // Component State
  textInputValue: string = '';

  // Handle action button click
  onActionClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({ text: this.textInputValue });
    // Close the submenu
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
