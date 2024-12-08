// src/app/category/update-categorie-dto.model.ts
export interface UpdateCategorieDTO {
    id: number;  // ID de la catégorie
    nom: string; // Nom de la catégorie
    pidParent?: {  // Parent optionnel
      id: number; // ID du parent
      nom: string; // Nom du parent
      dateCreation: string; // Date de création du parent
    } | null; // Peut être null si aucun parent n'est associé
  }
  