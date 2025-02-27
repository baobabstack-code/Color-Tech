import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '@/services/api';
import type { AuthResponse } from '@/lib/types/auth';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      api.get<{ user: User }>('/users/me')
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Temporary: Accept any login attempt
    const firstName = email.split('@')[0]; // Extract name from email temporarily
    const mockUser = {
      id: '1',
      email: email,
      fullName: firstName.charAt(0).toUpperCase() + firstName.slice(1), // Capitalize first letter
      role: email.includes('admin@') ? 'admin' : 'client'
    };
    
    // Mock token
    const mockToken = 'mock_token_' + Date.now();
    
    // Store token
    localStorage.setItem('token', mockToken);
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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

export default AuthContext; 