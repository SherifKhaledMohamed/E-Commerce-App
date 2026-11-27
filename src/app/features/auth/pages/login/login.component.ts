import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../../../core/models/product.interface';
import { CartService } from '../../../../core/services/cart.service';
import { cart } from '../../../../core/models/cart.interface';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly pLATFORM_ID = inject(PLATFORM_ID)

  userCart = signal<cart|null>(null);

  loginForm = this.fb.group({
    email: ['',[Validators.required,Validators.email]],
    password: ['',[Validators.required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
  });



  submitForm() {
    if(this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe({
        next:(res) => {
          if(res.message.includes('success')) {
            if(isPlatformBrowser(this.pLATFORM_ID)) {
              localStorage.setItem('token',res.token);
              localStorage.setItem('user',JSON.stringify(res.user))
            }
            this.authService.isLogged.set(true);
            this.updateLoggedCart();
            this.router.navigate(['/']);
          }
        }
      })
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }

  getUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next : (res) => {
        if(res.numOfCartItems > 0) {
          this.userCart.set(res);
        }
      }
      })
  }

  updateLoggedCart() {
    if(localStorage.getItem('guestCart')) {
    const rawCart = localStorage.getItem('guestCart');
    const guestCart: Array<{
      count: number;
      price: number;
      product: Product;
      productId: string;
    }> = rawCart ? JSON.parse(rawCart) : [];


    if(guestCart.length > 0) {
        guestCart.forEach(productOrder => {
          const availableRealCartProduct = this.userCart()?.data.products.find((item) => item._id === productOrder.product._id);
          if(availableRealCartProduct) {
            if(availableRealCartProduct.count < productOrder.count ) {
              this.cartService.updateCartQuantities(productOrder.product._id,productOrder.count).subscribe({
                  next: (res) => {
                    this.cartService.cartItems.set(res.numOfCartItems)
                  }
                })
            }
          }
          else {
            this.cartService.addToCart(productOrder.product._id).subscribe({
              next:(res) => {
                console.log(res);
                this.cartService.cartItems.set(res.numOfCartItems);
                if(productOrder.count > 1) {
                  this.cartService.updateCartQuantities(productOrder.product._id,productOrder.count).subscribe({
                    next: (res) => {
                      console.log(res);
                    }
                  })
                }
              }})
          }
        });
        localStorage.removeItem('guestCart');
      }
    }
    
  }
}
