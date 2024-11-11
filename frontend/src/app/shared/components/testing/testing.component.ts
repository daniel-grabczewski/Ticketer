import { Component, ElementRef } from '@angular/core'
import { TestingOverlayService } from '../../../core/services/testing-overlay.service'
import { MenuConfig, SubmenuOutputTransfer } from '../../models/menu.model'
import { TestRealMenuComponent } from '../test-real-menu/test-real-menu.component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  standalone: true,
  imports : [CommonModule, TestRealMenuComponent]
})
export class TestingComponent {
  showRealMenu: boolean = false

  // Example MenuConfig for the TestRealMenuComponent
  testMenuConfig: MenuConfig = {
    title: 'Test Real Menu',
    submenus: [
      {
        buttonText: 'Option 1',
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
        buttonText: 'Option 2',
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
    ],
  }

  constructor(
    private testingOverlayService: TestingOverlayService,
    private elementRef: ElementRef
  ) {}

  openTestRealMenu() {
    this.showRealMenu = true
  }

  handleMenuAction(output: SubmenuOutputTransfer) {
    console.log('Received submenu action from TestRealMenu:', output)
    // Handle the output received from the TestRealMenuComponent as needed
  }

  closeMenu() {
    this.showRealMenu = false
  }
}
