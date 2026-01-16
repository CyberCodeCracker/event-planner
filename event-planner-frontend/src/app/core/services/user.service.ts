import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  // Get all users (admin only)
  getUsers(page: number = 1, perPage: number = 10): Observable<ApiResponse<User[]>> {
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.apiService.get<User[]>('users', params);
  }

  // Get user by ID
  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.apiService.get<User>(`users/${id}`);
  }

  // Delete user (admin only)
  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`users/${id}`);
  }
}