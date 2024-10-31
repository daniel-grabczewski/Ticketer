import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BackgroundSelectionPanelComponent } from '../background-selection-panel/background-selection-panel.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generate-board-submenu',
  templateUrl: './generate-board-submenu.component.html',
  styleUrls: ['./generate-board-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BackgroundSelectionPanelComponent],
})
export class GenerateBoardSubmenuComponent {
  // Inputs
  @Input() title: string = '';
  @Input() textInputHeader: string = '';
  @Input() colorSelectionHeader: string = '';
  @Input() buttonText: string = '';
  @Input() selectedColorId: number | null = null;

  // Outputs
  @Output() menuAction = new EventEmitter<{
    type: string;
    value: { name: string; color: number | null };
  }>();
  @Output() close = new EventEmitter<void>();
  //! ADDITIONAL OUTPUT TO RELEVANT COMPONENTS ADD IN FIGMA

  // Component State
  nameInput: string = '';
  colorId: number | null = null;

  // Handle color selection from the child component
  onColorSelected(colorId: number | null) {
    this.colorId = colorId;
  }

  // Handle create button click
  onCreateClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({
      type: 'generate-board-submenu',
      value: {
        name: this.nameInput,
        color: this.colorId,
      },
    });
    // Close the submenu
    this.close.emit();
  }

  // Handle quit button click
  onQuitClicked() {
    this.close.emit();
  }
}
