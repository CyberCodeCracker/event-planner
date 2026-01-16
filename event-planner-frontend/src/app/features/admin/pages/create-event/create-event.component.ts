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
  templateUrl: './create-event.component.html',
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
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId) && numericId > 0) {
          this.isEditMode = true;
          this.eventId = numericId;
          this.loadEvent(numericId);
        }
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data || [];
      }
    });
  }

  loadEvent(id: number) {
    if (isNaN(id) || id <= 0) {
      console.error('Invalid event ID:', id);
      return;
    }
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

  goBack() {
    this.router.navigate(['/admin/events']);
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
        is_active: true
      };
      
      // Only send image file if a new one was selected
      const imageFile = this.selectedImage || undefined;
      
      this.eventService.updateEvent(this.eventId, eventData, imageFile).subscribe({
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
        is_active: true
      };
      
      // Send image file if selected
      const imageFile = this.selectedImage || undefined;
      
      this.eventService.createEvent(eventData, imageFile).subscribe({
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
