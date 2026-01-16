export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  events_count?: number;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}