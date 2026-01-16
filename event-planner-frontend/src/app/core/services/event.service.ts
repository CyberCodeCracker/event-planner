import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Event, CreateEventRequest, UpdateEventRequest } from '../models/event.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private apiService: ApiService) {}

  // Get all events with pagination
  getEvents(page: number = 1, perPage: number = 10, filters: any = {}): Observable<ApiResponse<Event[]>> {
    const params = {
      page: page.toString(),
      per_page: perPage.toString(),
      ...filters
    };
    return this.apiService.get<Event[]>('events', params);
  }

  // Get upcoming events
  getUpcomingEvents(limit: number = 5): Observable<ApiResponse<Event[]>> {
    return this.apiService.get<Event[]>('events/upcoming');
  }

  // Get event by ID
  getEventById(id: number | string): Observable<ApiResponse<Event>> {
    // Ensure ID is converted to number to match backend type requirement
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return this.apiService.get<Event>(`events/${numericId}`);
  }

  // Create event
  createEvent(eventData: CreateEventRequest): Observable<ApiResponse<Event>> {
    return this.apiService.post<Event>('events', eventData);
  }

  // Update event
  updateEvent(id: number | string, eventData: UpdateEventRequest): Observable<ApiResponse<Event>> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return this.apiService.put<Event>(`events/${numericId}`, eventData);
  }

  // Delete event
  deleteEvent(id: number | string): Observable<ApiResponse<void>> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return this.apiService.delete<void>(`events/${numericId}`);
  }

  // Get events by category
  getEventsByCategory(categoryId: number, page: number = 1): Observable<ApiResponse<Event[]>> {
    const params = { page: page.toString() };
    return this.apiService.get<Event[]>(`events/by-category/${categoryId}`, params);
  }

  // Register for event
  registerForEvent(eventId: number | string): Observable<ApiResponse<any>> {
    const numericId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
    return this.apiService.post<any>(`events/${numericId}/register`, {});
  }

  // Check registration status
  checkRegistration(eventId: number | string): Observable<ApiResponse<{is_registered: boolean}>> {
    const numericId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
    return this.apiService.get<{is_registered: boolean}>(`registrations/check/${numericId}`);
  }
}