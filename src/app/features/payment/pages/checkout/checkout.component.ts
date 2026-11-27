import { Subcategory } from './../../../../core/models/product.interface';
import { CurrencyPipe } from '@angular/common';
import { cart, productOfCart } from './../../../../core/models/cart.interface';
import { CartService } from './../../../../core/services/cart.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { OrdersService } from '../../services/orders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  imports: [RouterLink,CurrencyPipe,ReactiveFormsModule],
  selector: 'app-checkout',
  styleUrl: './checkout.component.css',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly ordersService = inject(OrdersService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  userCart = signal<cart|null>(null);
  userCartProducts = signal<productOfCart[]>([]);
  paymentMethod = signal('cash');

  checkoutForm = this.formBuilder.group({
    shippingAddress:this.formBuilder.group({
      details:['',[Validators.required]],
      phone:['',[Validators.required]],
      city:['',[Validators.required]]
    })
  })


  ngOnInit(): void {
    this.getUserCart();
  }

  getUserCart() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res)
        this.userCart.set(res);
        this.userCartProducts.set(res.data.products)
      }
    })
  }

  submitOrderForm() {
    if(this.paymentMethod() === 'cash') {
      this.ordersService.cashOrder(this.userCart()?.cartId!,this.checkoutForm.value).subscribe({
        next: (res) => {
          this.cartService.cartItems.set(0);
          this.toastrService.success('Order has been placed successfully!');
          this.router.navigate(['/']);
        }
      })
    }
    else {
      this.ordersService.visaOrderCheckout(this.userCart()?.cartId!,this.checkoutForm.value).subscribe({
        next: (res) => {
          this.cartService.cartItems.set(0);
          this.toastrService.success('Order has been placed successfully!');

          window.open(res.session.url, '_self');
        }
      })
    }
  }
}
