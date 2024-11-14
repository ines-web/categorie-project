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

/**
 * REST controller for managing {@link com.mycompany.categorie.domain.Categorie}.
 */
@RestController
@RequestMapping("/api/categories")
@Transactional
@CrossOrigin(origins = "http://localhost:4200")
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
    @PutMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorie(
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
        Categorie existingCategorie = existingCategorieOpt.get();

        if (categorie.getNom() != null) {
            existingCategorie.setNom(categorie.getNom());
        }

        if (categorie.getPidParent() != null) {
            Optional<Categorie> parentCategorieOpt = categorieRepository.findById(categorie.getPidParent().getId());
            if (parentCategorieOpt.isPresent()) {
                existingCategorie.setPidParent(parentCategorieOpt.get());
            } else {
                throw new BadRequestAlertException("Parent Categorie not found", ENTITY_NAME, "parentidnotfound");
            }
        } else {
            existingCategorie.setPidParent(null); // Supprimer le parent s'il est défini à null
        }

        categorie = categorieRepository.save(existingCategorie);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, categorie.getId().toString()))
            .body(categorie);
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





    ////// mes inventions

    //ECAT20
    // URL : PUT /api/categories/{childId}/parent/{parentId}

    @PutMapping("/{childId}/parent/{parentId}")
    public ResponseEntity<Categorie> associateChildToParent(
        @PathVariable Long childId,
        @PathVariable Long parentId
    ) {
        LOG.debug("REST request to associate Categorie child : {} with parent : {}", childId, parentId);

        // Vérifier si les deux catégories existent
        Optional<Categorie> childCategorieOpt = categorieRepository.findById(childId);
        Optional<Categorie> parentCategorieOpt = categorieRepository.findById(parentId);

        if (childCategorieOpt.isEmpty() || parentCategorieOpt.isEmpty()) {
            throw new BadRequestAlertException("Parent or Child Categorie not found", ENTITY_NAME, "idnotfound");
        }

        // Associer la catégorie parent à la catégorie enfant
        Categorie childCategorie = childCategorieOpt.get();
        Categorie parentCategorie = parentCategorieOpt.get();
        childCategorie.setPidParent(parentCategorie);

        // Sauvegarder la catégorie enfant avec son parent
        categorieRepository.save(childCategorie);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, childCategorie.getId().toString()))
            .body(childCategorie);
    }


    /// ECAT30
    // URL : PATCH /api/categories/{id}

    @PatchMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorieFields(
        @PathVariable Long id,
        @RequestBody Categorie categorieDetails
    ) {
        LOG.debug("REST request to partially update Categorie : {}", id);

        // Vérifiez que l'ID du corps de la requête n'est pas nul
        if (categorieDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        Optional<Categorie> existingCategorieOpt = categorieRepository.findById(id);

        if (existingCategorieOpt.isEmpty()) {
            throw new BadRequestAlertException("Categorie not found", ENTITY_NAME, "idnotfound");
        }

        Categorie existingCategorie = existingCategorieOpt.get();

        // Mettre à jour le nom si un nouveau nom est fourni
        if (categorieDetails.getNom() != null) {
            existingCategorie.setNom(categorieDetails.getNom());
        }

        // Mettre à jour la catégorie parent si un nouvel ID parent est fourni
        if (categorieDetails.getPidParent() != null && categorieDetails.getPidParent().getId() != null) {
            Optional<Categorie> parentCategorieOpt = categorieRepository.findById(categorieDetails.getPidParent().getId());
            if (parentCategorieOpt.isEmpty()) {
                throw new BadRequestAlertException("Parent Categorie not found", ENTITY_NAME, "parentidnotfound");
            }
            existingCategorie.setPidParent(parentCategorieOpt.get());
        }

        // Sauvegarder la catégorie mise à jour
        Categorie updatedCategorie = categorieRepository.save(existingCategorie);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, existingCategorie.getId().toString()))
            .body(updatedCategorie);
    }

    @GetMapping("/potential-parents/{childId}")
    public ResponseEntity<List<CategorieDTO>> getPotentialParents(@PathVariable Long childId) {
        LOG.debug("REST request to get potential parent categories for child: {}", childId);

        List<Categorie> allCategories = categorieRepository.findAll();
        Categorie childCategorie = categorieRepository.findById(childId)
            .orElseThrow(() -> new BadRequestAlertException("Child category not found", ENTITY_NAME, "idnotfound"));

        List<CategorieDTO> potentialParents = allCategories.stream()
            .filter(cat -> !isDescendantOf(cat, childCategorie) && !cat.getId().equals(childId))
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok().body(potentialParents);
    }

    private boolean isDescendantOf(Categorie potentialParent, Categorie child) {
        Categorie current = child;
        while (current.getPidParent() != null) {
            if (current.getPidParent().getId().equals(potentialParent.getId())) {
                return true;
            }
            current = current.getPidParent();
        }
        return false;
    }
    @PutMapping("/{childId}/dissociate")
    public ResponseEntity<Categorie> dissociateChildFromParent(@PathVariable Long childId) {
        LOG.debug("REST request to dissociate Categorie child : {} from its parent", childId);

        Optional<Categorie> childCategorieOpt = categorieRepository.findById(childId);

        if (childCategorieOpt.isEmpty()) {
            throw new BadRequestAlertException("Child Categorie not found", ENTITY_NAME, "idnotfound");
        }

        Categorie childCategorie = childCategorieOpt.get();
        childCategorie.setPidParent(null);

        categorieRepository.save(childCategorie);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, childCategorie.getId().toString()))
            .body(childCategorie);
    }

}
