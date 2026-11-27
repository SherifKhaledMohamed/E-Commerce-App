import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SectionHeaderComponent } from '../../../../shared/ui/section-header/section-header.component';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [SectionHeaderComponent, ReactiveFormsModule, RouterLink, RouterLinkActive],
  selector: 'app-changepassword',
  styleUrl: './changepassword.component.css',
  templateUrl: './changepassword.component.html',
})
export class ChangepasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  isLoading = signal(false);

  changePasswordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    rePassword: ['', [Validators.required]]
  }, { validators: this.confirmPassword });

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (password !== rePassword) {
      return { mismatch: true };
    }
    else {
      return null;
    }
  }

  submitForm() {
    if (this.changePasswordForm.valid) {
      this.isLoading.set(true);
      this.authService.changePassword(this.changePasswordForm.value).subscribe({
        next: (res) => {
          if (res.message.includes('success')) {
            if (res.token && isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', res.token);
            }
            this.router.navigate(['/home']);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    }
    else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
}