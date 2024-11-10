import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateCategoryPopupComponent } from './associate-category-popup.component';

describe('AssociateCategoryPopupComponent', () => {
  let component: AssociateCategoryPopupComponent;
  let fixture: ComponentFixture<AssociateCategoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateCategoryPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociateCategoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
