import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { Event } from '../../../../core/models/event.model';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Events</h1>
          <p class="text-gray-600">Events you've created</p>
        </div>
        <a [routerLink]="['/events/create']" 
           class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Create New Event
        </a>
      </div>

      <!-- Events Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrations
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let event of events" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <div class="font-medium text-gray-900">{{ event.title }}</div>
                    <div class="text-sm text-gray-500">{{ event.place }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(event.start_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(event)">
                    {{ getStatusText(event) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ event.registrations_count || 0 }} / {{ event.capacity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr *ngIf="events.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="mb-4">You haven't created any events yet.</p>
                    <a [routerLink]="['/events/create']" 
                       class="text-blue-600 hover:text-blue-700 font-medium">
                      Create your first event →
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class MyEventsComponent implements OnInit {
  events: Event[] = [];
  isLoading = false;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getEvents(1, 10, { created_by: true }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.events = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusClass(event: Event): string {
    if (!event.is_active) return 'px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800';
    if (event.available_spots === 0) return 'px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800';
    return 'px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
  }

  getStatusText(event: Event): string {
    if (!event.is_active) return 'Inactive';
    if (event.available_spots === 0) return 'Sold Out';
    return 'Active';
  }
}