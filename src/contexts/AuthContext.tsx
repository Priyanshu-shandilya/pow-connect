import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';

interface StoredUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getRegisteredUsers = (): StoredUser[] => {
  const saved = localStorage.getItem('pawcare_registered_users');
  return saved ? JSON.parse(saved) : [];
};

const getAllUsers = (): StoredUser[] => {
  const registered = getRegisteredUsers();
  const allUsers = [...mockUsers.map(u => ({ ...u }))];
  registered.forEach(r => {
    if (!allUsers.find(u => u.email === r.email)) {
      allUsers.push(r);
    }
  });
  return allUsers;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pawcare_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const users = getAllUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    const userData: User = { id: found.id, name: found.name, email: found.email, role: found.role };
    setUser(userData);
    localStorage.setItem('pawcare_user', JSON.stringify(userData));
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const users = getAllUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser: StoredUser = { id: Date.now().toString(), name, email, password, role: 'user' };
    const registered = getRegisteredUsers();
    registered.push(newUser);
    localStorage.setItem('pawcare_registered_users', JSON.stringify(registered));
    const userData: User = { id: newUser.id, name, email, role: 'user' };
    setUser(userData);
    localStorage.setItem('pawcare_user', JSON.stringify(userData));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('pawcare_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
