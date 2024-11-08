import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorieDTO } from './categorie-dto.model';  // Assure-toi que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/api/categories';  // URL de l'API pour récupérer les catégories

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer les catégories depuis l'API
  getCategories(): Observable<CategorieDTO[]> {
    return this.http.get<CategorieDTO[]>(this.apiUrl);
  }
}
