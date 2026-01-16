import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { LoginRequest, RegisterRequest, User } from '../models/auth.model';
import { AuthResponse } from '../models/api-response.model';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUser();
  }

  private loadUser(): void {
    const user = this.tokenService.getUser();
    if (user && this.tokenService.isValid()) {
      this.currentUserSubject.next(user);
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<AuthResponse<User>> {
    return this.apiService.post<AuthResponse<User>>('login', credentials).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.tokenService.setToken(response.token);
          this.tokenService.setUser(response.user);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Register
  register(data: RegisterRequest): Observable<AuthResponse<User>> {
    return this.apiService.post<AuthResponse<User>>('register', data).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.tokenService.setToken(response.token);
          this.tokenService.setUser(response.user);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Logout
  logout(): Observable<any> {
    return this.apiService.post<any>('logout', {}).pipe(
      tap(() => {
        this.clearAuth();
        this.router.navigate(['/auth/login']);
      })
    );
  }

  // Get current user
  getCurrentUser(): Observable<any> {
    return this.apiService.get<{ success: boolean; user: User }>('user').pipe(
      tap(response => {
        if (response.success && response.user) {
          this.tokenService.setUser(response.user);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Update profile
  updateProfile(data: any): Observable<any> {
    return this.apiService.put<any>('profile', data).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.tokenService.setUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  // Check authentication
  isAuthenticated(): boolean {
    return this.tokenService.isValid();
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === UserRole.ADMIN;
  }

  // Get current user value
  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Clear auth data
  clearAuth(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
  }
}