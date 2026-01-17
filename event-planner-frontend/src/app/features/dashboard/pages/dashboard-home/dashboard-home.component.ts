import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { RegistrationService } from '../../../../core/services/registration.service';
import { Event } from '../../../../core/models/event.model';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink, EventCardComponent],
  template: `
    <div class="space-y-8">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 class="text-3xl font-bold mb-2">Welcome back!</h1>
        <p class="text-purple-100">Here's what's happening with your events today.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Events</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalEvents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Registrations</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalRegistrations }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-indigo-100">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.upcomingEvents }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <a [routerLink]="['/events']" class="text-purple-600 hover:text-purple-700 font-medium">
            View All →
          </a>
        </div>

        @if (isLoading) {
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        }

        @if (!isLoading && upcomingEvents.length === 0) {
          <div class="text-center py-12 bg-white rounded-xl shadow">
            <p class="text-gray-500">No upcoming events found.</p>
          </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (event of upcomingEvents; track event.id) {
            <app-event-card 
              [event]="event"
              (viewDetails)="onViewDetails($event)"
              (register)="onRegister($event)">
            </app-event-card>
          }
        </div>
      </div>


    </div>
  `
})
export class DashboardHomeComponent implements OnInit {
  upcomingEvents: Event[] = [];
  isLoading = false;
  stats = {
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0
  };

  constructor(
    private eventService: EventService,
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUpcomingEvents();
    this.loadStats();
  }

  loadStats() {
    // Load registration count
    this.registrationService.getUserRegistrations(1, 1).subscribe({
      next: (response: any) => {
        if (response.success && response.meta) {
          this.stats.totalRegistrations = response.meta.total;
        }
      },
      error: (error) => console.error('Error loading registration stats:', error)
    });

    // Load total events count
    this.eventService.getEvents(1, 1).subscribe({
      next: (response: any) => {
        if (response.success && response.meta) {
          this.stats.totalEvents = response.meta.total;
        }
      },
      error: (error) => console.error('Error loading event stats:', error)
    });
  }

  loadUpcomingEvents() {
    this.isLoading = true;
    this.eventService.getUpcomingEvents(6).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.upcomingEvents = response.data;
          this.stats.upcomingEvents = response.data.length;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  onViewDetails(event: Event) {
    // Navigate to event details
    this.router.navigate(['/events', event.id]);
  }

  onRegister(event: Event) {
    this.registrationService.registerForEvent(event.id).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Successfully registered for ' + event.title);
          this.loadStats();
        }
      },
      error: (error) => {
        console.error('Registration error:', error);
        alert('Failed to register. Please try again.');
      }
    });
  }
}