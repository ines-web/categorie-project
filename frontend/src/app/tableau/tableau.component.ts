import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';  // Le service pour récupérer les catégories
import { CategorieDTO } from '../category/categorie-dto.model';  // Assure-toi que le modèle CategorieDTO est correct

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',

})
export class TableauComponent implements OnInit {
  public tableauData: CategorieDTO[] = [];  // Tableau pour stocker les données des catégories

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();  // Appel de la méthode pour charger les catégories
  }

  // Méthode pour récupérer les catégories depuis l'API
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data: CategorieDTO[]) => {
        this.tableauData = data;  // Affectation des données récupérées au tableau
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    );
  }
  // Example methods for actions
  viewCategory(item: any): void {
    console.log('Viewing category:', item);
    // Handle view logic here (e.g., navigate to a detail page)
  }

  editCategory(item: any): void {
    console.log('Editing category:', item);
    // Handle edit logic here
  }

  deleteCategory(item: any): void {
    console.log('Deleting category:', item);
    // Handle delete logic here (e.g., make an API call to delete)
  }

  infoCategory(item: any): void {
    console.log('Category info:', item);
    // Show info about the category
  }
}
