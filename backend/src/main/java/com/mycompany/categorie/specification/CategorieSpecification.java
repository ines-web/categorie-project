package com.mycompany.categorie.specification;
import com.mycompany.categorie.domain.Categorie;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
public class CategorieSpecification {

    public static Specification<Categorie> estRacine(Boolean estRacine) {
        return (root, query, criteriaBuilder) ->
            estRacine == null ? null : criteriaBuilder.equal(root.get("estRacine"), estRacine);
    }

        public static Specification<Categorie> dateCreationApres(LocalDate date) {
            return (root, query, criteriaBuilder) ->
                date == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("creation_date"), date);
        }

        public static Specification<Categorie> dateCreationAvant(LocalDate date) {
            return (root, query, criteriaBuilder) ->
                date == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("creation_date"), date);
        }

        public static Specification<Categorie> dateCreationEntre(LocalDate debut, LocalDate fin) {
            return (root, query, criteriaBuilder) ->
                (debut == null || fin == null) ? null : criteriaBuilder.between(root.get("creation_date"), debut, fin);
        }
    }
