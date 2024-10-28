import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSelectionSubmenuComponent } from './background-selection-submenu.component';

describe('BackgroundSelectionSubmenuComponent', () => {
  let component: BackgroundSelectionSubmenuComponent;
  let fixture: ComponentFixture<BackgroundSelectionSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundSelectionSubmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundSelectionSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
