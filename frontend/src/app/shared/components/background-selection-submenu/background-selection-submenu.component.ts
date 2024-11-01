import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BackgroundSelectionPanelComponent } from '../background-selection-panel/background-selection-panel.component';
import { CommonModule } from '@angular/common';
import {
  BackgroundSelectionSubmenuInput,
  BackgroundSelectionSubmenuOutput,
} from '../../models/submenuInputOutput.model';

@Component({
  selector: 'app-background-selection-submenu',
  templateUrl: './background-selection-submenu.component.html',
  styleUrls: ['./background-selection-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, BackgroundSelectionPanelComponent],
})
export class BackgroundSelectionSubmenuComponent
  implements BackgroundSelectionSubmenuInput
{
  // Inputs matching BackgroundSelectionSubmenuInput
  @Input() title: string = '';
  @Input() colorSelectionHeader: string = '';
  @Input() buttonText: string = '';
  @Input() colorId: number | null = null;

  // Outputs for BackgroundSelectionSubmenuOutput
  @Output() menuAction = new EventEmitter<BackgroundSelectionSubmenuOutput>();
  @Output() close = new EventEmitter<void>();

  // Component State
  selectedColorId: number | null = this.colorId;

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
