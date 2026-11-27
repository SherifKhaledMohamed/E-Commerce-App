import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { register } from 'swiper/element/bundle';
import { AuthService } from './features/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Product } from './core/models/product.interface';
import { CartService } from './core/services/cart.service';

@Component({
  imports: [RouterOutlet, NgxSpinnerComponent,FooterComponent,NavbarComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('e-commerceapp');
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  ngOnInit(): void {
    if(isPlatformBrowser(this.pLATFORM_ID)) {
      if(localStorage.getItem('token')) {
        this.authService.isLogged.set(true)
      }
    register();
  }
}
}
