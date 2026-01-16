import { Event } from './event.model';
import { User } from './user.model';

export interface Registration {
  id: number;
  user_id: number;
  event_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
  event?: Event;
}