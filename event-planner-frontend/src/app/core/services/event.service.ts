import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  getUpcomingEvents(limit: number = 15): Observable<ApiResponse<Event[]>> {
    return this.apiService.get<Event[]>('events/upcoming', { limit: limit.toString() });
  }

  // Get event by ID
  getEventById(id: number | string): Observable<ApiResponse<Event>> {
    // Ensure ID is converted to number to match backend type requirement
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId) || numericId <= 0) {
      throw new Error(`Invalid event ID: ${id}`);
    }
    return this.apiService.get<Event>(`events/${numericId}`);
  }

  // Create event
  createEvent(eventData: CreateEventRequest, imageFile?: File): Observable<ApiResponse<Event>> {
    const formData = new FormData();
    
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('start_date', eventData.start_date);
    formData.append('end_date', eventData.end_date);
    formData.append('place', eventData.place);
    formData.append('price', eventData.price.toString());
    formData.append('category_id', eventData.category_id.toString());
    formData.append('capacity', eventData.capacity.toString());
    
    // Handle boolean - Laravel expects '1' or '0' for boolean in FormData
    const isActive = eventData.is_active ?? true;
    formData.append('is_active', isActive ? '1' : '0');
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    return this.apiService.upload<Event>('events', formData);
  }

  // Update event
  updateEvent(id: number | string, eventData: UpdateEventRequest, imageFile?: File): Observable<ApiResponse<Event>> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const formData = new FormData();
    
    if (eventData.title !== undefined) formData.append('title', eventData.title);
    if (eventData.description !== undefined) formData.append('description', eventData.description);
    if (eventData.start_date !== undefined) formData.append('start_date', eventData.start_date);
    if (eventData.end_date !== undefined) formData.append('end_date', eventData.end_date);
    if (eventData.place !== undefined) formData.append('place', eventData.place);
    if (eventData.price !== undefined) formData.append('price', eventData.price.toString());
    if (eventData.category_id !== undefined) formData.append('category_id', eventData.category_id.toString());
    if (eventData.capacity !== undefined) formData.append('capacity', eventData.capacity.toString());
    
    // Handle boolean - Laravel expects '1' or '0' for boolean in FormData
    if (eventData.is_active !== undefined) {
      formData.append('is_active', eventData.is_active ? '1' : '0');
    }
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // For PUT requests with FormData, we need to use POST with _method=PUT or use upload method
    formData.append('_method', 'PUT');
    return this.apiService.upload<Event>(`events/${numericId}`, formData);
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