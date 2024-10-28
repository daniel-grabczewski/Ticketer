import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDataDialogComponent } from './guest-data-dialog.component';

describe('GuestDataDialogComponent', () => {
  let component: GuestDataDialogComponent;
  let fixture: ComponentFixture<GuestDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestDataDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
