import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieSearchComponent } from './categorie-search.component';

describe('CategorieSearchComponent', () => {
  let component: CategorieSearchComponent;
  let fixture: ComponentFixture<CategorieSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
