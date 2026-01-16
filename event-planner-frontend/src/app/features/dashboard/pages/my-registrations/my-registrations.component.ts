import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RegistrationService } from '../../../../core/services/registration.service';
import { EventService } from '../../../../core/services/event.service';
import { Registration } from '../../../../core/models/registration.model';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-my-registrations',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './my-registrations.component.html',
})
export class MyRegistrationsComponent implements OnInit {
  registrations: Registration[] = [];
  isLoading = false;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;

  constructor(
    private registrationService: RegistrationService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadRegistrations();
  }

  loadRegistrations(page: number = 1) {
    this.isLoading = true;
    this.currentPage = page;

    this.registrationService.getUserRegistrations(page, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.registrations = response.data;
          this.totalItems = response.meta?.total || 0;
          this.totalPages = response.meta?.last_page || 1;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading registrations:', error);
        this.isLoading = false;
      }
    });
  }

  cancelRegistration(registration: Registration) {
    if (!confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    this.registrationService.cancelRegistration(registration.id).subscribe({
      next: (response) => {
        if (response.success) {
          // Remove the cancelled registration from the list
          this.registrations = this.registrations.filter(r => r.id !== registration.id);
          this.totalItems--;
          
          // Show success message
          alert('Registration cancelled successfully!');
        }
      },
      error: (error) => {
        console.error('Error cancelling registration:', error);
        alert('Failed to cancel registration. Please try again.');
      }
    });
  }

  unregisterFromEvent(eventId: number) {
    if (!confirm('Are you sure you want to unregister from this event?')) {
      return;
    }

    this.registrationService.unregisterFromEvent(eventId).subscribe({
      next: (response) => {
        if (response.success) {
          // Remove the registration from the list
          this.registrations = this.registrations.filter(r => r.event_id !== eventId);
          this.totalItems--;
          
          // Show success message
          alert('Successfully unregistered from event!');
        }
      },
      error: (error) => {
        console.error('Error unregistering:', error);
        alert('Failed to unregister. Please try again.');
      }
    });
  }

  isEventUpcoming(eventDate: string): boolean {
    return new Date(eventDate) > new Date();
  }

  canCancelRegistration(registration: Registration): boolean {
    if (!registration.event) return false;
    return this.isEventUpcoming(registration.event.start_date);
  }

  getStatus(eventDate: string): string {
    const now = new Date();
    const eventStart = new Date(eventDate);
    
    if (eventStart < now) {
      return 'Completed';
    } else if (eventStart.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return 'Upcoming Soon';
    } else {
      return 'Upcoming';
    }
  }

  getStatusClass(eventDate: string): string {
    const status = this.getStatus(eventDate);
    switch (status) {
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Upcoming Soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'Upcoming':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTotalPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadRegistrations(page);
    }
  }

  getRegistrationCountText(): string {
    if (this.totalItems === 0) return 'No registrations';
    if (this.totalItems === 1) return '1 registration';
    return `${this.totalItems} registrations`;
  }
}