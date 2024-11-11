import { Injectable, Injector, InjectionToken } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { TestRealMenuComponent } from '../../shared/components/test-real-menu/test-real-menu.component';
import {
  MenuConfig,
  SubmenuInputTransfer,
  SubmenuOutputTransfer,
} from '../../shared/models/menu.model';
import { TextInputSubmenuComponent } from '../../shared/components/text-input-submenu/text-input-submenu.component';
import { ConfirmationSubmenuComponent } from '../../shared/components/confirmation-submenu/confirmation-submenu.component';
import { BackgroundSelectionSubmenuComponent } from '../../shared/components/background-selection-submenu/background-selection-submenu.component';
import { GenerateBoardSubmenuComponent } from '../../shared/components/generate-board-submenu/generate-board-submenu.component';
import { ColorSelectionSubmenuComponent } from '../../shared/components/color-selection-submenu/color-selection-submenu.component';
import { DropdownSubmenuComponent } from '../../shared/components/dropdown-submenu/dropdown-submenu.component';
import { CreateBoardItemSubmenuComponent } from '../../shared/components/create-board-item-submenu/create-board-item-submenu.component';
import {
  SubmenuTypes,
  SubmenuInput,
} from '../../shared/models/submenuInputOutput.model';

@Injectable({
  providedIn: 'root',
})
export class TestingOverlayService {
  private overlayRef: OverlayRef | null = null;
  private submenuOverlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, private injector: Injector) {}

  // Map to link type strings to component classes
  private componentMap: { [key in SubmenuTypes]: ComponentType<any> } = {
    'text-input-submenu': TextInputSubmenuComponent,
    'confirmation-submenu': ConfirmationSubmenuComponent,
    'background-selection-submenu': BackgroundSelectionSubmenuComponent,
    'generate-board-submenu': GenerateBoardSubmenuComponent,
    'color-selection-submenu': ColorSelectionSubmenuComponent,
    'dropdown-submenu': DropdownSubmenuComponent,
    'create-board-item-submenu': CreateBoardItemSubmenuComponent,
  };

  // Injection token for passing the menuConfig to the overlay component
  private static MENU_CONFIG = new InjectionToken<MenuConfig>('MENU_CONFIG');

  // Method to open the TestRealMenuComponent as an overlay
  openOverlay(origin: HTMLElement, menuConfig: MenuConfig) {
    if (this.overlayRef) {
      this.closeOverlay();
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
      ])
      .withPush(true)
      .withViewportMargin(8)
      .withFlexibleDimensions(false);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
    });

    // Create an injector with menuConfig as the provided data
    const injector = Injector.create({
      providers: [
        { provide: TestingOverlayService.MENU_CONFIG, useValue: menuConfig },
      ],
      parent: this.injector,
    });

    const portal = new ComponentPortal(TestRealMenuComponent, null, injector);
    const componentRef = this.overlayRef.attach(portal);

    // Set the @Input() property manually
    (componentRef.instance as TestRealMenuComponent).menuConfig = menuConfig;

    console.log('Overlay component initialized with config:', menuConfig);

    // Close overlay when the backdrop is clicked
    this.overlayRef.backdropClick().subscribe(() => this.closeOverlay());

    // Listen for the close event emitted by the TestRealMenuComponent
    componentRef.instance.close.subscribe(() => this.closeOverlay());

    // Listen for menuAction event and propagate it up if needed
    componentRef.instance.menuAction.subscribe(
      (output: SubmenuOutputTransfer) => {
        console.log('Submenu action received from TestRealMenu:', output);
        // Optionally handle or propagate the event further
      }
    );
  }

  // Method to open a submenu overlay based on the type string
  openSubmenuOverlay(origin: HTMLElement, submenuData: SubmenuInputTransfer) {
    if (this.submenuOverlayRef) {
      this.closeSubmenuOverlay();
    }

    const componentType = this.componentMap[submenuData.type];
    if (!componentType) {
      console.error('No component found for type:', submenuData.type);
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        // Primary position: below the button
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        // Fallback position: above the button
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ])
      .withPush(true)
      .withViewportMargin(8)
      .withFlexibleDimensions(false);

    this.submenuOverlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
    });

    const portal = new ComponentPortal(componentType);
    const componentRef = this.submenuOverlayRef.attach(portal);

    // Type guard to ensure proper type assignment
    if (submenuData.payload) {
      this.assignInputsToComponent(componentRef.instance, submenuData.payload);
    }

    // Close submenu overlay when the backdrop is clicked
    this.submenuOverlayRef
      .backdropClick()
      .subscribe(() => this.closeSubmenuOverlay());

    // Listen for events emitted by the submenu instance
    if (this.isInstanceWithEventEmitter(componentRef.instance, 'close')) {
      componentRef.instance['close'].subscribe(() =>
        this.closeSubmenuOverlay()
      );
    }

    if (this.isInstanceWithEventEmitter(componentRef.instance, 'menuAction')) {
      componentRef.instance['menuAction'].subscribe(
        (output: SubmenuOutputTransfer) => {
          console.log('Submenu action emitted:', output);
          // Close submenu after action is emitted
          this.closeSubmenuOverlay();
        }
      );
    }
  }

  private assignInputsToComponent(instance: any, payload: SubmenuInput) {
    Object.keys(payload).forEach((key) => {
      if (key in instance) {
        instance[key] = payload[key as keyof SubmenuInput];
      }
    });
  }

  private isInstanceWithEventEmitter(
    instance: any,
    propName: string
  ): instance is { [key: string]: any } {
    return instance && typeof instance[propName]?.subscribe === 'function';
  }

  // Method to close the main overlay
  closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }

  // Method to close the submenu overlay
  closeSubmenuOverlay() {
    if (this.submenuOverlayRef) {
      this.submenuOverlayRef.detach();
      this.submenuOverlayRef = null;
    }
  }

  // Method to close all overlays (optional for comprehensive cleanup)
  closeAllOverlays() {
    this.closeOverlay();
    this.closeSubmenuOverlay();
  }
}
