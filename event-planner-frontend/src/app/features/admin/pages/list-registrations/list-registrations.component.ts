import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../../../core/services/registration.service';
import { Registration } from '../../../../core/models/registration.model';

@Component({
  selector: 'app-list-registrations',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">
          List of <span class="text-purple-600">registrations</span>
        </h1>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Registrations</h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event title</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User's email</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (registration of registrations; track registration.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ registration.event?.title || 'N/A' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(registration.event?.start_date || registration.created_at) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ registration.user?.email || 'user@email.com' }}</div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule]
})
export class ListRegistrationsComponent implements OnInit {
  registrations: Registration[] = [];

  constructor(private registrationService: RegistrationService) {}

  ngOnInit() {
    this.loadRegistrations();
  }

  loadRegistrations() {
    this.registrationService.getAllRegistrations(1, 100).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.registrations = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading registrations:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  }
}
