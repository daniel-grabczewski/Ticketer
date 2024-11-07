import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XButtonComponent } from './x-button.component';

describe('XButtonComponent', () => {
  let component: XButtonComponent;
  let fixture: ComponentFixture<XButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
