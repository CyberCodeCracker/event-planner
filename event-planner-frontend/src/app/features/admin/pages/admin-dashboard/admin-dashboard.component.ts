import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { UserService } from '../../../../core/services/user.service';
import { CategoryService } from '../../../../core/services/category.service';
import { RegistrationService } from '../../../../core/services/registration.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600">Overview of your event management system</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a [routerLink]="['/admin/events']" class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Events</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalEvents }}</p>
            </div>
          </div>
        </a>

        <a [routerLink]="['/admin/users']" class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10.953 10.953 0 01-1.667-1.19m0 0a4.5 4.5 0 01-6.667 0M21 14a2 2 0 01-2 2m-2-2a2 2 0 012-2m0 0a2 2 0 012 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </a>

        <a [routerLink]="['/admin/registrations']" class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Registrations</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalRegistrations }}</p>
            </div>
          </div>
        </a>

        <a [routerLink]="['/admin/categories']" class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-yellow-100 group-hover:bg-yellow-200 transition-colors">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Categories</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCategories }}</p>
            </div>
          </div>
        </a>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Events -->
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
          <div class="space-y-4">
            @for (event of recentEvents; track event.id) {
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">{{ event.title }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(event.created_at) }}</p>
              </div>
              <span [class]="event.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                    class="px-3 py-1 rounded-full text-sm font-medium">
                {{ event.is_active ? 'Active' : 'Inactive' }}
              </span>
              </div>
            }
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-700">API Status</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Online
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Database</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Connected
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Storage</span>
              <span class="text-sm text-gray-900">85% used</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Last Backup</span>
              <span class="text-sm text-gray-900">Today, 02:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    totalCategories: 0
  };
  recentEvents: any[] = [];

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private categoryService: CategoryService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentEvents();
  }

  loadStats() {
    // Get events count - use a large per_page to get total from meta, or use response.meta.total
    this.eventService.getEvents(1, 1).subscribe(response => {
      if (response.success) {
        // Use meta.total if available, otherwise fall back to data length
        this.stats.totalEvents = (response as any).meta?.total || response.data?.length || 0;
      }
    });

    this.userService.getUsers().subscribe(response => {
      if (response.success) {
        // Use meta.total if available, otherwise fall back to data length
        this.stats.totalUsers = (response as any).meta?.total || response.data?.length || 0;
      }
    });

    this.categoryService.getCategories().subscribe(response => {
      if (response.success && response.data) {
        this.stats.totalCategories = response.data.length;
      }
    });

    // Get registrations count from admin endpoint
    this.registrationService.getAllRegistrations(1, 1).subscribe(response => {
      if (response.success) {
        this.stats.totalRegistrations = (response as any).meta?.total || response.data?.length || 0;
      }
    });
  }

  loadRecentEvents() {
    this.eventService.getEvents(1, 5).subscribe(response => {
      if (response.success && response.data) {
        this.recentEvents = response.data;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
