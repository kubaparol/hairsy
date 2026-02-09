import type { User } from '@supabase/supabase-js';
import type { Database, Tables } from './database.types';

export type UserRole = Database['public']['Enums']['user_role'];
export type UserProfile = Tables<'profiles'>;

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  error?: Error | null;
}
