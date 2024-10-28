import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBoardSubmenuComponent } from './generate-board-submenu.component';

describe('GenerateBoardSubmenuComponent', () => {
  let component: GenerateBoardSubmenuComponent;
  let fixture: ComponentFixture<GenerateBoardSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateBoardSubmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateBoardSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
