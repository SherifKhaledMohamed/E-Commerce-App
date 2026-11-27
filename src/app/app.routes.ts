import { Routes } from '@angular/router';
import { loggedGuard } from './core/guard/logged-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/pages/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./features/brands/pages/brands/brands.component').then((m) => m.BrandsComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/pages/categories/categories.component').then(
        (m) => m.CategoriesComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    canActivate:[loggedGuard],
    loadComponent: () =>
      import('./features/payment/pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'orders',
    canActivate:[loggedGuard],
    loadComponent: () =>
      import('./features/payment/pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'whishlist',
    loadComponent: () =>
      import('./features/wishlist/pages/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent,
      ),
  },
  {
    path: 'forget',
    loadComponent: () =>
      import('./features/auth/pages/forgetpassword/forgetpassword.component').then(
        (m) => m.ForgetpasswordComponent,
      ),
  },
  {
    path: 'shop/:slug/:id',
    loadComponent: () =>
      import('./features/shop/pages/shop-details/shop-details.component').then(
        (m) => m.ShopDetailsComponent,
      ),
  },
  {
    path: 'categories/:slug/:id',
    loadComponent: () =>
      import('./features/categories/pages/categories-details/categories-details.component').then(
        (m) => m.CategoriesDetailsComponent,
      ),
  },
  {
    path: 'brands/:slug/:id',
    loadComponent: () =>
      import('./features/brands/pages/brand-details/brand-details.component').then(
        (m) => m.BrandDetailsComponent,
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
