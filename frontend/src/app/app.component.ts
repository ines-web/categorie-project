import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category/category.service';  // Assure-toi que le chemin est correct
import { CategorieDTO } from './category/categorie-dto.model'; // Modèle DTO que tu utilises

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public categories: CategorieDTO[] = [];  // Données des catégories à afficher dans la navbar

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();  // Appel de la méthode pour charger les catégories depuis l'API
  }

  // Méthode pour récupérer les catégories depuis l'API
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data: CategorieDTO[]) => {
        this.categories = data;  // Mise à jour des catégories pour la navbar
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    );
  }

  // Méthode de déconnexion (si nécessaire)
  logout(): void {
    // Logique de déconnexion
  }
}
