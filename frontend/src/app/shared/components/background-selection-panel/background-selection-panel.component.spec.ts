import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSelectionPanelComponent } from './background-selection-panel.component';

describe('BackgroundSelectionPanelComponent', () => {
  let component: BackgroundSelectionPanelComponent;
  let fixture: ComponentFixture<BackgroundSelectionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundSelectionPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundSelectionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
