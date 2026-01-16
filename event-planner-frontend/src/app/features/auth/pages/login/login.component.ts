import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen flex">
      <!-- Left Side - Welcome Section -->
      <div class="hidden lg:flex lg:w-1/3 bg-cover bg-center relative" 
           style="background-image: url('https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80');">
        <div class="absolute inset-0 bg-black bg-opacity-60"></div>
        <div class="relative z-10 flex flex-col justify-center items-center text-white p-8">
          <h1 class="text-5xl font-bold mb-4">Hello Friend</h1>
          <p class="text-xl text-center mb-8">To keep connected with us provide us with your information</p>
          <button (click)="navigateToRegister()" 
                  class="px-8 py-3 bg-gray-600 bg-opacity-50 border-2 border-white rounded-lg hover:bg-opacity-70 transition-colors">
            Signup
          </button>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="flex-1 flex items-center justify-center bg-gray-100 p-8">
        <div class="w-full max-w-md">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">
              Event <span class="text-purple-600">Planner</span>
            </h1>
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Sign In to Event Planner</h2>

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

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                YOUR EMAIL
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="Enter your mail"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              />
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <div class="mt-2 text-sm text-red-600">
                  @if (loginForm.get('email')?.errors?.['required']) {
                    <span>Email is required</span>
                  }
                  @if (loginForm.get('email')?.errors?.['email']) {
                    <span>Please enter a valid email</span>
                  }
                </div>
              }
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  PASSWORD
                </label>
                <a [routerLink]="['/auth/forgot-password']" class="text-sm text-purple-600 hover:text-purple-500">
                  Forgot your password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="Enter your password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <div class="mt-2 text-sm text-red-600">
                  @if (loginForm.get('password')?.errors?.['required']) {
                    <span>Password is required</span>
                  }
                  @if (loginForm.get('password')?.errors?.['minlength']) {
                    <span>Password must be at least 6 characters</span>
                  }
                </div>
              }
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full py-3 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              @if (!isLoading) {
                <span>Sign In</span>
              } @else {
                <span>Signing in...</span>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
  imports: [RouterLink, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  ngOnInit() {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // If already logged in, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login response:', response); // Debug log

        // Add null check
        if (response && response.success) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.errorMessage = response?.message || 'Login failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login error:', error); // Debug log
        this.errorMessage =
          error?.message || 'Login failed. Please check your credentials.';
        this.isLoading = false;
      },
    });
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
