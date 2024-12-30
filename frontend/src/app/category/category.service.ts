import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    const params = new HttpParams().set('size', '50');
    return this.http.get<CategorieDTO[]>(this.apiUrl, { params });
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

  createCategory(category: { nom: string }): Observable<CategorieDTO> {
    return this.http.post<CategorieDTO>(this.apiUrl, category);
  }

  associateCategoryToParent(childId: number, parentId: number | null): Observable<CategorieDTO> {
    if (parentId === null) {
      // Si parentId est null, on envoie une requête pour dissocier la catégorie de son parent
      return this.http.put<CategorieDTO>(`${this.apiUrl}/${childId}/dissociate`, {});
    } else {
      // Sinon, on associe la catégorie au parent spécifié
      return this.http.put<CategorieDTO>(`${this.apiUrl}/${childId}/parent/${parentId}`, {});
    }
  }

  getPotentialParents(childId: number): Observable<CategorieDTO[]> {
    return this.http.get<CategorieDTO[]>(`${this.apiUrl}/potential-parents/${childId}`);
  }

  sortCategories(categories: CategorieDTO[], column: string, direction: 'asc' | 'desc'): CategorieDTO[] {
    return [...categories].sort((a, b) => {
      let comparison = 0;
      if (column === 'nom') {
        comparison = a.nom.localeCompare(b.nom);
      } else if (column === 'dateCreation') {
        comparison = new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime();
      } else if (column === 'nombreEnfants') {
        comparison = a.nombreEnfants - b.nombreEnfants;
      }
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  updateCategory(category: CategorieDTO): Observable<CategorieDTO> {
    return this.http.put<CategorieDTO>(`${this.apiUrl}/${category.id}`, category);
  }
}