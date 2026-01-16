import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/role.guard';

// Layouts
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

// Public Pages
import { HomeComponent } from './features/public/pages/home/home.component';

// Auth Pages
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';

// Dashboard Pages
import { DashboardHomeComponent } from './features/dashboard/pages/dashboard-home/dashboard-home.component';
import { MyEventsComponent } from './features/dashboard/pages/my-events/my-events.component';
import { MyRegistrationsComponent } from './features/dashboard/pages/my-registrations/my-registrations.component';
import { ProfileComponent } from './features/profile/pages/profile/profile.component';

// Admin Pages
import { AdminDashboardComponent } from './features/admin/pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  // Auth Routes
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Public Routes
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      // Add more public routes here
    ]
  },

  // Dashboard Routes (Authenticated Users)
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'my-events', component: MyEventsComponent },
      { path: 'my-registrations', component: MyRegistrationsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '**', redirectTo: '' }
    ]
  },

  // Admin Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      // Add more admin routes here
    ]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];