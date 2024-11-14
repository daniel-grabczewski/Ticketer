import { Component, ElementRef } from '@angular/core';
import { OverlayService } from '../../../core/services/overlay.service';
import { MenuConfig, SubmenuOutputTransfer } from '../../models/menu.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TestingComponent {
  // Example MenuConfig for the TestRealMenuComponent
  testMenuConfig: MenuConfig = {
    title: 'Test Real Menu',
    submenus: [
      {
        buttonText: 'Text input',
        submenu: {
          type: 'text-input-submenu',
          purpose: 'example-purpose',
          payload: {
            title: 'Example Text Input',
            textInputLabel: 'Enter Text',
            buttonText: 'Submit',
          },
        },
      },
      {
        buttonText: 'Confirmation',
        submenu: {
          type: 'confirmation-submenu',
          purpose: 'confirm-purpose',
          payload: {
            title: 'Confirmation Required',
            confirmationMessage: 'Are you sure?',
            buttonText: 'Confirm',
          },
        },
      },
      {
        buttonText: 'Background selection',
        submenu: {
          type: 'background-selection-submenu',
          purpose: 'background-selection-purpose',
          payload: {
            title: 'Select a background',
            colorId: 2,
            colorSelectionHeader: 'Choose a color for the background',
            buttonText: 'Done',
          },
        },
      },
      {
        buttonText: 'Generate Board',
        submenu: {
          type: 'generate-board-submenu',
          purpose: 'generate-board-purpose',
          payload: {
            title: 'Generate a New Board',
            colorId: 3,
            textInputLabel: 'Enter Board Name',
            initialText: 'New Board',
            placeholder: 'Board Name...',
            colorSelectionHeader: 'Pick a Board Color',
            buttonText: 'Create Board',
          },
        },
      },
      {
        buttonText: 'Color Selection',
        submenu: {
          type: 'color-selection-submenu',
          purpose: 'color-selection-purpose',
          payload: {
            title: 'Pick a Color',
            colorId: 1,
            buttonText: 'Select Color',
          },
        },
      },
      {
        buttonText: 'Dropdown',
        submenu: {
          type: 'dropdown-submenu',
          purpose: 'dropdown-purpose',
          payload: {
            title: 'Choose an Option',
            dropdownInputLabel: 'Select from the list',
            dropdownItems: [
              { id: '1', name: 'Option 1' },
              { id: '2', name: 'Option 2' },
              { id: '3', name: 'Option 3' },
            ],
            dropdownPlaceholder: 'Pick one of the below...',
            buttonText: 'Confirm Selection',
          },
        },
      },
    ],
  };

  constructor(
    private overlayService: OverlayService,
    private elementRef: ElementRef
  ) {}

  openTestRealMenu(event: Event) {
    const target = event.target as HTMLElement;
    if (target) {
      this.overlayService.openOverlay(target, this.testMenuConfig);
      console.log('Opened TestRealMenuComponent via overlay service');
    } else {
      console.error('Error: Event target is not an HTMLElement.');
    }
  }

  handleMenuAction(output: SubmenuOutputTransfer) {
    console.log('Received submenu action from TestRealMenu:', output);
    // Handle the output received from the TestRealMenuComponent as needed
  }
}
