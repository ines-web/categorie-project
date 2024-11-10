import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { CategorieDTO } from '../category/categorie-dto.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-associate-category-popup',
  templateUrl: './associate-category-popup.component.html',
  styleUrls: ['./associate-category-popup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule]
  
})
export class AssociateCategoryPopupComponent implements OnInit {
  @Input() childCategory: CategorieDTO | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() associate = new EventEmitter<number | null>();

  potentialParents: CategorieDTO[] = [];
  filteredCategories: CategorieDTO[] = [];
  selectedParentId: number | null = null;
  searchTerm: string = '';
  isDropdownOpen: boolean = false;  // Nouvelle variable pour gérer l'affichage du dropdown

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    if (this.childCategory) {
      this.loadPotentialParents();
    }
  }

  loadPotentialParents() {
    if (this.childCategory) {
      this.categoryService.getPotentialParents(this.childCategory.id).subscribe(
        (data) => {
          this.potentialParents = data;
          this.filteredCategories = [...this.potentialParents];
        },
        (error) => console.error('Erreur lors du chargement des catégories potentielles', error)
      );
    }
  }

  onSearch() {
    this.filteredCategories = this.potentialParents.filter(cat => 
      cat.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.isDropdownOpen = true;  // Affiche le dropdown lorsque l'utilisateur commence à taper
  }

  selectCategory(categoryId: number | null) {
    this.selectedParentId = categoryId;
    this.searchTerm = categoryId === null ? 'Aucun (pas de parent)' : 
      this.potentialParents.find(cat => cat.id === categoryId)?.nom || '';
    this.isDropdownOpen = false;  // Ferme le dropdown après sélection
  }

  onFocus() {
    this.isDropdownOpen = true;  // Affiche le dropdown lorsque le champ est en focus
  }

  onBlur() {
    setTimeout(() => {
      this.isDropdownOpen = false;  // Ferme le dropdown après un petit délai lorsque le champ perd le focus
    }, 200);
  }

  onAssociate() {
    this.associate.emit(this.selectedParentId);
  }

  closePopup() {
    this.close.emit();
  }
}