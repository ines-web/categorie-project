package com.mycompany.categorie.service.dto;

import java.time.LocalDate;
import java.util.Set;

public class CategorieDTO {
    private Long id;
    private String nom;
    private LocalDate dateCreation;
    private Set<CategorieDTO> categoriesEnfants;
    private boolean estRacine;
    private int nombreEnfants;

    // Getters et setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Set<CategorieDTO> getCategoriesEnfants() {
        return categoriesEnfants;
    }

    public void setCategoriesEnfants(Set<CategorieDTO> categoriesEnfants) {
        this.categoriesEnfants = categoriesEnfants;
    }

    public boolean isEstRacine() {
        return estRacine;
    }

    public void setEstRacine(boolean estRacine) {
        this.estRacine = estRacine;
    }

    public int getNombreEnfants() {
        return nombreEnfants;
    }

    public void setNombreEnfants(int nombreEnfants) {
        this.nombreEnfants = nombreEnfants;
    }
}
