import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category/category.service';  // Assure-toi que le chemin est correct
import { CategorieDTO } from './category/categorie-dto.model'; // Modèle DTO que tu utilises
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public categories: CategorieDTO[] = [];  // Données des catégories à afficher dans la navbar

  constructor(private categoryService: CategoryService, private router: Router) { }

  isHomePage: boolean = false;

  ngOnInit(): void {
    this.loadCategories();  // Chargement des catégories
    // Préciser que l'événement est de type `NavigationEnd` avec une syntaxe générique
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd) // Type assertion
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage = event.url === '/';
    });
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
