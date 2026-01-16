import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header matching design -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <nav class="container mx-auto px-4">
          <div class="flex justify-between items-center py-4">
            <!-- Logo -->
            <div class="flex items-center space-x-8">
              <a [routerLink]="['/']" class="text-2xl font-bold">
                Event <span class="text-purple-600">Planner</span>
              </a>
              
              <!-- Navigation Links -->
              <div class="hidden md:flex items-center space-x-6">
                <a [routerLink]="['/admin/categories']" 
                   [routerLinkActive]="['text-purple-600', 'font-semibold']"
                   [routerLinkActiveOptions]="{exact: false}"
                   class="text-gray-600 hover:text-purple-600 transition-colors relative">
                  Categories
                  @if (router.url.includes('/admin/categories')) {
                    <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></span>
                  }
                </a>
                <a [routerLink]="['/admin/events']" 
                   [routerLinkActive]="['text-purple-600', 'font-semibold']"
                   [routerLinkActiveOptions]="{exact: false}"
                   class="text-gray-600 hover:text-purple-600 transition-colors relative">
                  Events
                  @if (router.url.includes('/admin/events')) {
                    <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></span>
                  }
                </a>
              </div>
            </div>

            <!-- User Profile -->
            <div class="flex items-center space-x-4">
              <div class="relative">
                <button (click)="toggleDropdown()" 
                        class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span class="text-purple-600 font-semibold text-sm">{{ getUserInitials() }}</span>
                  </div>
                  <div class="hidden md:block text-left">
                    <p class="font-medium text-gray-900">{{ user?.name }}</p>
                    <p class="text-sm text-gray-500">{{ user?.email }}</p>
                  </div>
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                @if (isDropdownOpen) {
                  <div class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <a [routerLink]="['/dashboard/profile']" 
                       (click)="isDropdownOpen = false"
                       class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                      View Profile
                    </a>
                    <a [routerLink]="['/dashboard/my-events']" 
                       (click)="isDropdownOpen = false"
                       class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                      My Events
                    </a>
                    <a [routerLink]="['/dashboard/my-registrations']" 
                       (click)="isDropdownOpen = false"
                       class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                      My Registrations
                    </a>
                    <a [routerLink]="['/']" 
                       (click)="isDropdownOpen = false"
                       class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                      Home
                    </a>
                    <div class="border-t my-2"></div>
                    <button (click)="onLogout()" 
                            class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="bg-gray-50">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  user: any = null;
  isDropdownOpen = false;

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }

  onLogout() {
    this.isDropdownOpen = false;
    this.authService.logout().subscribe({
      next: () => {
        // Navigation is handled in the auth service
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.authService.clearAuth();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  getUserInitials(): string {
    if (!this.user?.name) return 'U';
    return this.user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}