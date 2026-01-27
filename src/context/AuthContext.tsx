import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  organization?: string;
  location?: string;
  joinedDate?: string;
  bio?: string;
  website?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('datacraft_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      email,
      name: name || email.split('@')[0],
      role: 'Data Scientist',
      organization: 'DataCraft AI',
      location: 'San Francisco, CA',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      bio: 'Passionate about data privacy and synthetic data generation.',
      website: 'https://datacraft.ai',
      phoneNumber: '1234567890'
    };
    setUser(newUser);
    localStorage.setItem('datacraft_user', JSON.stringify(newUser));
  };

  const signup = (email: string, name: string) => {
    login(email, name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('datacraft_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('datacraft_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
