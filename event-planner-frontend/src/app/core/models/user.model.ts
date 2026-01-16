export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  role_label?: string;
  profile_image: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  phone?: string | null;
  profile_image?: string | null;
}