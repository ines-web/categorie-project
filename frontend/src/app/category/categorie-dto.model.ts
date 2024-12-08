// category/categorie-dto.model.ts
export interface CategorieDTO {
  id: number;
  nom: string;
  dateCreation: string;
  categoriesEnfants: CategorieDTO[];  // Utilise la même structure pour les enfants
  estRacine: boolean;
  nombreEnfants: number;
  pidParent?: { // Parent optionnel
    id: number; // ID du parent
    nom: string; // Nom du parent
  } | null; // Peut être null si aucun parent n'est associé
}