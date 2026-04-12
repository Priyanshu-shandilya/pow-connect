import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Animal, Appointment, Treatment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface DataContextType {
  animals: Animal[];
  appointments: Appointment[];
  treatments: Treatment[];
  addAnimal: (animal: Omit<Animal, 'id' | 'createdAt'>) => void;
  updateAnimal: (id: string, data: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  addAppointment: (appt: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addTreatment: (t: Omit<Treatment, 'id' | 'createdAt'>) => void;
  updateTreatment: (id: string, data: Partial<Treatment>) => void;
  deleteTreatment: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const getKey = (userId: string, type: string) => `pawcare_${userId}_${type}`;

const loadData = <T,>(userId: string, type: string): T[] => {
  try {
    const saved = localStorage.getItem(getKey(userId, type));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveData = <T,>(userId: string, type: string, data: T[]) => {
  localStorage.setItem(getKey(userId, type), JSON.stringify(data));
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  // Load user-specific data when user changes
  useEffect(() => {
    if (userId) {
      setAnimals(loadData<Animal>(userId, 'animals'));
      setAppointments(loadData<Appointment>(userId, 'appointments'));
      setTreatments(loadData<Treatment>(userId, 'treatments'));
    } else {
      setAnimals([]);
      setAppointments([]);
      setTreatments([]);
    }
  }, [userId]);

  // Persist on change
  useEffect(() => {
    if (userId) saveData(userId, 'animals', animals);
  }, [animals, userId]);
  useEffect(() => {
    if (userId) saveData(userId, 'appointments', appointments);
  }, [appointments, userId]);
  useEffect(() => {
    if (userId) saveData(userId, 'treatments', treatments);
  }, [treatments, userId]);

  const addAnimal = useCallback((a: Omit<Animal, 'id' | 'createdAt'>) => {
    setAnimals(prev => [...prev, { ...a, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }]);
  }, []);
  const updateAnimal = useCallback((id: string, data: Partial<Animal>) => {
    setAnimals(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, []);
  const deleteAnimal = useCallback((id: string) => {
    setAnimals(prev => prev.filter(a => a.id !== id));
  }, []);

  const addAppointment = useCallback((a: Omit<Appointment, 'id' | 'createdAt'>) => {
    setAppointments(prev => [...prev, { ...a, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }]);
  }, []);
  const updateAppointment = useCallback((id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, []);
  const deleteAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  const addTreatment = useCallback((t: Omit<Treatment, 'id' | 'createdAt'>) => {
    setTreatments(prev => [...prev, { ...t, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }]);
  }, []);
  const updateTreatment = useCallback((id: string, data: Partial<Treatment>) => {
    setTreatments(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);
  const deleteTreatment = useCallback((id: string) => {
    setTreatments(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <DataContext.Provider value={{
      animals, appointments, treatments,
      addAnimal, updateAnimal, deleteAnimal,
      addAppointment, updateAppointment, deleteAppointment,
      addTreatment, updateTreatment, deleteTreatment,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
