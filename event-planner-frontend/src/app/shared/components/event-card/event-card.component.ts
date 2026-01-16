import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
  @Input() event!: Event;
  @Input() showActions = true;
  @Output() register = new EventEmitter<Event>();
  @Output() viewDetails = new EventEmitter<Event>();
  imageError = false;

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
    return `${weekday}, ${month} ${day}, ${time}`;
  }

  onRegister() {
    this.register.emit(this.event);
  }

  onViewDetails() {
    this.viewDetails.emit(this.event);
  }

  getPriceDisplay(): string {
    if (this.event.price === 0 || this.event.is_free) {
      return 'Free';
    }
    return `$${this.event.price.toFixed(2)}`;
  }

  getSpotsAvailable(): number {
    return this.event.available_spots || 0;
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      console.log('EventCard: No image path provided');
      return '';
    }
    
    console.log('EventCard: Original image path:', imagePath);
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('EventCard: Using full URL:', imagePath);
      return imagePath;
    }
    
    // If it starts with /storage, prepend the backend URL
    if (imagePath.startsWith('/storage') || imagePath.startsWith('storage/')) {
      const cleanPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
      const fullUrl = `http://localhost:8000${cleanPath}`;
      console.log('EventCard: Constructed storage URL:', fullUrl);
      return fullUrl;
    }
    
    // Otherwise, assume it's a relative path and prepend backend URL
    const fullUrl = `http://localhost:8000/${imagePath}`;
    console.log('EventCard: Constructed relative URL:', fullUrl);
    return fullUrl;
  }

  onImageError(event: any) {
    console.error('EventCard: Image failed to load:', event.target.src);
    // Set flag to show placeholder instead
    this.imageError = true;
    event.target.style.display = 'none';
  }
}