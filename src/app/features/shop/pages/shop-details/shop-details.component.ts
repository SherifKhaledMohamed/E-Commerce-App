import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input, OnInit, signal } from '@angular/core';
import { ShopService } from '../../../../core/services/shop.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.interface';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../../core/services/cart.service';
import { nextTick } from 'process';
import { ToastrService } from 'ngx-toastr';
import { count } from 'console';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-shop-details',
  styleUrl: './shop-details.component.css',
  templateUrl: './shop-details.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShopDetailsComponent implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);


  product = signal<Product>({} as Product);
  proudctCount = signal(1);
  totalPrice = computed(() => this.product().price * this.proudctCount());

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

  addToCart(productId:string) {
    if(localStorage.getItem('token')) {
      this.cartService.addToCart(productId).subscribe({
        next: (res) => {
          console.log(res);
          if(this.proudctCount() > 1 ) {
            this.updateCartQuantity(productId);
          }
          this.toastrService.success('Item added to your Cart');
        }
      })
    }

    else {
      let localStorageCart:Array<{count: number;
      price: number;
      product: Product
      productId: string;}> = JSON.parse(localStorage.getItem('guestCart')!);

      if(localStorageCart) {
        if(localStorageCart.find((item) => item.productId === productId)) {
          
        }

        localStorageCart.push({
          count: this.proudctCount(),
          price:this.product().price,
          product:this.product(),
          productId:this.product()._id, 
        })
      }

      else {
        localStorage.setItem('guestCart',JSON.stringify(
          [{
            count: this.proudctCount(),
            price:this.product().price,
            product:this.product(),
            productId:this.product()._id, 
          }]
        ))
      }

    }
  }
  updateCartQuantity(productId:string) {
    this.cartService.updateCartQuantities(productId,this.proudctCount()).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }

  addToWishlist(productId:string) {
    
  }
}
