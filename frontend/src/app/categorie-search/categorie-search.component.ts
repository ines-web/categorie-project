import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../category/category.service';
import { ErrorService } from '../error-popup/error.service';

@Component({
  selector: 'app-categorie-search',
  templateUrl: './categorie-search.component.html',
  styleUrls: ['./categorie-search.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategorieSearchComponent {
  @Output() searchEvent = new EventEmitter<any>();
  
  filters = {
    estRacine: null,
    dateCreationApres: null,
    dateCreationAvant: null,
    dateCreationDebut: null,
    dateCreationFin: null
  };

  selectedFilter = 'after'; // Valeur par défaut

  constructor(private categorieService: CategoryService ,private errorService: ErrorService) {}

  onFilterChange() {
    // Réinitialiser les filtres non utilisés
    if (this.selectedFilter === 'after') {
      this.filters.dateCreationAvant = null;
      this.filters.dateCreationDebut = null;
      this.filters.dateCreationFin = null;
    } else if (this.selectedFilter === 'before') {
      this.filters.dateCreationApres = null;
      this.filters.dateCreationDebut = null;
      this.filters.dateCreationFin = null;
    } else if (this.selectedFilter === 'range') {
      this.filters.dateCreationApres = null;
      this.filters.dateCreationAvant = null;
    }
  }

  onSearch() {
    // Émettre les filtres au parent
    this.searchEvent.emit(this.filters);
  }
}