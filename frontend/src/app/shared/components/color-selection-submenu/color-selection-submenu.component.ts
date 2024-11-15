import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColorSelectionPanelComponent } from '../color-selection-panel/color-selection-panel.component';
import { CommonModule } from '@angular/common';
import {
  ColorSelectionSubmenuInput,
  ColorSelectionSubmenuOutput,
} from '../../models/submenuInputOutput.model';
import { XButtonComponent } from '../x-button/x-button.component';
import { X_SCALE_VALUE } from '@constants';

@Component({
  selector: 'app-color-selection-submenu',
  templateUrl: './color-selection-submenu.component.html',
  styleUrls: ['./color-selection-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, ColorSelectionPanelComponent, XButtonComponent],
})
export class ColorSelectionSubmenuComponent
  implements ColorSelectionSubmenuInput
{
  // Inputs matching ColorSelectionSubmenuInput
  @Input() title: string = '';
  @Input() colorId: number | null = null;
  @Input() buttonText: string = '';

  // Outputs for ColorSelectionSubmenuOutput
  @Output() menuAction = new EventEmitter<ColorSelectionSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  xScale = X_SCALE_VALUE;

  // Component State
  selectedColorId: number | null = null;

  ngOnInit() {
    // Initialize selectedColorId
    this.selectedColorId = this.colorId;
  }

  // Handle color selection from the child component
  onColorSelected(colorId: number | null) {
    this.selectedColorId = colorId;
  }

  // Handle action button click
  onActionClicked() {
    // Emit the menu action
    this.menuAction.emit({
      colorId: this.selectedColorId,
    });
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
