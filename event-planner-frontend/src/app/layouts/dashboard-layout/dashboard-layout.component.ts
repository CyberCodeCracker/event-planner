import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Top Navigation -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <!-- Sidebar Toggle Button -->
              <button (click)="toggleSidebar()" class="px-4 text-gray-500 focus:outline-none">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              
              <!-- Logo -->
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold text-gray-900">Event <span class="text-purple-600">Planner</span></h1>
              </div>
            </div>
            
            <!-- User Menu -->
            <div class="flex items-center">
              <a routerLink="/" class="mr-4 text-sm text-gray-600 hover:text-purple-600 transition-colors">
                ← Back to Home
              </a>
              <div class="relative ml-3">
                <div class="flex items-center space-x-3">
                  <div class="text-right hidden md:block">
                    <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
                    <p class="text-xs text-gray-500">{{ user?.role_label }}</p>
                  </div>
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span class="text-purple-600 font-semibold text-sm">{{ getUserInitials() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div class="flex">
        <!-- Sidebar -->
        <aside [class]="isSidebarOpen ? 'w-64' : 'w-0 md:w-20'" 
               class="bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden">
          <nav class="mt-5 px-2">
            <div class="space-y-1">
              <a [routerLink]="['/dashboard']" 
                 [routerLinkActive]="['bg-purple-50', 'text-purple-600']"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span [class]="isSidebarOpen ? '' : 'hidden md:hidden'">Dashboard</span>
              </a>
    
              <a [routerLink]="['/dashboard/my-registrations']" 
                 [routerLinkActive]="['bg-purple-50', 'text-purple-600']"
                 class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span [class]="isSidebarOpen ? '' : 'hidden md:hidden'">My Registrations</span>
              </a>
              
              <a [routerLink]="['/dashboard/profile']" 
                 [routerLinkActive]="['bg-purple-50', 'text-purple-600']"
                 class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span [class]="isSidebarOpen ? '' : 'hidden md:hidden'">Profile</span>
              </a>
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-4 md:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent implements OnInit {
  isSidebarOpen = true;
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

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
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

  logout() {
    this.authService.logout().subscribe();
  }
}