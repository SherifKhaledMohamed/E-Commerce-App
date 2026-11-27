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
  productCount = signal(1);
  totalPrice = computed(() => this.product().price * this.productCount());

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

  addToCart(productId: string) {
  if (localStorage.getItem('token')) {
    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.cartItems.set(res.numOfCartItems);
        if (this.productCount() > 1) {
          this.updateCartQuantity(productId);
        }
        this.toastrService.success('Item added to your Cart');
      }
    });
  } else {
    const currentProduct = this.product();
    const addedCount = this.productCount();
    const rawCart = localStorage.getItem('guestCart');
    const guestCart: Array<{
      count: number;
      price: number;
      product: typeof currentProduct;
      productId: string;
    }> = rawCart ? JSON.parse(rawCart) : [];

    const existingItem = guestCart.find((item) => item.productId === productId);
    

    if (existingItem) {
      existingItem.count = existingItem.count + addedCount;
      const itemIndex = guestCart.indexOf(existingItem);

      guestCart.splice(itemIndex,1,existingItem);
    } else {
      guestCart.push({
        count: addedCount,
        price: currentProduct.price,
        product: currentProduct,
        productId: currentProduct._id,
      });
    }
    this.cartService.cartItems.set(guestCart.length);
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    this.toastrService.success('Item added to your Cart');
  }
}
  updateCartQuantity(productId:string) {
    this.cartService.updateCartQuantities(productId,this.productCount()).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }

  addToWishlist(productId:string) {
    
  }
}
