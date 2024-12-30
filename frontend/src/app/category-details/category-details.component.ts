import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../category/category.service';
import { CategorieDTO } from '../category/categorie-dto.model';
import { CommonModule } from '@angular/common'; 
import { ErrorService } from '../error-popup/error.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {
  public category: CategorieDTO = {} as CategorieDTO;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService
    , private errorService: ErrorService) {} 

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCategory(+id);
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe(
      (data: CategorieDTO) => {
        this.category = data;
      },
      (error) => {
        this.errorService.errorEvent("Erreur lors du chargement de la catégorie");
      }
    );
  }
}