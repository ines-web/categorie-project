import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';  // Le service pour récupérer les catégories
import { CategorieDTO } from '../category/categorie-dto.model';  // Assure-toi que le modèle CategorieDTO est correct
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategorieSearchComponent } from '../categorie-search/categorie-search.component'; // Chemin correct vers votre composant
import { CreateCategoryPopupComponent } from '../create-category-popup/create-category-popup.component';
import { AssociateCategoryPopupComponent } from '../associate-category-popup/associate-category-popup.component';
import { FormsModule } from '@angular/forms';
import { ErrorService } from '../error-popup/error.service';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss'],
  standalone: true, // Assurez-vous que votre tableau est également un composant autonome
  imports: [CommonModule, NgxPaginationModule,CategorieSearchComponent, CreateCategoryPopupComponent,AssociateCategoryPopupComponent ,FormsModule,]

})
export class TableauComponent implements OnInit {
  public tableauData: CategorieDTO[] = [];  // Tableau pour stocker les données des catégories
  page: number = 1;
  isPopupVisible = false;
  isAssociatePopupVisible = false;
  selectedChild: CategorieDTO | null = null;
  sortColumn: string = 'nom'; // Colonne de tri par défaut
  sortDirection: 'asc' | 'desc' = 'asc'; // Direction de tri par défau
  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router, 
    private errorService: ErrorService) {}
  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      data => {
        this.tableauData = data;
        this.cdr.detectChanges();
      },
      error => {
        this.errorService.errorEvent("Erreur lors de chargement de la catégorie");
      }
    );
  }

  openCreateCategoryPopup(): void {
    this.isPopupVisible = true;
  }

  closeCreateCategoryPopup(): void {
    this.isPopupVisible = false;
  }

  onCategoryCreated(): void {
    this.loadCategories();
  }
  // Example methods for actions
  viewCategory(item: CategorieDTO): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/category', item.id])
    );
    window.open(url, '_blank');
  }

  editCategory(item: any): void {
    console.log('Editing category:', item);
    // Handle edit logic here
  }

  deleteCategory(item: CategorieDTO): void {
    if (confirm(`Vous allez supprimer la catégorie :  ${item.nom}?`)) {
      this.categoryService.deleteCategory(item.id).subscribe(
        () => {
          this.tableauData = this.tableauData.filter(category => category.id !== item.id);
          console.log('Catégorie supprimée avec succès, tableau mis à jour.');

        },
        (error) => {
           this.errorService.errorEvent("Erreur lors de la suppression de la catégorie");
        }
      );
    }
  }
  filters = {
    estRacine: null,
    dateCreationApres: null,
    dateCreationAvant: null,
    dateCreationDebut: null,
    dateCreationFin: null
  };
  selectedFilter = 'after'; 
  
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

  onSearch(filters: any) {
    console.log('Filtres de recherche reçus:', filters);
  
   
    this.categoryService.searchCategories(filters).subscribe(
      (results) => {
        this.tableauData = results; 
      },
      (error) => {
        this.errorService.errorEvent("Erreur lors de la recherche de la catégorie");
      }
    );
  }
  
  

   openAssociatePopup(item: CategorieDTO): void {
    this.selectedChild = item;
    this.isAssociatePopupVisible = true;
  }

  closeAssociatePopup(): void {
    this.isAssociatePopupVisible = false;
    this.selectedChild = null;
  }

  onAssociateCategory(parentId: number | null): void {
    if (this.selectedChild) {
      this.categoryService.associateCategoryToParent(this.selectedChild.id, parentId).subscribe(
        () => {
          console.log(`Catégorie ${this.selectedChild?.nom} ${parentId ? 'associée au parent avec ID ' + parentId : 'dissociée de son parent'}`);
          this.loadCategories();
        },
        error => {
          console.error('Erreur lors de l\'association/dissociation de la catégorie', error);
        }
      );
    }
    this.closeAssociatePopup();
  }

  infoCategory(item: CategorieDTO): void {
    this.openAssociatePopup(item);
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      // Si on clique sur la même colonne, on inverse la direction du tri
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si on change de colonne, on réinitialise la direction à 'asc'
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Appliquer le tri
    this.tableauData = this.categoryService.sortCategories(this.tableauData, this.sortColumn, this.sortDirection);
  }
}
