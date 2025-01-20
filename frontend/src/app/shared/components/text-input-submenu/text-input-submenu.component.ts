import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  HostListener, 
  ViewChild, 
  ElementRef, 
  AfterViewInit 
} from '@angular/core';
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
  imports: [CommonModule, FormsModule, XButtonComponent]
})
export class TextInputSubmenuComponent implements TextInputSubmenuInput, AfterViewInit {
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

  // ViewChild references for the container and the text input
  @ViewChild('menuContainer') menuContainer!: ElementRef<HTMLElement>;
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    // Initialize with the provided initial text (if any)
    this.textInputValue = this.initialText;
  }

  ngAfterViewInit() {
    // Focus the text input so that the cursor is blinking inside it immediately.
    if (this.textInput) {
      this.textInput.nativeElement.focus();
    }
  }

  // Handle action button or Enter key click.
  onActionClicked() {
    // Only proceed if there is non-empty trimmed text.
    if (this.textInputValue.trim().length === 0) {
      return;
    }
    this.menuAction.emit({ text: this.textInputValue });
    this.close.emit();
  }

  // Handle close button click.
  onCloseClicked() {
    this.close.emit();
  }

  // Listen for document keydown events. Close the submenu if Escape is pressed.
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onCloseClicked();
    }
  }
}
