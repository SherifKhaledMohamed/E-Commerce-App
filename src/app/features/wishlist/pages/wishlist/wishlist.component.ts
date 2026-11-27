import { Component, inject, OnInit, signal } from '@angular/core';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { Product } from '../../../../core/models/product.interface';
import { SectionHeaderComponent } from '../../../../shared/ui/section-header/section-header.component';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  imports: [SectionHeaderComponent,RouterLink],
  selector: 'app-wishlist',
  styleUrl: './wishlist.component.css',
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit{
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);
      wishlistProducts = signal<Product[]>([]);


  ngOnInit(): void {
    this.getUserWishlist()
  }

  getUserWishlist(){
    this.wishlistService.getUserWishlist().subscribe({
      next: (res) => {
        this.wishlistProducts.set(res.data);
      }
    })
  }
  removeFromWishlist(id:string){
    this.wishlistService.removeFromWishlist(id).subscribe({
      next:(res) => {
        this.getUserWishlist();
        this.toastrService.success('Wishlist has been updated!');
      }
    })
  }
  addToCart(product:Product) {
  if (localStorage.getItem('token')) {
    this.cartService.addToCart(product._id).subscribe({
      next: (res) => {
        this.toastrService.success('Item added to your Cart');
        this.cartService.cartItems.set(res.numOfCartItems);
      }
    });
  } else {
    const currentProduct = product;
    const rawCart = localStorage.getItem('guestCart');
    const guestCart: Array<{
      count: number;
      price: number;
      product: typeof currentProduct;
      productId: string;
    }> = rawCart ? JSON.parse(rawCart) : [];

    const existingItem = guestCart.find((item) => item.productId === product._id);
    

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
}
