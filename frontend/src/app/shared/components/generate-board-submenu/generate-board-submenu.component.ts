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
  imports: [
    CommonModule,
    FormsModule,
    BackgroundSelectionPanelComponent,
    XButtonComponent,
  ]
})
export class GenerateBoardSubmenuComponent implements GenerateBoardSubmenuInput, AfterViewInit {
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

  // References for focusing:
  // - The container (if needed)
  // - The text input (we use #inputField in the template)
  @ViewChild('menuContainer') menuContainer!: ElementRef<HTMLElement>;
  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.selectedColorId = this.colorId;
    this.nameInput = this.initialText;
  }

  ngAfterViewInit() {
    // Focus the text input so that the cursor is blinking inside it immediately.
    if (this.inputField) {
      this.inputField.nativeElement.focus();
    }
  }

  // Handle color selection from the child component.
  onColorSelected(colorId: number | null) {
    this.selectedColorId = colorId;
  }

  // Handle Create button (or Enter key) click.
  onCreateClicked() {
    // Only proceed if nameInput has non-empty trimmed text.
    if (this.nameInput.trim().length === 0) {
      return;
    }
    this.menuAction.emit({
      name: this.nameInput.trim(),
      colorId: this.selectedColorId,
    });
    this.close.emit();
  }

  // Handle close button click.
  onCloseClicked() {
    this.close.emit();
  }

  // Listen for document keydown events. Close submenu if Escape is pressed.
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onCloseClicked();
    }
  }
}
