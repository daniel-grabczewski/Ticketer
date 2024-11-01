import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BackgroundSelectionPanelComponent } from '../background-selection-panel/background-selection-panel.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  GenerateBoardSubmenuInput,
  GenerateBoardSubmenuOutput,
} from '../../models/submenuInputOutput.model';

@Component({
  selector: 'app-generate-board-submenu',
  templateUrl: './generate-board-submenu.component.html',
  styleUrls: ['./generate-board-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BackgroundSelectionPanelComponent],
})
export class GenerateBoardSubmenuComponent
  implements GenerateBoardSubmenuInput
{
  // Inputs
  @Input() title: string = '';
  @Input() textInputLabel: string = '';
  @Input() colorSelectionHeader: string = '';
  @Input() buttonText: string = '';
  @Input() colorId: number | null = null;
  @Input() initialText: string = ''; // Optional initial text for prefill
  @Input() placeholder: string = 'Enter name'; // Placeholder with default text

  // Outputs
  @Output() menuAction = new EventEmitter<GenerateBoardSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  // Component State
  nameInput: string = this.initialText;
  selectedColorId: number | null = this.colorId;

  // Handle color selection from the child component
  onColorSelected(colorId: number | null) {
    this.selectedColorId = colorId;
  }

  // Handle create button click
  onCreateClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({
      name: this.nameInput,
      colorId: this.selectedColorId,
    });
    this.close.emit();
  }

  // Handle quit button click
  onQuitClicked() {
    this.close.emit();
  }
}
