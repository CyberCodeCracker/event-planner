import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Helper method to get headers with auth token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // GET request
  get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    const options = {
      headers: this.getHeaders(),
      params: new HttpParams({ fromObject: params })
    };

    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  // POST request
  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  // PUT request
  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  // PATCH request
  patch<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    const options = {
      headers: this.getHeaders()
    };

    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  // Upload file
  upload<T>(endpoint: string, formData: FormData): Observable<ApiResponse<T>> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Check if _method is set for PUT/PATCH requests
    const method = formData.get('_method') as string;
    const url = `${this.baseUrl}/${endpoint}`;
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    if (method === 'PUT') {
      formData.delete('_method');
      return this.http.put<ApiResponse<T>>(url, formData, { headers })
        .pipe(catchError(this.handleError));
    } else if (method === 'PATCH') {
      formData.delete('_method');
      return this.http.patch<ApiResponse<T>>(url, formData, { headers })
        .pipe(catchError(this.handleError));
    }
    
    return this.http.post<ApiResponse<T>>(url, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You do not have permission.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 422) {
        errorMessage = 'Validation error. Please check your input.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}