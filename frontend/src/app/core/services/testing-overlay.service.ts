import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestMenuComponent } from '../../shared/components/test-menu/test-menu.component';

@Injectable({
  providedIn: 'root'
})
export class TestingOverlayService {
  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, private injector: Injector) {}

  // Method to open the TestMenuComponent as an overlay
  openOverlay(origin: HTMLElement) {
    if (this.overlayRef) {
      this.closeOverlay();
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
      ]);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy
    });

    const portal = new ComponentPortal(TestMenuComponent);
    const componentRef = this.overlayRef.attach(portal);

    // Close overlay when the backdrop is clicked
    this.overlayRef.backdropClick().subscribe(() => this.closeOverlay());

    // Listen for the close event emitted by the TestMenuComponent
    componentRef.instance.closeMenu.subscribe(() => this.closeOverlay());
  }

  // Method to close the overlay
  closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }
}
