import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen w-screen flex overflow-hidden">
      <!-- Left Side - Welcome Section -->
      <div class="hidden lg:flex lg:w-1/3 bg-cover bg-center relative flex-shrink-0" 
           style="background-image: url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80');">
        <div class="absolute inset-0 bg-black bg-opacity-60"></div>
        <div class="relative z-10 flex flex-col justify-center items-center text-white p-8">
          <h1 class="text-5xl font-bold mb-4">Welcome back</h1>
          <p class="text-xl text-center mb-8">To keep connected with us provide us with your information</p>
          <button (click)="navigateToLogin()" 
                  class="px-8 py-3 bg-gray-600 bg-opacity-50 border-2 border-white rounded-lg hover:bg-opacity-70 transition-colors">
            Signin
          </button>
        </div>
      </div>

      <!-- Right Side - Register Form -->
      <div class="flex-1 flex items-center justify-center bg-gray-100 p-8 overflow-y-auto min-w-0">
        <div class="w-full max-w-md overflow-hidden">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">
              Event <span class="text-purple-600">Planner</span>
            </h1>
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Sign Up to Event Planner</h2>

          @if (errorMessage) {
            <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-red-700 text-sm">{{ errorMessage }}</span>
              </div>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">YOUR NAME</label>
              <input
                type="text"
                formControlName="name"
                placeholder="Enter your name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                [class.border-red-500]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">YOUR EMAIL</label>
              <input
                type="email"
                formControlName="email"
                placeholder="Enter your email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">PASSWORD</label>
              <input
                type="password"
                formControlName="password"
                placeholder="Enter your password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">CONFIRM PASSWORD</label>
              <input
                type="password"
                formControlName="password_confirmation"
                placeholder="Enter your password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                [class.border-red-500]="registerForm.get('password_confirmation')?.invalid && registerForm.get('password_confirmation')?.touched"
              />
            </div>

            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="w-full py-3 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              @if (!isLoading) {
                <span>Sign Up</span>
              } @else {
                <span>Signing Up...</span>
              }
            </button>
          </form>

          <div class="mt-8 text-center text-sm text-gray-600">
            Already have an account? 
            <a [routerLink]="['/auth/login']" class="text-purple-600 font-medium hover:text-purple-700">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for password match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirmation')?.value;
    
    if (password !== confirmPassword && confirmPassword) {
      control.get('password_confirmation')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const registerData: RegisterRequest = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      password_confirmation: this.registerForm.value.password_confirmation
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        if (error.error?.errors) {
          // Handle validation errors from Laravel
          const errorMessages = Object.values(error.error.errors).flat();
          this.errorMessage = errorMessages.join(', ');
        } else {
          this.errorMessage = error.message || 'Registration failed. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}