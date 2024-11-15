import { Component, Input, Output, EventEmitter } from '@angular/core';
import { X_SCALE_VALUE } from '@constants';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  TextInputSubmenuInput,
  TextInputSubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { XButtonComponent } from '../x-button/x-button.component';

@Component({
  selector: 'app-text-input-submenu',
  templateUrl: './text-input-submenu.component.html',
  styleUrls: ['./text-input-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, XButtonComponent],
})
export class TextInputSubmenuComponent implements TextInputSubmenuInput {
  // Inputs based on TextInputSubmenuInput
  @Input() title: string = '';
  @Input() textInputLabel: string = '';
  @Input() initialText: string = ''; // Optional initial text for prefill
  @Input() placeholder: string = '';
  @Input() buttonText: string = '';

  // Outputs
  @Output() menuAction = new EventEmitter<TextInputSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  // Component State
  textInputValue: string = '';
  xScale = X_SCALE_VALUE;

  ngOnInit() {
    // Initialize with initialText if provided
    this.textInputValue = this.initialText;
  }

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
