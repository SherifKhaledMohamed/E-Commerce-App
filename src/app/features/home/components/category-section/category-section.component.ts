import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent } from '../../../../shared/ui/section-title/section-title.component';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/product.interface';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [SectionTitleComponent, RouterLink, RouterLinkActive],
  selector: 'app-category-section',
  styleUrl: './category-section.component.css',
  templateUrl: './category-section.component.html',
})
export class CategorySectionComponent implements OnInit {

  ngOnInit(): void {
    this.getAllCategories();
  }

  private readonly categoryService = inject(CategoryService);
  allCategories = signal<Category[]>([]);

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.allCategories.set(res.data);
      }
    })
  }
}
