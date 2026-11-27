import { count } from 'console';
import { cart, cartProduct, GuestCartItem, productOfCart } from './../../../../core/models/cart.interface';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { ShopService } from '../../../../core/services/shop.service';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  imports: [RouterLink,CurrencyPipe],
  selector: 'app-cart',
  styleUrl: './cart.component.css',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly shopService = inject(ShopService);
  private readonly toastrService = inject(ToastrService);
  private readonly authService = inject(AuthService);

  userCartProducts = signal<productOfCart[]>([]);
  userCart = signal<cart|null>(null);
    canCheckOut = computed(() => this.userCartProducts().length > 0)

  isLogged = computed(() => this.authService.isLogged())

  ngOnInit(): void {
    this.getUserCart();
  }

  getUserCart() {
    if(this.isLogged()) {
      this.cartService.getLoggedUserCart().subscribe({
        next: (res) => {
          this.userCart.set(res);
          this.userCartProducts.set(res.data.products)
        }
        });
    }
    else {
      this.loadGuestCart();
    }
  }


  loadGuestCart(): void {
    const rawCart = localStorage.getItem('guestCart');
    const guestItems: GuestCartItem[] = rawCart ? JSON.parse(rawCart) : [];

    if (guestItems.length === 0) {
      this.userCart.set(null);
      this.userCartProducts.set([]);
      return;
    }

    const mappedProducts: productOfCart[] = guestItems.map((item, index) => ({
      _id: item.product._id,
      count: item.count,
      price: item.price ?? item.product.price,
      product: item.product,
    }));

    const totalCartPrice = mappedProducts.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    const totalQuantity = mappedProducts.reduce(
      (sum, item) => sum + item.count,
      0
    );

    this.userCartProducts.set(mappedProducts);
    this.userCart.set({
      status: 'success',
      message: 'Guest cart loaded',
      numOfCartItems: totalQuantity,
      cartId: 'guest',
      data: {
        _id: 'guest',
        cartOwner: 'guest',
        products: [],
        createdAt: '',
        updatedAt: '',
        __v: 0,
        totalCartPrice,
      },
    });
  }


  clearAllItems(): void {
    if (!this.isLogged()) {
      localStorage.removeItem('guestCart');
      this.cartService.cartItems.set(0);
      this.userCart.set(null);
      this.userCartProducts.set([]);
      this.toastrService.success('All Cart Items Cleared Successfully', 'Fresh Cart');
      return;
    }


    this.cartService.clearAllCartItems().subscribe({
      next: () => {
        this.toastrService.success('All Cart Items Cleared Successfully', 'Fresh Cart');
        this.cartService.cartItems.set(0);
        this.userCart.set(null);
        this.userCartProducts.set([]);
      },
    });
  }

  updateItemQuantity(itemP:productOfCart,count:number): void {
    if(this.isLogged()) {
      this.cartService.updateCartQuantities(itemP.product._id,count).subscribe({
        next: (res) => {
          this.userCart.set(res);
            this.userCartProducts.set(res.data.products)
        }
      })
    }
    else {
      const currentProduct = itemP.product;
    const rawCart = localStorage.getItem('guestCart');
    const guestCart: Array<{
      count: number;
      price: number;
      product: typeof currentProduct;
      productId: string;
    }> = rawCart ? JSON.parse(rawCart) : [];

    const existingItem = guestCart.find((item) => item.productId === itemP.product._id);
    

    if (existingItem) {
      existingItem.count = count;
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
    this.toastrService.success('Cart has been updated');

    this.loadGuestCart();
    }


  }
}
