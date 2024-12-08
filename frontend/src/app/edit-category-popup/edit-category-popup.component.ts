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
  @Input() category: CategorieDTO | null = null; // Catégorie à modifier
  @Output() close = new EventEmitter<void>(); // Pour fermer la popup
  @Output() update = new EventEmitter<CategorieDTO>(); // Émettre une catégorie mise à jour

  editedCategory: CategorieDTO | null = null; // Catégorie modifiée localement
  selectedParentId: number | null = null; // ID du parent sélectionné
  potentialParents: CategorieDTO[] = []; // Liste des parents possibles

  constructor(
    private categoryService: CategoryService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    if (this.category) {
      this.editedCategory = { ...this.category }; // Clone la catégorie pour éviter de modifier l'original
      this.selectedParentId = this.editedCategory.pidParent?.id || null; // Définit l'ID du parent sélectionné
      this.loadPotentialParents(); // Charge les parents possibles
    }
  }

  private loadPotentialParents(): void {
    if (!this.category) return;

    this.categoryService.getPotentialParents(this.category.id).subscribe(
      (categories) => {
        this.potentialParents = categories.filter((parent) => parent.id !== this.category!.id); // Exclure la catégorie elle-même
      },
      () => this.errorService.errorEvent('Erreur lors du chargement des catégories potentielles.')
    );
  }

  onUpdate() {
    if (this.editedCategory) {
      // Mise à jour du parent sélectionné
      this.editedCategory.pidParent = this.selectedParentId 
        ? this.potentialParents.find((parent) => parent.id === this.selectedParentId) || null
        : null;

      console.log('Catégorie mise à jour avant l\'envoi :', this.editedCategory);

      // Émet l'événement pour mettre à jour la catégorie dans le composant parent
      this.update.emit(this.editedCategory);

      // Met à jour la catégorie via le service
      this.categoryService.updateCategory(this.editedCategory).subscribe(
        (updatedCategory) => {
          console.log('Catégorie mise à jour avec succès :', updatedCategory);
          this.closePopup(); // Ferme la popup après succès
        },
        (error) => {
          this.errorService.errorEvent('Erreur lors de la mise à jour de la catégorie.');
        }
      );
    }
  }

  onParentChange(event: number | null): void {
    console.log('Parent sélectionné :', event);
    this.selectedParentId = event;
  }

  closePopup() {
    this.close.emit(); // Émet un événement pour fermer la popup
  }
}
