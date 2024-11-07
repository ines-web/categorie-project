package com.mycompany.categorie.service;

import com.mycompany.categorie.domain.Categorie;
import com.mycompany.categorie.repository.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategorieService {

    @Autowired
    private CategorieRepository categorieRepository;

    // Méthode pour récupérer une catégorie avec tous ses enfants
    public Categorie getCategorieWithChildren(Long id) {
        return categorieRepository.findById(id)
            .map(categorie -> {
                // Assurez-vous que les catégories enfants sont bien chargées (avec la méthode LEFT JOIN FETCH dans le repository)
                return categorie;
            })
            .orElseThrow(() -> new RuntimeException("Categorie not found"));
    }
}
