import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.component.css',
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  registerForm = this.fb.group({
    name: ['',[Validators.required,Validators.minLength(3)]],
    email: ['',[Validators.required,Validators.email]],
    password: ['',[Validators.required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    rePassword:[''],
    phone: ['',[Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)]]
  }, {validators: this.confirmPassword});


  confirmPassword(group:AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if(password !== rePassword) {
      return {mismatch:true};
    }
    else {
      return null
    }
  }

  submitForm() {
    if(this.registerForm.valid) {
      this.authService.signUp(this.registerForm.value).subscribe({
        next:(res) => {
          if(res.message.includes('success')) {
            this.router.navigate(['/login']);
          }
        }
      })
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }
}

