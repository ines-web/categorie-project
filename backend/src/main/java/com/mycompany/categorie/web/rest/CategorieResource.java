package com.mycompany.categorie.web.rest;

import com.mycompany.categorie.domain.Categorie;
import com.mycompany.categorie.exception.ResourceNotFoundException;
import com.mycompany.categorie.service.dto.CategorieDTO;
import com.mycompany.categorie.repository.CategorieRepository;
import com.mycompany.categorie.specification.CategorieSpecification;
import com.mycompany.categorie.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;


/**
 * REST controller for managing {@link com.mycompany.categorie.domain.Categorie}.
 */
@RestController
@RequestMapping("/api/categories")
@Transactional
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Gestion des Catégories", description = "API pour gérer les catégories (création, modification, suppression, recherche, association)")
public class CategorieResource {

    private static final Logger LOG = LoggerFactory.getLogger(CategorieResource.class);

    private static final String ENTITY_NAME = "categorie";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategorieRepository categorieRepository;

    public CategorieResource(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    /**
     * {@code POST  /categories} : Create a new categorie.
     *
     * @param categorie the categorie to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categorie, or with status {@code 400 (Bad Request)} if the categorie has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Operation(summary = "Créer une nouvelle catégorie",
        description = "Permet de créer une nouvelle catégorie. Les informations obligatoires incluent le nom de la catégorie .")
    @PostMapping("")
    public ResponseEntity<Categorie> createCategorie(@Valid @RequestBody Categorie categorie) throws URISyntaxException {
        LOG.debug("REST request to save Categorie : {}", categorie);

        if (categorie.getId() != null) {
            throw new BadRequestAlertException("A new categorie cannot already have an ID", ENTITY_NAME, "idexists");
        }

        // Ensure creation_date is set to the current date if not already provided
        if (categorie.getCreation_date() == null) {
            categorie.setCreation_date(LocalDate.now());
        }

        // Save the category
        categorie = categorieRepository.save(categorie);

        return ResponseEntity.created(new URI("/api/categories/" + categorie.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, categorie.getId().toString()))
            .body(categorie);
    }

    /**
     * {@code PUT  /categories/:id} : Updates an existing categorie.
     *
     * @param id the id of the categorie to save.
     * @param categorie the categorie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categorie,
     * or with status {@code 400 (Bad Request)} if the categorie is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categorie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Operation(summary = "Mettre à jour une catégorie existante",
        description = "Permet de modifier les champs d'une catégorie existante en fournissant un identifiant valide. Le système vérifie si la catégorie existe.")
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateCategorie(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Categorie categorie
    ) throws URISyntaxException {
        LOG.debug("REST request update Categorie : {}, {}", id, categorie);

        if (categorie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        if (!Objects.equals(id, categorie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!categorieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Categorie> existingCategorieOpt = categorieRepository.findById(id);
        if (existingCategorieOpt.isEmpty()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Categorie existingCategorie = categorieRepository.findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));

        if (categorie.getNom() != null) {
            existingCategorie.setNom(categorie.getNom());
        }

        if (categorie.getPidParent() != null) {
            Categorie parentCategorie = categorieRepository.findById(categorie.getPidParent().getId())
                .orElseThrow(() -> new BadRequestAlertException("Parent Categorie not found", ENTITY_NAME, "parentidnotfound"));
            existingCategorie.setPidParent(parentCategorie);
        } else {
            existingCategorie.setPidParent(null);
        }

        categorieRepository.save(existingCategorie);

        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code PATCH  /categories/:id} : Partial updates given fields of an existing categorie, field will ignore if it is null
     *
     * @param id the id of the categorie to save.
     * @param categorie the categorie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categorie,
     * or with status {@code 400 (Bad Request)} if the categorie is not valid,
     * or with status {@code 404 (Not Found)} if the categorie is not found,
     * or with status {@code 500 (Internal Server Error)} if the categorie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @Operation(summary = "Mettre à jour partiellement une catégorie",
        description = "Permet de modifier certains champs d'une catégorie existante. Les champs non spécifiés conserveront leurs valeurs actuelles.")
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Categorie> partialUpdateCategorie(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Categorie categorie
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Categorie partially : {}, {}", id, categorie);
        if (categorie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, categorie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!categorieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Categorie> result = categorieRepository
            .findById(categorie.getId())
            .map(existingCategorie -> {
                if (categorie.getNom() != null) {
                    existingCategorie.setNom(categorie.getNom());
                }

                return existingCategorie;
            })
            .map(categorieRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, categorie.getId().toString())
        );
    }

    /**
     * {@code GET  /categories} : get all the categories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categories in body.
     */
    @Operation(summary = "Lister toutes les catégories",
        description = """
               Permet de rechercher des catégories avec plusieurs filtres :
               - Si elles sont des catégories racines (estRacine)
               - La date de création (après, avant, ou entre deux dates)
               Possibilité de paginer et trier les résultats par nom, date ou nombre d'enfants.
               """)
    @GetMapping("")
    public ResponseEntity<List<CategorieDTO>> getAllCategories(
        @RequestParam(required = false) Boolean estRacine,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateCreationApres,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateCreationAvant,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateCreationDebut,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateCreationFin,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(defaultValue = "dateCreation") String sortBy, // Paramètre pour le tri
        @RequestParam(defaultValue = "asc") String sortDirection
    ) {
        LOG.debug("REST request to get a page of Categories with filters");


        Specification<Categorie> spec = Specification.where(null);


        if (dateCreationApres != null) {
            spec = spec.and(CategorieSpecification.dateCreationApres(dateCreationApres));
        }


        if (dateCreationAvant != null) {
            spec = spec.and(CategorieSpecification.dateCreationAvant(dateCreationAvant));
        }


        if (dateCreationDebut != null && dateCreationFin != null) {
            spec = spec.and(CategorieSpecification.dateCreationEntre(dateCreationDebut, dateCreationFin));
        }


        Page<Categorie> page = categorieRepository.findAll(spec, pageable);


        List<CategorieDTO> categorieDTOs = page.getContent().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());


        // Filtrage post-requête pour estRacine
        if (estRacine != null) {
            categorieDTOs = categorieDTOs.stream()
                .filter(dto -> dto.isEstRacine() == estRacine)
                .collect(Collectors.toList());
        }


        if ("nombreEnfants".equals(sortBy)) {
            Comparator<CategorieDTO> comparator = "desc".equals(sortDirection) ?
                Comparator.comparing(CategorieDTO::getNombreEnfants).reversed() :
                Comparator.comparing(CategorieDTO::getNombreEnfants);


            categorieDTOs.sort(comparator);
        } else {
            // Tri sur d'autres attributs comme "dateCreation"
            if ("desc".equals(sortDirection)) {
                categorieDTOs.sort(Comparator.comparing(CategorieDTO::getDateCreation).reversed());
            } else {
                categorieDTOs.sort(Comparator.comparing(CategorieDTO::getDateCreation));
            }
        }


        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(categorieDTOs);
    }

