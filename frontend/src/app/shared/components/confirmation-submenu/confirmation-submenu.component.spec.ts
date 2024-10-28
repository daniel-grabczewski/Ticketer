import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationSubmenuComponent } from './confirmation-submenu.component';

describe('ConfirmationSubmenuComponent', () => {
  let component: ConfirmationSubmenuComponent;
  let fixture: ComponentFixture<ConfirmationSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationSubmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
