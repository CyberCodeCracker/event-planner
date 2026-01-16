import { Category } from './category.model';
import { User } from './user.model';

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  place: string;
  price: number;
  category_id: number;
  capacity: number;
  image: string | null;
  created_by: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  creator?: User;
  available_spots?: number;
  registrations_count?: number;
  is_registered?: boolean;
  is_free?: boolean;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  place: string;
  price: number;
  category_id: number;
  capacity: number;
  image?: string | null;
  is_active?: boolean;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  place?: string;
  price?: number;
  category_id?: number;
  capacity?: number;
  image?: string | null;
  is_active?: boolean;
}