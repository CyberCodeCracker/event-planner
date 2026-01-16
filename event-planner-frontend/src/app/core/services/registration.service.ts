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
  getEventRegistrations(eventId: number, page: number = 1): Observable<ApiResponse<Registration[]>> {
    const params = {
      page: page.toString()
    };
    return this.apiService.get<Registration[]>(`registrations/event/${eventId}`, params);
  }

  // Cancel registration
  cancelRegistration(registrationId: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`registrations/${registrationId}`);
  }

  // Unregister from event
  unregisterFromEvent(eventId: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`registrations/unregister/${eventId}`);
  }
}