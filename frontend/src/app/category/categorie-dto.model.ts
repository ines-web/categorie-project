// categorie-dto.model.ts
export interface CategorieDTO {
    id: number;
    nom: string;
    dateCreation: string;
    categoriesEnfants: CategorieDTO[];  // Utilise la même structure pour les enfants
    estRacine: boolean;
    nombreEnfants: number;
  }
  