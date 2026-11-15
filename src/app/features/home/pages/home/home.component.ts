import { Component } from '@angular/core';
import { SliderComponent } from '../../components/slider/slider.component';
import { CategoriesComponent } from '../../../categories/pages/categories/categories.component';
import { CategorySectionComponent } from '../../components/category-section/category-section.component';
import { ProductSectionComponent } from '../../components/product-section/product-section.component';

@Component({
  imports: [SliderComponent,CategorySectionComponent,ProductSectionComponent],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {}
