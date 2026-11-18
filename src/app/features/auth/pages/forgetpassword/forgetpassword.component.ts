import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [RouterLink,ReactiveFormsModule],
  selector: 'app-forgetpassword',
  styleUrl: './forgetpassword.component.css',
  templateUrl: './forgetpassword.component.html',
})
export class ForgetpasswordComponent {
  step = signal(1);

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  email = new FormControl ('',[Validators.required,Validators.email]);
  resetCode = new FormControl ('',[Validators.required,Validators.pattern(/^[0-9]{6}$/)]);
  newPassword = new FormControl ('',[Validators.required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]);

  submitMail(e:Event) {
    e.preventDefault();

    if(this.email.valid) {
      const data = {
        email: this.email.value
      }

      this.authService.forgetPassword(data).subscribe({
        next: (res) => {
          if(res.statusMsg === 'success') {
            this.step.set(2);
          }
        }
      })
    }
  }
  submitCode(e:Event) {
    e.preventDefault();

    if(this.resetCode.valid) {
      const data = {
        resetCode: this.resetCode.value
      }

      this.authService.verifyCode(data).subscribe({
        next: (res) => {
          if(res.status === 'Success') {
            this.step.set(3);
          }
        }
      })
    }
  }
  submitNewPassword(e:Event) {
    e.preventDefault();

    if(this.newPassword.valid) {
      const data = {
        email: this.email.value,
        newPassword: this.newPassword.value
      }

      this.authService.resetPassword(data).subscribe({
        next: (res) => {
          console.log(res)
          if(res.token) {
            this.router.navigate(['/login']);
          }
        }
      })
    }
  }

}
