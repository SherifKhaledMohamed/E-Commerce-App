import { AuthService } from './../../features/auth/services/auth.service';
import { Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  imports: [RouterLink,RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  constructor(private flowbiteService: FlowbiteService) {}
  private readonly authService = inject(AuthService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  isLogged = computed(() => this.authService.isLogged())

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  signOut() {
    this.authService.isLogged.set(false);
    if(isPlatformBrowser(this.pLATFORM_ID)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login'])
  }
}
