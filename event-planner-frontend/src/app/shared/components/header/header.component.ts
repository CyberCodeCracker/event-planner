import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin = false;
  userInitials = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === UserRole.ADMIN;
      
      if (user) {
        this.userInitials = user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
      }
    });
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        // Navigation is handled in the auth service
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails on backend, clear local auth and navigate
        this.authService.clearAuth();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}