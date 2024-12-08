import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { CategorieDTO } from '../category/categorie-dto.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ErrorService } from '../error-popup/error.service';

@Component({
  selector: 'app-edit-category-popup',
  templateUrl: './edit-category-popup.component.html',
  styleUrls: ['./edit-category-popup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule]
})
export class EditCategoryPopupComponent implements OnInit {
  @Input() category: CategorieDTO | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<CategorieDTO>();

  editedCategory: CategorieDTO | null = null;
  potentialParents: CategorieDTO[] = [];

  constructor(
    private categoryService: CategoryService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    if (this.category) {
      this.editedCategory = { ...this.category };
      this.loadPotentialParents();
    }
  }

  private loadPotentialParents(): void {
    if (!this.category) return;

    this.categoryService.getPotentialParents(this.category.id).subscribe(
      (categories) => {
        this.potentialParents = categories;
      },
      () => this.errorService.errorEvent('Erreur lors du chargement des catégories potentielles.')
    );
  }

  onUpdate() {
    if (this.editedCategory) {
      this.update.emit(this.editedCategory);
    }
  }

  closePopup() {
    this.close.emit();
  }
}