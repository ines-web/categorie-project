import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryPopupComponent } from './create-category-popup.component';

describe('CreateCategoryPopupComponent', () => {
  let component: CreateCategoryPopupComponent;
  let fixture: ComponentFixture<CreateCategoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCategoryPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCategoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
