import type { Tables } from '../../lib/database.types';

export type EmployeeRow = Tables<'employees'>;

export interface Employee {
  id: string;
  salonId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  bio: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  recentlyAdded: number;
}

export interface CreateEmployeeParams {
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  email?: string;
}

export interface UpdateEmployeeParams {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  email?: string;
}
