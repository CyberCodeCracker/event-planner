import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p class="mt-2 text-gray-600">Manage your account information and preferences</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-6">
            <div class="text-center">
              <!-- Avatar -->
              <div class="mx-auto w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span class="text-blue-600 text-4xl font-bold">{{ getInitials() }}</span>
              </div>
              
              <h2 class="text-xl font-semibold text-gray-900">{{ user?.name }}</h2>
              <p class="text-gray-600">{{ user?.email }}</p>
              
              <div class="mt-4">
                <span class="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {{ user?.role_label }}
                </span>
              </div>
              
              <div class="mt-6 space-y-3 text-sm text-gray-600">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Member since {{ formatDate(user?.created_at) }}
                </div>
                
                @if (user?.phone) {
                  <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {{ user?.phone }}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Update Profile</h3>
            
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" formControlName="name"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       [class.border-red-500]="profileForm.get('name')?.invalid && profileForm.get('name')?.touched">
                @if (profileForm.get('name')?.invalid && profileForm.get('name')?.touched) {
                  <div class="mt-1 text-sm text-red-600">
                    Name is required
                  </div>
                }
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" formControlName="email"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       [class.border-red-500]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                @if (profileForm.get('email')?.invalid && profileForm.get('email')?.touched) {
                  <div class="mt-1 text-sm text-red-600">
                    Valid email is required
                  </div>
                }
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" formControlName="phone"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <!-- Password Section -->
              <div class="border-t pt-6">
                <h4 class="text-md font-medium text-gray-900 mb-4">Change Password</h4>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input type="password" formControlName="current_password"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input type="password" formControlName="password"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input type="password" formControlName="password_confirmation"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end pt-6">
                <button type="submit" [disabled]="profileForm.invalid || isLoading"
                        class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      current_password: [''],
      password: ['', [Validators.minLength(6)]],
      password_confirmation: ['']
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        });
      }
    });
  }

  getInitials(): string {
    if (!this.user?.name) return 'U';
    return this.user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    const formData = { ...this.profileForm.value };

    // Remove empty password fields
    if (!formData.password) {
      delete formData.password;
      delete formData.password_confirmation;
      delete formData.current_password;
    }

    this.authService.updateProfile(formData).subscribe({
      next: () => {
        this.isLoading = false;
        // Show success message
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Update failed:', error);
      }
    });
  }
}