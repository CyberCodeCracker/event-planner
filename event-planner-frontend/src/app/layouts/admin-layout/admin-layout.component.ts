import { Component, OnInit } from '@angular/core';
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
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-purple-600 font-semibold text-sm">{{ getUserInitials() }}</span>
                </div>
                <div class="hidden md:block text-left">
                  <p class="font-medium text-gray-900">{{ user?.name }}</p>
                  <p class="text-sm text-gray-500">{{ user?.email }}</p>
                </div>
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

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
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