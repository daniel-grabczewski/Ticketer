import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BackgroundSelectionPanelComponent } from '../background-selection-panel/background-selection-panel.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background-selection-submenu',
  templateUrl: './background-selection-submenu.component.html',
  styleUrls: ['./background-selection-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, BackgroundSelectionPanelComponent],
})
export class BackgroundSelectionSubmenuComponent {
  // Inputs
  @Input() title: string = '';
  @Input() colorSelectionHeader: string = '';
  @Input() buttonText: string = '';
  @Input() selectedColorId: number | null = null;

  // Outputs
  @Output() menuAction = new EventEmitter<{
    type: string;
    value: number | null;
  }>();
  @Output() close = new EventEmitter<void>();

  // Component State
  colorId: number | null = null;

  ngOnInit() {
    // Initialize colorId with selectedColorId input
    this.colorId = this.selectedColorId;
  }

  // Handle color selection from the child component
  onColorSelected(colorId: number | null) {
    this.colorId = colorId;
  }

  // Handle action button click
  onActionClicked() {
    // Emit the menu action with the specified structure
    this.menuAction.emit({
      type: 'background-selection-submenu',
      value: this.colorId,
    });
    // Close the submenu
    this.close.emit();
  }

  // Handle close button click
  onCloseClicked() {
    this.close.emit();
  }
}
