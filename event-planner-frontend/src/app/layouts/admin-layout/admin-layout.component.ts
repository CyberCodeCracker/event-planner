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
      <!-- Top Navigation -->
      <nav class="bg-gray-900 text-white">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <!-- Logo -->
              <div class="flex-shrink-0">
                <h1 class="text-xl font-bold">Admin Panel</h1>
              </div>
              
              <!-- Admin Navigation -->
              <div class="hidden md:block ml-10">
                <div class="flex items-baseline space-x-4">
                  <a [routerLink]="['/admin/dashboard']" 
                     [routerLinkActive]="['bg-gray-800', 'text-white']"
                     class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Dashboard
                  </a>
                  <a [routerLink]="['/admin/events']" 
                     [routerLinkActive]="['bg-gray-800', 'text-white']"
                     class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Events
                  </a>
                  <a [routerLink]="['/admin/categories']" 
                     [routerLinkActive]="['bg-gray-800', 'text-white']"
                     class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Categories
                  </a>
                  <a [routerLink]="['/admin/users']" 
                     [routerLinkActive]="['bg-gray-800', 'text-white']"
                     class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Users
                  </a>
                  <a [routerLink]="['/admin/registrations']" 
                     [routerLinkActive]="['bg-gray-800', 'text-white']"
                     class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Registrations
                  </a>
                </div>
              </div>
            </div>
            
            <!-- User Menu -->
            <div class="flex items-center">
              <div class="ml-3 relative">
                <div class="flex items-center space-x-3">
                  <div class="text-right">
                    <p class="text-sm font-medium text-white">{{ user?.name }}</p>
                    <p class="text-xs text-gray-300">Administrator</p>
                  </div>
                  <button (click)="logout()" 
                          class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout().subscribe();
  }
}