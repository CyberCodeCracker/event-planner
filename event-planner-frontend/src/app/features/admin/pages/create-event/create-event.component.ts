import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../core/services/event.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Event, CreateEventRequest, UpdateEventRequest } from '../../../../core/models/event.model';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-create-event',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ isEditMode ? 'Edit Event' : 'Create Event' }}</h1>
        
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="bg-white rounded-xl shadow-md p-8 space-y-6">
          <!-- Event Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input type="text" 
                   formControlName="title"
                   placeholder="Title"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select formControlName="category_id"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Select category</option>
              @for (category of categories; track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>

          <!-- Date Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start date</label>
              <input type="datetime-local" 
                     formControlName="start_date"
                     placeholder="date"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End date</label>
              <input type="datetime-local" 
                     formControlName="end_date"
                     placeholder="date"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
          </div>

          <!-- Place -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Place</label>
            <input type="text" 
                   formControlName="place"
                   placeholder="Place"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
          </div>

          <!-- Capacity -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
            <input type="number" 
                   formControlName="capacity"
                   placeholder="Capacity"
                   min="1"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
          </div>

          <!-- Pricing -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
            <select formControlName="pricing_type"
                    (change)="onPricingChange()"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="free">Free Access</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <!-- Amount (only if paid) -->
          @if (eventForm.get('pricing_type')?.value === 'paid') {
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input type="number" 
                     formControlName="price"
                     placeholder="Amount"
                     min="0"
                     step="0.01"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
          }

          <!-- Event Description Section -->
          <div class="pt-6 border-t">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Event Description</h2>
            
            <!-- Event Image -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                @if (imagePreview) {
                  <img [src]="imagePreview" alt="Preview" class="max-h-64 mx-auto mb-4 rounded-lg">
                } @else {
                  <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                }
                <input type="file" 
                       accept="image/*"
                       (change)="onImageChange($event)"
                       class="hidden"
                       #fileInput>
                <button type="button" 
                        (click)="fileInput.click()"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  {{ imagePreview ? 'Change Image' : 'Upload Image' }}
                </button>
              </div>
            </div>

            <!-- Event Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
              <textarea formControlName="description"
                        rows="6"
                        placeholder="Type here..."
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-6">
            <button type="submit" 
                    [disabled]="eventForm.invalid || isLoading"
                    class="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Event' : 'Create event') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  isEditMode = false;
  eventId: number | null = null;
  imagePreview: string | null = null;
  selectedImage: File | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      category_id: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      place: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      pricing_type: ['free'],
      price: [0],
      description: ['', Validators.required],
      image: [null]
    });
  }

  ngOnInit() {
    this.loadCategories();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = +id;
      this.loadEvent(+id);
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data || [];
      }
    });
  }

  loadEvent(id: number) {
    this.eventService.getEventById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const event = response.data;
          this.eventForm.patchValue({
            title: event.title,
            category_id: event.category_id,
            start_date: this.formatDateForInput(event.start_date),
            end_date: this.formatDateForInput(event.end_date),
            place: event.place,
            capacity: event.capacity,
            pricing_type: event.price === 0 ? 'free' : 'paid',
            price: event.price,
            description: event.description
          });
          if (event.image) {
            this.imagePreview = event.image;
          }
        }
      }
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onPricingChange() {
    if (this.eventForm.get('pricing_type')?.value === 'free') {
      this.eventForm.patchValue({ price: 0 });
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.eventForm.invalid) return;

    this.isLoading = true;
    const formValue = this.eventForm.value;
    
    if (this.isEditMode && this.eventId) {
      const eventData: UpdateEventRequest = {
        title: formValue.title,
        description: formValue.description,
        start_date: new Date(formValue.start_date).toISOString(),
        end_date: new Date(formValue.end_date).toISOString(),
        place: formValue.place,
        price: formValue.pricing_type === 'free' ? 0 : formValue.price,
        category_id: formValue.category_id,
        capacity: formValue.capacity,
        image: this.imagePreview,
        is_active: true
      };
      
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/admin/events']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating event:', error);
          this.isLoading = false;
        }
      });
    } else {
      const eventData: CreateEventRequest = {
        title: formValue.title,
        description: formValue.description,
        start_date: new Date(formValue.start_date).toISOString(),
        end_date: new Date(formValue.end_date).toISOString(),
        place: formValue.place,
        price: formValue.pricing_type === 'free' ? 0 : formValue.price,
        category_id: formValue.category_id,
        capacity: formValue.capacity,
        image: this.imagePreview,
        is_active: true
      };
      
      this.eventService.createEvent(eventData).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/admin/events']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.isLoading = false;
        }
      });
    }
  }
}