    // Convertir une catégorie en CategorieDTO
    private CategorieDTO convertToDTO(Categorie categorie) {
        CategorieDTO categorieDTO = new CategorieDTO();
        categorieDTO.setId(categorie.getId());
        categorieDTO.setNom(categorie.getNom());
        categorieDTO.setDateCreation(categorie.getCreation_date());

        // Vérifier si la catégorie est une catégorie racine
        categorieDTO.setEstRacine(categorie.getPidParent() == null);

        // Récupérer les catégories enfants et leur nombre
        Set<CategorieDTO> childrenDTOs = categorie.getCategories().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toSet());
        categorieDTO.setCategoriesEnfants(childrenDTOs);
        categorieDTO.setNombreEnfants(childrenDTOs.size());

        return categorieDTO;
    }
    @Operation(summary = "Récupérer une catégorie par ID",
        description = "Permet de récupérer les détails d'une catégorie par son identifiant unique. Les relations parent/enfant sont incluses.")
    @GetMapping("/{id}")
    public ResponseEntity<CategorieDTO> getCategorieById(@PathVariable Long id) {
        LOG.debug("REST request to get Category by ID : {}", id);

        // Récupérer la catégorie par son ID
        Categorie categorie = categorieRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("La catégorie avec l'ID " + id + " n'existe pas."));

        // Convertir la catégorie en DTO
        CategorieDTO categorieDTO = convertToDTO(categorie);

        return ResponseEntity.ok(categorieDTO);
    }



    /**
     * {@code DELETE  /categories/:id} : delete the "id" categorie.
     *
     * @param id the id of the categorie to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @Operation(summary = "Supprimer une catégorie",
        description = "Permet de supprimer une catégorie existante par son identifiant. Les relations parent/enfant sont prises en compte.")
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Categorie : {}", id);


        Categorie categorie = categorieRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("La catégorie avec l'ID " + id + " n'existe pas."));

        // Détacher les catégories enfants
        categorieRepository.detachChildCategories(id);

        // Supprimer la catégorie
        categorieRepository.deleteById(id);

        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }




    @Operation(summary = "Associer une catégorie enfant à un parent",
        description = "Permet d'associer une catégorie enfant à une catégorie parent en vérifiant les contraintes d'héritage.")
    @PutMapping("/{childId}/parent/{parentId}")
    public ResponseEntity<Categorie> associateChildToParent(
        @PathVariable Long childId,
        @PathVariable Long parentId
    ) {
        LOG.debug("REST request to associate Categorie child : {} with parent : {}", childId, parentId);

        Categorie childCategorie = categorieRepository.findById(childId)
            .orElseThrow(() -> new BadRequestAlertException("Child Categorie not found", ENTITY_NAME, "childidnotfound"));

        Categorie parentCategorie = categorieRepository.findById(parentId)
            .orElseThrow(() -> new BadRequestAlertException("Parent Categorie not found", ENTITY_NAME, "parentidnotfound"));

        // Vérification des contraintes d'héritage
        if (isDescendantOf(parentCategorie, childCategorie)) {
            throw new BadRequestAlertException(
                "Cannot set a descendant as a parent",
                ENTITY_NAME,
                "invalid_parent_hierarchy"
            );
        }

        // Vérification qu'une catégorie ne peut pas être son propre parent
        if (childId.equals(parentId)) {
            throw new BadRequestAlertException(
                "A category cannot be its own parent",
                ENTITY_NAME,
                "self_parent_not_allowed"
            );
        }

        childCategorie.setPidParent(parentCategorie);
        categorieRepository.save(childCategorie);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, childCategorie.getId().toString()))
            .body(childCategorie);
    }

    @Operation(summary = "Lister les parents potentiels pour une catégorie enfant",
        description = "Permet de récupérer toutes les catégories qui peuvent devenir le parent d'une catégorie donnée.")
    @GetMapping("/potential-parents/{childId}")
    public ResponseEntity<List<CategorieDTO>> getPotentialParents(@PathVariable Long childId) {
        LOG.debug("REST request to get potential parent categories for child: {}", childId);

        Categorie childCategorie = categorieRepository.findById(childId)
            .orElseThrow(() -> new BadRequestAlertException("Child category not found", ENTITY_NAME, "idnotfound"));

        List<Categorie> allCategories = categorieRepository.findAll();

        List<CategorieDTO> potentialParents = allCategories.stream()
            .filter(cat ->
                !cat.getId().equals(childId) && // Exclure la catégorie elle-même
                    !isDescendantOf(cat, childCategorie) && // Exclure les descendants
                    !isDescendantOf(childCategorie, cat) // Exclure les ancêtres
            )
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok().body(potentialParents);
    }

    private boolean isDescendantOf(Categorie potentialAncestor, Categorie child) {
        Categorie current = child;
        while (current.getPidParent() != null) {
            if (current.getPidParent().getId().equals(potentialAncestor.getId())) {
                return true;
            }
            current = current.getPidParent();
        }
        return false;
    }

    @Operation(summary = "Dissocier une catégorie enfant de son parent",
        description = "Permet de dissocier une catégorie enfant de sa catégorie parent associée.")

    @PutMapping("/{childId}/dissociate")
    public ResponseEntity<Categorie> dissociateChildFromParent(@PathVariable Long childId) {
        LOG.debug("REST request to dissociate Categorie child : {} from its parent", childId);

        Categorie childCategorie = categorieRepository.findById(childId)
            .orElseThrow(() -> new BadRequestAlertException("Child Categorie not found", ENTITY_NAME, "idnotfound"));

        childCategorie.setPidParent(null);
        categorieRepository.save(childCategorie);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, childCategorie.getId().toString()))
            .body(childCategorie);
    }

}
