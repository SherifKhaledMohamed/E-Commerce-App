import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ShopService } from '../../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { sign } from 'crypto';
import { Product } from '../../../../core/models/product.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-shop-details',
  styleUrl: './shop-details.component.css',
  templateUrl: './shop-details.component.html',
})
export class ShopDetailsComponent implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly activatedRoute = inject(ActivatedRoute);

  product = signal<Product>({} as Product);


  ngOnInit(): void {
    this.getProduct();
  }


  getProduct() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getProductDetails(params.get('id')!);
    })
  }

  getProductDetails(id:string) {
    this.shopService.GetSpecificProduct(id).subscribe({
      next: (res) => {
        console.log(res.data)
        this.product.set(res.data);
      }
    })
  }

  roundRating(rating:number):number {
    return Math.round(rating);
  }
}
