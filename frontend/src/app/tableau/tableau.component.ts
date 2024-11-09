import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';  // Le service pour récupérer les catégories
import { CategorieDTO } from '../category/categorie-dto.model';  // Assure-toi que le modèle CategorieDTO est correct
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategorieSearchComponent } from '../categorie-search/categorie-search.component'; // Chemin correct vers votre composant

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss'],
  standalone: true, // Assurez-vous que votre tableau est également un composant autonome
  imports: [CommonModule, CategorieSearchComponent] 

})
export class TableauComponent implements OnInit {
  public tableauData: CategorieDTO[] = [];  // Tableau pour stocker les données des catégories

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();  // Appel de la méthode pour charger les catégories
  }

  // Méthode pour récupérer les catégories depuis l'API
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data: CategorieDTO[]) => {
        this.tableauData = data;  // Affectation des données récupérées au tableau
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    );
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
          console.error('Erreur lors de la suppression de la catégorie', error);
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
  
    // Appel au service pour rechercher les catégories en fonction des filtres
    this.categoryService.searchCategories(filters).subscribe(
      (results) => {
        this.tableauData = results; // Mettez à jour les données du tableau avec les résultats
      },
      (error) => {
        console.error('Erreur lors de la recherche:', error);
      }
    );
  }
  
  
  
  

  infoCategory(item: any): void {
    console.log('Category info:', item);
    // Show info about the category
  }
}
