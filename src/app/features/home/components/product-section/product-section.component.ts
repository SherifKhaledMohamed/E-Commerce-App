import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent } from '../../../../shared/ui/section-title/section-title.component';
import { ShopService } from '../../../../core/services/shop.service';
import { Product } from '../../../../core/models/product.interface';
import { CurrencyPipe } from '@angular/common';
import { CardComponent } from '../../../../shared/ui/card/card.component';

@Component({
  imports: [SectionTitleComponent,CardComponent],
  selector: 'app-product-section',
  styleUrl: './product-section.component.css',
  templateUrl: './product-section.component.html',
})
export class ProductSectionComponent implements OnInit{
  private readonly shopService = inject(ShopService);
  allProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts() {
    this.shopService.GetAllProducts().subscribe({
      next: (res) => {
        this.allProducts.set(res.data);
      }
    })
  }
}
