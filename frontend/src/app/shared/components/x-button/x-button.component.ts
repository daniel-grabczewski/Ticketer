import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-x-button',
  templateUrl: './x-button.component.html',
  styleUrls: ['./x-button.component.scss'],
  standalone: true,
})
export class XButtonComponent {
  @Input() scale: number = 1 // Default scale
  @Input() color: string = '#4D566E' // Default color
  @Input() hoverColor: string = '#1A73E8' // Default hover color



  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Set the hover color as a CSS variable for the component
    this.renderer.setStyle(this.elRef.nativeElement, '--hover-color', this.hoverColor);
    this.renderer.setStyle(this.elRef.nativeElement, '--color', this.color);
  }

}
