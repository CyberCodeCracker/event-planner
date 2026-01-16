import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-list-users',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">
          List of <span class="text-purple-600">Users</span>
        </h1>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Users</h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (user of users; track user.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span class="text-purple-600 font-semibold text-sm">{{ getInitials(user.name) }}</span>
                        </div>
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-blue-600">{{ user.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'" 
                            class="px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(user.created_at) }}</div>
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
export class ListUsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(1, 100).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  }
}
