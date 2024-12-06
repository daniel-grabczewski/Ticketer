import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum XButtonConfig {
  Default = '',
  Menu = 'menu',
}

@Component({
    selector: 'app-x-button',
    templateUrl: './x-button.component.html',
    styleUrls: ['./x-button.component.scss'],
    imports: [CommonModule]
})
export class XButtonComponent {
  @Input() config: XButtonConfig | string = XButtonConfig.Default;

  getClassBasedOnConfig() : string {
    switch (this.config) {
      case 'menu':
      return 'icon-button-menu-config'
      default:
        return 'icon-button-default-config'
    }
  }

  getStrokeWidth(): number {
    return 7.4 * Math.sqrt(1);
  }
}
