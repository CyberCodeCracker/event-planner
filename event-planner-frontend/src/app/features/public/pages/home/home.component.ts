import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../core/services/event.service';
import { CategoryService } from '../../../../core/services/category.service';
import { RegistrationService } from '../../../../core/services/registration.service';
import { Event } from '../../../../core/models/event.model';
import { Category } from '../../../../core/models/category.model';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="min-h-screen bg-white">
      <!-- Hero Section with Image -->
      <div class="relative h-[500px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80" 
             alt="Event" 
             class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <h1 class="text-6xl md:text-8xl font-bold text-white uppercase tracking-wider">
            MADE FOR THOSE WHO DO
          </h1>
        </div>
        <!-- Navigation Arrows -->
        <button class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      <!-- Upcoming Events Section -->
      <div class="container mx-auto px-4 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 class="text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            Upcoming <span class="text-purple-600">Events</span>
          </h2>
          
          <!-- Search and Filters -->
          <div class="flex flex-wrap gap-4 items-center">
            <div class="relative">
              <input type="text" 
                     [(ngModel)]="searchQuery"
                     (input)="onSearch()"
                     placeholder="Search" 
                     class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <select [(ngModel)]="selectedWeekday" (change)="onFilterChange()" 
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Weekdays</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
            
            <select [(ngModel)]="selectedCategory" (change)="onFilterChange()" 
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Any category</option>
              @for (category of categories; track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>
        </div>
        
        @if (isLoading) {
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        }
        
        @if (!isLoading) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            @for (event of displayedEvents; track event.id) {
              <app-event-card 
                [event]="event"
                (viewDetails)="onViewDetails($event)"
                (register)="onRegister($event)"
              ></app-event-card>
            }
          </div>
          
          @if (displayedEvents.length < allEvents.length) {
            <div class="text-center">
              <button (click)="loadMore()" 
                      class="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Load more...
              </button>
            </div>
          }
        }
        
        @if (!isLoading && displayedEvents.length === 0) {
          <div class="text-center py-12">
            <p class="text-gray-500">No upcoming events found</p>
          </div>
        }
      </div>
    </div>

    <!-- Book Event Modal -->
    @if (showBookModal && selectedEvent) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="closeBookModal()">
        <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4" (click)="$event.stopPropagation()">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Book Event</h2>
          <div class="space-y-4">
            <p class="text-gray-600">Are you sure you want to book <strong>{{ selectedEvent.title }}</strong>?</p>
            <div class="flex gap-4 pt-4">
              <button (click)="closeBookModal()" 
                      class="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                Cancel
              </button>
              <button (click)="bookEvent()" 
                      class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Book now
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  imports: [CommonModule, EventCardComponent, FormsModule]
})
export class HomeComponent implements OnInit {
  allEvents: Event[] = [];
  displayedEvents: Event[] = [];
  categories: Category[] = [];
  isLoading = true;
  searchQuery = '';
  selectedWeekday = '';
  selectedCategory = '';
  displayedCount = 6;
  showBookModal = false;
  selectedEvent: Event | null = null;

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private registrationService: RegistrationService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.loadCategories();
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getUpcomingEvents().subscribe({
      next: (response) => {
        this.allEvents = response.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data || [];
      }
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allEvents];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query) || 
        e.description.toLowerCase().includes(query)
      );
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(e => e.category_id === +this.selectedCategory);
    }
    
    if (this.selectedWeekday) {
      filtered = filtered.filter(e => {
        const date = new Date(e.start_date);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return day === this.selectedWeekday;
      });
    }
    
    this.displayedEvents = filtered.slice(0, this.displayedCount);
  }

  loadMore() {
    this.displayedCount += 6;
    this.applyFilters();
  }

  onViewDetails(event: Event) {
    if (event && event.id) {
      this.router.navigate(['/events', event.id]);
    } else {
      console.error('Invalid event or event ID:', event);
    }
  }

  onRegister(event: Event) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/' } });
      return;
    }

    this.selectedEvent = event;
    this.showBookModal = true;
  }

  closeBookModal() {
    this.showBookModal = false;
    this.selectedEvent = null;
  }

  bookEvent() {
    if (!this.selectedEvent) return;
    
    this.registrationService.registerForEvent(this.selectedEvent.id).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Successfully booked ' + this.selectedEvent!.title);
          this.closeBookModal();
          // Optionally reload events to update registration status
          this.loadEvents();
        }
      },
      error: (error) => {
        console.error('Booking error:', error);
        alert('Failed to book event. Please try again.');
      }
    });
  }
}