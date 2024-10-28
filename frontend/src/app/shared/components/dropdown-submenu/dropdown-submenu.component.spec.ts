import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSubmenuComponent } from './dropdown-submenu.component';

describe('DropdownSubmenuComponent', () => {
  let component: DropdownSubmenuComponent;
  let fixture: ComponentFixture<DropdownSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSubmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
