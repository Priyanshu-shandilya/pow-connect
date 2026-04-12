export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Animal {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  ownerName: string;
  ownerPhone: string;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  animalId: string;
  animalName: string;
  ownerName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'completed' | 'cancelled';
  veterinarian: string;
  createdAt: string;
}

export interface Treatment {
  id: string;
  animalId: string;
  animalName: string;
  medicine: string;
  description: string;
  cost: number;
  date: string;
  status: 'ongoing' | 'completed';
  createdAt: string;
}
