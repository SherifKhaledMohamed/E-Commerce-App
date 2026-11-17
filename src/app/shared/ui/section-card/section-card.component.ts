import { Component, input } from '@angular/core';
import { Category, Subcategory } from '../../../core/models/product.interface';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-section-card',
  styleUrl: './section-card.component.css',
  templateUrl: './section-card.component.html',
})
export class SectionCardComponent {
  cardInput = input.required<Category>();
}
