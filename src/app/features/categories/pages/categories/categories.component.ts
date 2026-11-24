import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/ui/section-header/section-header.component';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/product.interface';
import { RouterLink } from '@angular/router';

@Component({
  imports: [SectionHeaderComponent,RouterLink],
  selector: 'app-categories',
  styleUrl: './categories.component.css',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  allCategories = signal<Category[]>([]);

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.allCategories.set(res.data);
      }
    })
  }
}
