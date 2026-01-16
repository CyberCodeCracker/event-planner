// Base API Response Interface
export interface BaseApiResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

// Generic API Response with Data
export interface ApiResponse<T> extends BaseApiResponse {
  data?: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Auth-specific API Response
export interface AuthResponse<T> extends BaseApiResponse {
  user: T;
  token: string;
}