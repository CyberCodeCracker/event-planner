import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../../core/services/category.service';
import { Category, CreateCategoryRequest } from '../../../../core/models/category.model';

@Component({
  selector: 'app-list-categories',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">
          List of <span class="text-purple-600">categories</span>
        </h1>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Categories</h2>
            <button (click)="openCreateModal()" 
                    class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              Create category
            </button>
          </div>
          
          <div class="p-6">
            <div class="text-sm text-gray-500 mb-4">Category</div>
            <div class="space-y-2">
              @for (category of categories; track category.id) {
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span class="text-gray-900">{{ category.name }}</span>
                  <div class="relative">
                    <button (click)="toggleMenu(category.id)" 
                            class="text-gray-500 hover:text-gray-700">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </button>
                    @if (openMenuId === category.id) {
                      <div class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border py-2 z-10">
                        <button (click)="editCategory(category)" 
                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Edit
                        </button>
                        <button (click)="deleteCategory(category.id)" 
                                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Delete
                        </button>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Category Modal -->
    @if (showCreateModal) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="closeCreateModal()">
        <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4" (click)="$event.stopPropagation()">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Create category</h2>
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Category name</label>
              <input type="text" 
                     formControlName="name"
                     placeholder="Enter category name"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            <div class="flex gap-4">
              <button type="button" 
                      (click)="closeCreateModal()"
                      class="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                Cancel
              </button>
              <button type="submit" 
                      [disabled]="categoryForm.invalid"
                      class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ListCategoriesComponent implements OnInit {
  categories: Category[] = [];
  showCreateModal = false;
  openMenuId: number | null = null;
  categoryForm: FormGroup;
  editingCategory: Category | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      }
    });
  }

  openCreateModal() {
    this.editingCategory = null;
    this.categoryForm.reset();
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  toggleMenu(categoryId: number) {
    this.openMenuId = this.openMenuId === categoryId ? null : categoryId;
  }

  editCategory(category: Category) {
    this.openMenuId = null;
    this.editingCategory = category;
    this.categoryForm.patchValue({ name: category.name });
    this.showCreateModal = true;
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;

    const categoryData: CreateCategoryRequest = {
      name: this.categoryForm.value.name
    };

    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory.id, categoryData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
            this.closeCreateModal();
          }
        }
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
            this.closeCreateModal();
          }
        }
      });
    }
  }

  deleteCategory(categoryId: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
          }
        }
      });
    }
    this.openMenuId = null;
  }
}
