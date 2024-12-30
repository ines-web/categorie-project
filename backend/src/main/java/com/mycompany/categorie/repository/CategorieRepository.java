package com.mycompany.categorie.repository;

import com.mycompany.categorie.domain.Categorie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // Ajout de cet import
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Categorie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> , JpaSpecificationExecutor<Categorie>{

    @Query("SELECT c FROM Categorie c LEFT JOIN FETCH c.categories WHERE c.pidParent IS NULL")
    Page<Categorie> findRootCategoriesWithChildren(Pageable pageable);

    @Modifying
    @Query("UPDATE Categorie c SET c.pidParent = null WHERE c.pidParent.id = :parentId")
    void detachChildCategories(Long parentId);
}


