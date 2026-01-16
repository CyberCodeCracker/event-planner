import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../core/services/event.service';
import { RegistrationService } from '../../../../core/services/registration.service';
import { Event } from '../../../../core/models/event.model';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Back Button and Banner Section -->
      <div class="relative">
        <button (click)="goBack()" 
                class="absolute top-4 left-4 z-10 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>
        
        @if (event) {
          <div class="relative h-[400px] overflow-hidden">
            @if (event.image) {
              <img [src]="getImageUrl(event.image)" 
                   [alt]="event.title" 
                   class="w-full h-full object-cover"
                   (error)="onImageError($event)">
            } @else {
              <div class="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
            }
            <div class="absolute inset-0 bg-black bg-opacity-40"></div>
            <div class="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h1 class="text-4xl md:text-5xl font-bold mb-2">{{ event.title }}</h1>
              <p class="text-xl mb-4">{{ event.place }}</p>
              <p class="text-gray-200 mb-6 max-w-2xl">{{ event.description.substring(0, 150) }}...</p>
              <button (click)="openBookModal()" 
                      class="w-fit px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Book now
              </button>
            </div>
          </div>
        }
      </div>

      @if (event) {
        <div class="container mx-auto px-4 py-12">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Description -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ event.description }}</p>
              </div>
            </div>

            <!-- Right Column - Hours & Capacity -->
            <div class="space-y-6">
              <div class="bg-white rounded-xl shadow-md p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Hours</h3>
                <div class="space-y-3">
                  <div>
                    <p class="text-gray-600">Weekdays hour:</p>
                    <p class="text-purple-600 font-semibold">{{ getWeekdayHours() }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Sunday hour:</p>
                    <p class="text-purple-600 font-semibold">{{ getSundayHours() }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-md p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Capacity</h3>
                <p class="text-gray-600">Seats number:</p>
                <p class="text-purple-600 font-semibold text-2xl">{{ event.capacity }} persons</p>
              </div>
            </div>
          </div>

          <!-- Other Events Section -->
          <div class="mt-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">Other events you may like</h2>
            @if (otherEvents.length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (otherEvent of otherEvents; track otherEvent.id) {
                  <app-event-card 
                    [event]="otherEvent"
                    (viewDetails)="onViewDetails($event)"
                    (register)="onRegister($event)"
                  ></app-event-card>
                }
              </div>
            }
          </div>
        </div>
      }

      @if (isLoading) {
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      }
    </div>

    <!-- Book Event Modal -->
    @if (showBookModal) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="closeBookModal()">
        <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4" (click)="$event.stopPropagation()">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Book Event</h2>
          <div class="space-y-4">
            <p class="text-gray-600">Are you sure you want to book this event?</p>
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
  imports: [CommonModule, EventCardComponent]
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  otherEvents: Event[] = [];
  isLoading = true;
  showBookModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private registrationService: RegistrationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const eventId = params.get('id');
      if (eventId) {
        const numericId = parseInt(eventId, 10);
        if (!isNaN(numericId) && numericId > 0) {
          this.loadEvent(numericId);
          this.loadOtherEvents(numericId);
        } else {
          console.error('Invalid event ID:', eventId);
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  loadEvent(id: number) {
    if (isNaN(id) || id <= 0) {
      console.error('Invalid event ID:', id);
      this.router.navigate(['/']);
      return;
    }
    this.isLoading = true;
    this.eventService.getEventById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.event = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.isLoading = false;
      }
    });
  }

  loadOtherEvents(currentEventId: number) {
    this.eventService.getUpcomingEvents().subscribe({
      next: (response) => {
        if (response.data) {
          this.otherEvents = response.data.filter(e => e.id !== currentEventId).slice(0, 6);
        }
      }
    });
  }

  getWeekdayHours(): string {
    if (!this.event) return '7PM - 10PM';
    const start = new Date(this.event.start_date);
    const end = new Date(this.event.end_date);
    return `${this.formatTime(start)} - ${this.formatTime(end)}`;
  }

  getSundayHours(): string {
    if (!this.event) return '7PM - 10PM';
    const start = new Date(this.event.start_date);
    const end = new Date(this.event.end_date);
    return `${this.formatTime(start)} - ${this.formatTime(end)}`;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
  }

  goBack() {
    this.router.navigate(['/']);
  }

  openBookModal() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.showBookModal = true;
  }

  closeBookModal() {
    this.showBookModal = false;
  }

  bookEvent() {
    if (!this.event) return;
    
    this.registrationService.registerForEvent(this.event.id).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Successfully booked ' + this.event!.title);
          this.closeBookModal();
        }
      },
      error: (error) => {
        console.error('Booking error:', error);
        alert('Failed to book event. Please try again.');
      }
    });
  }

  onViewDetails(event: Event) {
    this.router.navigate(['/events', event.id]);
  }

  onRegister(event: Event) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/' } });
      return;
    }

    // Use the same modal as the "Book now" button
    this.event = event;
    this.openBookModal();
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      console.log('EventDetail: No image path provided');
      return '';
    }
    
    console.log('EventDetail: Original image path:', imagePath);
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('EventDetail: Using full URL:', imagePath);
      return imagePath;
    }
    
    // If it starts with /storage, prepend the backend URL
    if (imagePath.startsWith('/storage') || imagePath.startsWith('storage/')) {
      const cleanPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
      const fullUrl = `http://localhost:8000${cleanPath}`;
      console.log('EventDetail: Constructed storage URL:', fullUrl);
      return fullUrl;
    }
    
    // Otherwise, assume it's a relative path and prepend backend URL
    const fullUrl = `http://localhost:8000/${imagePath}`;
    console.log('EventDetail: Constructed relative URL:', fullUrl);
    return fullUrl;
  }

  onImageError(event: any) {
    console.error('EventDetail: Image failed to load:', event.target.src);
    // Hide broken image and show placeholder
    event.target.style.display = 'none';
  }
}
