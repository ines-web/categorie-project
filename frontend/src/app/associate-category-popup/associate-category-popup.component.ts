import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { CategorieDTO } from '../category/categorie-dto.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorService } from '../error-popup/error.service';
import { NgSelectModule } from '@ng-select/ng-select'; 

@Component({
  selector: 'app-associate-category-popup',
  templateUrl: './associate-category-popup.component.html',
  styleUrls: ['./associate-category-popup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, NgSelectModule]
})
export class AssociateCategoryPopupComponent implements OnInit {
  @Input() childCategory: CategorieDTO | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() associate = new EventEmitter<number | null>();

  potentialParents: CategorieDTO[] = [];
  selectedParentId: number | null = null;
  customPlaceholder: string = 'Choisissez une catégorie parent';

  constructor(private categoryService: CategoryService, private errorService: ErrorService) {}

  ngOnInit() {
    if (this.childCategory) {
      this.loadPotentialParents();
    }
  }

  private loadPotentialParents(): void {
    if (!this.childCategory) return;

    this.categoryService.getPotentialParents(this.childCategory.id).subscribe(
      (categories) => {
        this.potentialParents = categories;
      },
      () => this.errorService.errorEvent('Erreur lors du chargement des catégories potentielles.')
    );
  }

  selectCategory(event: any): void {
    this.selectedParentId = event ? event.id : null;
    this.customPlaceholder =  "";
  }

  onAssociate() {
    this.associate.emit(this.selectedParentId);
  }

  closePopup() {
    this.close.emit();
  }
}
