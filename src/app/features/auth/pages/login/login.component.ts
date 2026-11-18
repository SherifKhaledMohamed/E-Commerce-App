import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly pLATFORM_ID = inject(PLATFORM_ID)

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
            this.router.navigate(['/']);
          }
        }
      })
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
