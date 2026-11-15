import { Component, input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-card',
  styleUrl: './card.component.css',
  templateUrl: './card.component.html',
})
export class CardComponent {
  product = input.required<Product>();


  roundRating(rating:number):number {
    return Math.round(rating);
  }
}
