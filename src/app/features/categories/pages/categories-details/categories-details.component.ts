import { CategoryService } from './../../../../core/services/category.service';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/ui/section-header/section-header.component';
import { Category, Subcategory } from '../../../../core/models/product.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SectionCardComponent } from '../../../../shared/ui/section-card/section-card.component';

@Component({
  imports: [SectionHeaderComponent, RouterLink, DatePipe, SectionCardComponent],
  selector: 'app-categories-details',
  styleUrl: './categories-details.component.css',
  templateUrl: './categories-details.component.html',
})
export class CategoriesDetailsComponent implements OnInit{

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  category = signal<Category>({} as Category);
  allSubCategories = signal<Category[]> ([]);

  ngOnInit(): void {
    this.getCategory();
    
  }

  getCategory() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getCategorybyId(params.get('id')!);
      this.getSubcategories(params.get('id')!);
    })
  }

  getCategorybyId(catId:string) {
    this.categoryService.getSpecificCategory(catId).subscribe({
      next : (res) => {
        this.category.set(res.data);
        
      }
    })
  }
  getSubcategories(catId:string) {
    this.categoryService.getSubCategories(catId).subscribe({
      next : (res)=> {
        console.log(res.data)
        this.allSubCategories.set(res.data);
      }
    })
  }

  
}
