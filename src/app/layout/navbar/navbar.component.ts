import { AuthService } from './../../features/auth/services/auth.service';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/product.interface';

@Component({
  imports: [RouterLink,RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  constructor(private flowbiteService: FlowbiteService) {}
  private readonly authService = inject(AuthService);
  private readonly categoryService = inject(CategoryService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  isLogged = computed(() => this.authService.isLogged())

  allCategories = signal<Category[]>([]);

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    this.getCategories();
  }

  signOut() {
    this.authService.isLogged.set(false);
    if(isPlatformBrowser(this.pLATFORM_ID)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login'])
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe({
      next : (res) => {
        this.allCategories.set(res.data);
      }
    })
  }
}
