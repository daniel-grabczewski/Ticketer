import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingDirectSubmenuComponent } from './testing-direct-submenu.component';

describe('TestingDirectSubmenuComponent', () => {
  let component: TestingDirectSubmenuComponent;
  let fixture: ComponentFixture<TestingDirectSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingDirectSubmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingDirectSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
