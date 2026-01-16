import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/api-response.model';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
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

  // Login - backend returns AuthResponse directly
  login(credentials: LoginRequest): Observable<AuthResponse<User>> {
    return this.apiService.post<AuthResponse<User>>('login', credentials).pipe(
      map((response) => {
        // Handle both wrapped (response.data) and direct (response itself) responses
        const authResponse = (response as any).data || response;
        return authResponse as AuthResponse<User>;
      }),
      tap((authResponse) => {
        if (authResponse && authResponse.success && authResponse.token && authResponse.user) {
          this.tokenService.setToken(authResponse.token);
          this.tokenService.setUser(authResponse.user);
          this.currentUserSubject.next(authResponse.user);
        }
      })
    );
  }

  // Register - backend returns AuthResponse directly
  register(data: RegisterRequest): Observable<AuthResponse<User>> {
    return this.apiService.post<AuthResponse<User>>('register', data).pipe(
      map((response) => {
        // Handle both wrapped (response.data) and direct (response itself) responses
        const authResponse = (response as any).data || response;
        return authResponse as AuthResponse<User>;
      }),
      tap((authResponse) => {
        if (authResponse && authResponse.success && authResponse.token && authResponse.user) {
          this.tokenService.setToken(authResponse.token);
          this.tokenService.setUser(authResponse.user);
          this.currentUserSubject.next(authResponse.user);
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
      }),
      catchError((error) => {
        // Even if logout fails on backend, clear local auth
        this.clearAuth();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  // Get current user
  getCurrentUser(): Observable<User> {
    return this.apiService
      .get<{ success: boolean; user: User }>('user')
      .pipe(
        map((response) => {
          // Handle both wrapped (response.data) and direct (response itself) responses
          const userResponse = (response as any).data || response;
          return userResponse as { success: boolean; user: User };
        }),
        tap((userResponse) => {
          if (userResponse && userResponse.success && userResponse.user) {
            this.tokenService.setUser(userResponse.user);
            this.currentUserSubject.next(userResponse.user);
          }
        }),
        map((userResponse) => userResponse.user)
      );
  }

  // Update profile
  updateProfile(data: any): Observable<any> {
    return this.apiService.put<any>('profile', data).pipe(
      tap((response) => {
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