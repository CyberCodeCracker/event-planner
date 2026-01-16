import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isAdmin = false;
  userInitials = '';
  isDropdownVisible = false;
  private hideTimeoutId: any = null;

  constructor(
    public authService: AuthService,
    public router: Router
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

  ngOnDestroy() {
    this.clearHideTimeout();
  }

  showDropdown() {
    this.clearHideTimeout();
    this.isDropdownVisible = true;
  }

  hideDropdownWithDelay() {
    this.clearHideTimeout();
    this.hideTimeoutId = setTimeout(() => {
      this.isDropdownVisible = false;
    }, 1000); // 1 second delay
  }

  closeDropdown() {
    this.clearHideTimeout();
    this.isDropdownVisible = false;
  }

  private clearHideTimeout() {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }

  onLogout() {
    this.closeDropdown();
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