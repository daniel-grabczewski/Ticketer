import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSelectionPanelComponent } from './color-selection-panel.component';

describe('ColorSelectionPanelComponent', () => {
  let component: ColorSelectionPanelComponent;
  let fixture: ComponentFixture<ColorSelectionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSelectionPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorSelectionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
