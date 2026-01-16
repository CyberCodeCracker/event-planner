import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../models/category.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  // Get all categories
  getCategories(page: number = 1, perPage: number = 10): Observable<ApiResponse<Category[]>> {
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    return this.apiService.get<Category[]>('categories', params);
  }

  // Get category by ID
  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    return this.apiService.get<Category>(`categories/${id}`);
  }

  // Create category
  createCategory(categoryData: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.apiService.post<Category>('categories', categoryData);
  }

  // Update category
  updateCategory(id: number, categoryData: UpdateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.apiService.put<Category>(`categories/${id}`, categoryData);
  }

  // Delete category
  deleteCategory(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`categories/${id}`);
  }

  // Get categories with event counts
  getCategoriesWithCounts(): Observable<ApiResponse<Category[]>> {
    return this.apiService.get<Category[]>('categories/with-counts');
  }

  // Get popular categories
  getPopularCategories(limit: number = 5): Observable<ApiResponse<Category[]>> {
    return this.apiService.get<Category[]>('categories/popular');
  }
}