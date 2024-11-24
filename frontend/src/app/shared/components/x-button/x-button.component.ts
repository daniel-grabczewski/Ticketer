import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export enum XButtonConfig {
  Default = '',
  Menu = 'menu',
}

@Component({
  selector: 'app-x-button',
  templateUrl: './x-button.component.html',
  styleUrls: ['./x-button.component.scss'],
  standalone: true,
})
export class XButtonComponent implements OnChanges {
  @Input() scale: number = 1; // Default scale
  @Input() color: string = 'var(--neutral-darker)'; // Default color
  @Input() hoverColor: string = 'var(--background-lighter)'; // Default hover color
  @Input() config: XButtonConfig | string = XButtonConfig.Default;

  colorInternal: string = this.color;
  hoverColorInternal: string = this.hoverColor;
  scaleInternal: number = this.scale;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['scale'] || changes['color']) {
      this.applyConfig();
    }
  }

  private applyConfig(): void {
    this.colorInternal = this.color;
    this.hoverColorInternal = this.hoverColor;
    this.scaleInternal = this.scale;

    switch (this.config) {
      case XButtonConfig.Menu:
        this.colorInternal = 'var(--menu-x-button-color)';
        this.hoverColorInternal = 'var(--menu-x-button-hover-color)';
        this.scaleInternal = 1.2;
        break;
    }
  }

  getStrokeWidth(): number {
    return 7.4 * Math.sqrt(this.scaleInternal);
  }
}
