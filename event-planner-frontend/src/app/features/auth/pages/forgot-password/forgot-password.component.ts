import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="w-full">
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">Reset Password</h2>
      
      <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Enter your email address
          </label>
          <input
            type="email"
            formControlName="email"
            placeholder="Enter your email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [class.border-red-500]="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched"
          >
          @if (forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched) {
            <div class="mt-2 text-sm text-red-600">
              Valid email is required
            </div>
          }
        </div>

        <button
          type="submit"
          [disabled]="forgotForm.invalid || isLoading"
          class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <!-- Success Message -->
      @if (isSuccess) {
        <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-green-700">Password reset link has been sent to your email!</span>
        </div>
        </div>
      }

      <!-- Back to Login -->
      <div class="mt-8 text-center">
        <a [routerLink]="['/auth/login']" 
           class="font-medium text-blue-600 hover:text-blue-500">
          ← Back to Login
        </a>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  isSuccess = false;

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
    }, 2000);
  }
}