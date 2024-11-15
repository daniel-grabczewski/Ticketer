import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BackgroundSelectionPanelComponent } from '../background-selection-panel/background-selection-panel.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  GenerateBoardSubmenuInput,
  GenerateBoardSubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { XButtonComponent } from '../x-button/x-button.component';
import { X_SCALE_VALUE } from '@constants';

@Component({
  selector: 'app-generate-board-submenu',
  templateUrl: './generate-board-submenu.component.html',
  styleUrls: ['./generate-board-submenu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BackgroundSelectionPanelComponent,
    XButtonComponent,
  ],
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
  @Input() initialText: string = '';
  @Input() placeholder: string = 'Enter name';

  // Outputs
  @Output() menuAction = new EventEmitter<GenerateBoardSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  xScale = X_SCALE_VALUE;

  // Component State
  nameInput: string = '';
  selectedColorId: number | null = null;

  ngOnInit() {
    this.selectedColorId = this.colorId;
    this.nameInput = this.initialText;
  }

  // Handle color selection from the child component
  onColorSelected(colorId: number | null) {
    this.selectedColorId = colorId;
  }

  // Handle create button click
  onCreateClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({
      name: this.nameInput.trim(),
      colorId: this.selectedColorId,
    });
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
