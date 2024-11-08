import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorieDTO } from './categorie-dto.model';  // Assure-toi que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/api/categories';  // URL de l'API pour les catégories

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer les catégories depuis l'API
  getCategories(): Observable<CategorieDTO[]> {
    return this.http.get<CategorieDTO[]>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<CategorieDTO> {
    return this.http.get<CategorieDTO>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour supprimer une catégorie via l'API
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchCategories(filters: any): Observable<any[]> {
    let params = new HttpParams();

    if (filters.estRacine !== null) {
      params = params.append('estRacine', filters.estRacine.toString());
    }
    if (filters.dateCreationApres) {
      params = params.append('dateCreationApres', filters.dateCreationApres);
    }
    if (filters.dateCreationAvant) {
      params = params.append('dateCreationAvant', filters.dateCreationAvant);
    }
    if (filters.dateCreationDebut && filters.dateCreationFin) {
      params = params.append('dateCreationDebut', filters.dateCreationDebut);
      params = params.append('dateCreationFin', filters.dateCreationFin);
    }

    return this.http.get<any[]>(`${this.apiUrl}`, { params });
  }
  
}
