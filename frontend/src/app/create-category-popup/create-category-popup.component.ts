import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../error-popup/error.service';


@Component({
  selector: 'app-create-category-popup',
  templateUrl: './create-category-popup.component.html',
  styleUrls: ['./create-category-popup.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class CreateCategoryPopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() categoryCreated = new EventEmitter<void>();
  categoryName: string = '';

  constructor(private categoryService: CategoryService, private errorService: ErrorService) {}

  onSubmit(): void {
    if (this.categoryName) {
      this.categoryService.createCategory({ nom: this.categoryName }).subscribe(
        result => {
          this.categoryCreated.emit();
          this.closePopup();
        },
        error => {
          this.errorService.errorEvent("Erreur lors de la création de la catégorie");
        }
      );
    }
  }

  closePopup(): void {
    this.close.emit();
  }
}