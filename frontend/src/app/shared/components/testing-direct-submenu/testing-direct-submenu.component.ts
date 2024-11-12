import { Component, ElementRef } from '@angular/core'
import { TestingOverlayService } from '../../../core/services/testing-overlay.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-testing-direct-submenu',
  templateUrl: './testing-direct-submenu.component.html',
  styleUrls: ['./testing-direct-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TestingDirectSubmenuComponent {
  constructor(
    private testingOverlayService: TestingOverlayService,
    private elementRef: ElementRef
  ) {}

  openTextInputSubmenu(event: Event) {
    const target = event.target as HTMLElement
    if (target) {
      this.testingOverlayService.openSubmenuOverlay(target, {
        type: 'text-input-submenu',
        purpose: 'direct-example-purpose',
        payload: {
          title: 'Direct Text Input Test',
          textInputLabel: 'Enter Text',
          buttonText: 'Submit',
        },
      })
      console.log('Opened Text Input Submenu directly')
    } else {
      console.error('Error: Event target is not an HTMLElement.')
    }
  }
}
