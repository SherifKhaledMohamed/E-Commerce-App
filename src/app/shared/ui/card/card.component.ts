import { Component, inject, input, signal } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-card',
  styleUrl: './card.component.css',
  templateUrl: './card.component.html',
})
export class CardComponent {
  product = input.required<Product>();
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  
  

  roundRating(rating:number):number {
    return Math.round(rating);
  }

  addToCart() {
  if (localStorage.getItem('token')) {
    this.cartService.addToCart(this.product()._id).subscribe({
      next: (res) => {
        this.toastrService.success('Item added to your Cart');
        this.cartService.cartItems.set(res.numOfCartItems);
      }
    });
  } else {
    const currentProduct = this.product();
    const rawCart = localStorage.getItem('guestCart');
    const guestCart: Array<{
      count: number;
      price: number;
      product: typeof currentProduct;
      productId: string;
    }> = rawCart ? JSON.parse(rawCart) : [];

    const existingItem = guestCart.find((item) => item.productId === this.product()._id);
    

    if (existingItem) {
      existingItem.count = existingItem.count + 1
      const itemIndex = guestCart.indexOf(existingItem);

      guestCart.splice(itemIndex,1,existingItem);
    } else {
      guestCart.push({
        count: 1,
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
addToWishlist(id:string) {
  this.wishlistService.addToWishlist({productId:id}).subscribe({
    next: (res) => {
      console.log(res);
      this.toastrService.success('Wishlist has been updated!')
    }
  })
}
}
