import type { Employee, EmployeeRow } from '../types';

export function mapEmployee(row: EmployeeRow): Employee {
  return {
    id: row.id,
    salonId: row.salon_id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: row.display_name,
    isActive: row.is_active,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    phoneNumber: row.phone_number,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
