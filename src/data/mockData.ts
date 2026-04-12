import { Animal, Appointment, Treatment, User } from '@/types';

export const mockUsers: (User & { password: string })[] = [
  { id: '1', name: 'Admin User', email: 'admin@pawcare.com', role: 'admin', password: 'admin123' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', password: 'user123' },
];

export const mockAnimals: Animal[] = [
  { id: '1', name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', age: 3, ownerName: 'John Doe', ownerPhone: '555-0101', notes: 'Friendly and active', createdAt: '2024-01-15' },
  { id: '2', name: 'Whiskers', type: 'Cat', breed: 'Persian', age: 5, ownerName: 'Sarah Johnson', ownerPhone: '555-0102', notes: 'Indoor cat, loves naps', createdAt: '2024-02-20' },
  { id: '3', name: 'Rex', type: 'Dog', breed: 'German Shepherd', age: 2, ownerName: 'Mike Brown', ownerPhone: '555-0103', notes: 'Very protective', createdAt: '2024-03-10' },
  { id: '4', name: 'Luna', type: 'Cat', breed: 'Siamese', age: 1, ownerName: 'Emily Davis', ownerPhone: '555-0104', notes: 'Playful kitten', createdAt: '2024-03-22' },
  { id: '5', name: 'Charlie', type: 'Dog', breed: 'Labrador', age: 4, ownerName: 'Tom Wilson', ownerPhone: '555-0105', notes: 'Loves water and fetch', createdAt: '2024-04-01' },
  { id: '6', name: 'Milo', type: 'Rabbit', breed: 'Holland Lop', age: 1, ownerName: 'Anna Lee', ownerPhone: '555-0106', notes: 'Soft and cuddly', createdAt: '2024-04-05' },
  { id: '7', name: 'Bella', type: 'Dog', breed: 'Poodle', age: 6, ownerName: 'Chris Martin', ownerPhone: '555-0107', notes: 'Recently groomed', createdAt: '2024-04-10' },
  { id: '8', name: 'Oliver', type: 'Cat', breed: 'Maine Coon', age: 3, ownerName: 'Lisa Park', ownerPhone: '555-0108', notes: 'Largest domestic cat breed', createdAt: '2024-04-12' },
  { id: '9', name: 'Daisy', type: 'Dog', breed: 'Beagle', age: 2, ownerName: 'Rachel Green', ownerPhone: '555-0109', notes: 'Great sense of smell', createdAt: '2024-04-15' },
  { id: '10', name: 'Simba', type: 'Cat', breed: 'Bengal', age: 4, ownerName: 'David Kim', ownerPhone: '555-0110', notes: 'Wild looking, very energetic', createdAt: '2024-04-18' },
  { id: '11', name: 'Rocky', type: 'Dog', breed: 'Bulldog', age: 5, ownerName: 'James Taylor', ownerPhone: '555-0111', notes: 'Calm and gentle giant', createdAt: '2024-04-20' },
  { id: '12', name: 'Cleo', type: 'Cat', breed: 'Ragdoll', age: 2, ownerName: 'Sophie Turner', ownerPhone: '555-0112', notes: 'Goes limp when picked up', createdAt: '2024-05-01' },
  { id: '13', name: 'Thumper', type: 'Rabbit', breed: 'Mini Rex', age: 1, ownerName: 'Kevin Hart', ownerPhone: '555-0113', notes: 'Loves to binky', createdAt: '2024-05-05' },
  { id: '14', name: 'Max', type: 'Dog', breed: 'Husky', age: 3, ownerName: 'Olivia Stone', ownerPhone: '555-0114', notes: 'Very vocal, loves snow', createdAt: '2024-05-10' },
  { id: '15', name: 'Nemo', type: 'Bird', breed: 'Cockatiel', age: 2, ownerName: 'Peter Parker', ownerPhone: '555-0115', notes: 'Can whistle tunes', createdAt: '2024-05-12' },
];

export const mockAppointments: Appointment[] = [
  { id: '1', animalId: '1', animalName: 'Buddy', ownerName: 'John Doe', date: '2026-04-14', time: '09:00', reason: 'Annual checkup', status: 'pending', veterinarian: 'Dr. Smith', createdAt: '2026-04-10' },
  { id: '2', animalId: '2', animalName: 'Whiskers', ownerName: 'Sarah Johnson', date: '2026-04-14', time: '10:30', reason: 'Vaccination', status: 'pending', veterinarian: 'Dr. Johnson', createdAt: '2026-04-10' },
  { id: '3', animalId: '3', animalName: 'Rex', ownerName: 'Mike Brown', date: '2026-04-13', time: '14:00', reason: 'Dental cleaning', status: 'completed', veterinarian: 'Dr. Smith', createdAt: '2026-04-08' },
  { id: '4', animalId: '4', animalName: 'Luna', ownerName: 'Emily Davis', date: '2026-04-15', time: '11:00', reason: 'Spay surgery', status: 'pending', veterinarian: 'Dr. Garcia', createdAt: '2026-04-11' },
  { id: '5', animalId: '5', animalName: 'Charlie', ownerName: 'Tom Wilson', date: '2026-04-12', time: '16:00', reason: 'Ear infection', status: 'cancelled', veterinarian: 'Dr. Johnson', createdAt: '2026-04-06' },
  { id: '6', animalId: '9', animalName: 'Daisy', ownerName: 'Rachel Green', date: '2026-04-16', time: '09:30', reason: 'Routine vaccination', status: 'pending', veterinarian: 'Dr. Garcia', createdAt: '2026-04-12' },
  { id: '7', animalId: '14', animalName: 'Max', ownerName: 'Olivia Stone', date: '2026-04-16', time: '14:30', reason: 'Skin allergy check', status: 'pending', veterinarian: 'Dr. Smith', createdAt: '2026-04-12' },
];

export const mockTreatments: Treatment[] = [
  { id: '1', animalId: '1', animalName: 'Buddy', medicine: 'Amoxicillin', description: 'Antibiotic for skin infection', cost: 45, date: '2026-04-10', status: 'ongoing', createdAt: '2026-04-10' },
  { id: '2', animalId: '3', animalName: 'Rex', medicine: 'Metacam', description: 'Anti-inflammatory for joint pain', cost: 60, date: '2026-04-08', status: 'completed', createdAt: '2026-04-08' },
  { id: '3', animalId: '2', animalName: 'Whiskers', medicine: 'Frontline Plus', description: 'Flea and tick prevention', cost: 35, date: '2026-04-05', status: 'completed', createdAt: '2026-04-05' },
  { id: '4', animalId: '5', animalName: 'Charlie', medicine: 'Otomax', description: 'Ear drops for infection treatment', cost: 28, date: '2026-04-11', status: 'ongoing', createdAt: '2026-04-11' },
  { id: '5', animalId: '10', animalName: 'Simba', medicine: 'Prednisolone', description: 'Steroid for allergic reaction', cost: 55, date: '2026-04-12', status: 'ongoing', createdAt: '2026-04-12' },
];
