import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputSubmenuComponent } from './text-input-submenu.component';

describe('TextInputSubmenuComponent', () => {
  let component: TextInputSubmenuComponent;
  let fixture: ComponentFixture<TextInputSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputSubmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextInputSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
