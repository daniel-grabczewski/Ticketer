import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
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
  imports: [CommonModule, ColorSelectionPanelComponent, XButtonComponent]
})
export class ColorSelectionSubmenuComponent
  implements ColorSelectionSubmenuInput, AfterViewInit
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

  // Reference to the container element, so we can focus it on init.
  @ViewChild('menuContainer') menuContainer!: ElementRef<HTMLElement>;

  ngOnInit() {
    // Initialize selectedColorId with the provided colorId.
    this.selectedColorId = this.colorId;
  }

  ngAfterViewInit() {
    // Force focus on the container so that key events (Enter) are captured immediately.
    if (this.menuContainer) {
      this.menuContainer.nativeElement.focus();
    }
  }

  // Handle color selection from the child component.
  onColorSelected(colorId: number | null) {
    this.selectedColorId = colorId;
  }

  // Handle action button (or Enter key) click.
  onActionClicked() {
    this.menuAction.emit({
      colorId: this.selectedColorId,
    });
    this.close.emit();
  }

  // Handle close button click.
  onCloseClicked() {
    this.close.emit();
  }

  // Listen for the Escape key anywhere in the document.
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onCloseClicked();
    }
  }
}
