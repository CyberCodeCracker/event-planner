import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Registration } from '../models/registration.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  constructor(private apiService: ApiService) {}

  // Get user registrations
  getUserRegistrations(page: number = 1, perPage: number = 10): Observable<ApiResponse<Registration[]>> {
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.apiService.get<Registration[]>('my-registrations', params);
  }

  // Get event registrations (admin only)
  getEventRegistrations(eventId: number | string, page: number = 1): Observable<ApiResponse<Registration[]>> {
    const params = {
      page: page.toString()
    };
    const numericId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
    return this.apiService.get<Registration[]>(`registrations/event/${numericId}`, params);
  }

  // Cancel registration
  cancelRegistration(registrationId: number | string): Observable<ApiResponse<void>> {
    const numericId = typeof registrationId === 'string' ? parseInt(registrationId, 10) : registrationId;
    return this.apiService.delete<void>(`registrations/${numericId}`);
  }

  // Unregister from event
  unregisterFromEvent(eventId: number | string): Observable<ApiResponse<void>> {
    const numericId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
    return this.apiService.delete<void>(`registrations/unregister/${numericId}`);
  }

  // Register for event
  registerForEvent(eventId: number | string): Observable<ApiResponse<any>> {
    const numericId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
    return this.apiService.post<any>(`events/${numericId}/register`, {});
  }
}