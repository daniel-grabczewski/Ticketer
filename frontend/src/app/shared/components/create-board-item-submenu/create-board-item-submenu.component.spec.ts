import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoardItemSubmenuComponent } from './create-board-item-submenu.component';

describe('CreateBoardItemSubmenuComponent', () => {
  let component: CreateBoardItemSubmenuComponent;
  let fixture: ComponentFixture<CreateBoardItemSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBoardItemSubmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBoardItemSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
