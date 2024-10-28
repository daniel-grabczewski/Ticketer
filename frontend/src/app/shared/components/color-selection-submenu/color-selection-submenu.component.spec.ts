import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSelectionSubmenuComponent } from './color-selection-submenu.component';

describe('ColorSelectionSubmenuComponent', () => {
  let component: ColorSelectionSubmenuComponent;
  let fixture: ComponentFixture<ColorSelectionSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSelectionSubmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorSelectionSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
