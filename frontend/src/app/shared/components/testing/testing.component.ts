import { Component, ElementRef } from '@angular/core';
import { TestingOverlayService } from '../../../core/services/testing-overlay.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  standalone: true
})
export class TestingComponent {
  constructor(private testingOverlayService: TestingOverlayService, private elementRef: ElementRef) {}

  openTestMenu() {
    const buttonElement = this.elementRef.nativeElement.querySelector('button');
    if (buttonElement) {
      this.testingOverlayService.openOverlay(buttonElement);
    }
  }
}
