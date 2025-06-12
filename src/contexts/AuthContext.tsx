"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '@/services/api';
import jwtConfig from '@/lib/jwt';
import { useToast } from '@/components/ui/use-toast';

// Define the user interface for our application
interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

// Define possible API response user formats
interface ApiUserResponse {
  id: string;
  email: string;
  role: string;
  // These fields may or may not be present depending on the API
  fullName?: string;
  first_name?: string;
  last_name?: string;
}

interface AuthResponse {
  token: string;
  user: ApiUserResponse;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast ? useToast() : null;

  // Check for existing session on mount
  useEffect(() => {
    const token = jwtConfig.getToken();
    if (token) {
      setIsLoading(true);
      // Verify token and get user data
      api.get<{ user: ApiUserResponse }>('/auth/profile')
        .then(response => {
          const apiUser = response.data.user;
          // Convert API user to our application user format
          setUser({
            id: apiUser.id,
            email: apiUser.email,
            fullName: apiUser.fullName || 
                     (apiUser.first_name && apiUser.last_name ? 
                      `${apiUser.first_name} ${apiUser.last_name}` : 
                      apiUser.email),
            role: apiUser.role
          });
          setError(null);
        })
        .catch((err) => {
          console.error('Session verification failed:', err);
          jwtConfig.removeToken();
          setError('Your session has expired. Please log in again.');
          if (toast?.toast) {
            toast.toast({
              title: 'Session Expired',
              description: 'Your session has expired. Please log in again.',
              variant: 'destructive',
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Make actual login API call
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      // Extract token and user data from response
      const { token, user: apiUser } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Store the real token
      jwtConfig.setToken(token);
      
      // Format user data based on the API response structure
      const userData: User = {
        id: apiUser.id,
        email: apiUser.email,
        fullName: apiUser.fullName || 
                 (apiUser.first_name && apiUser.last_name ? 
                  `${apiUser.first_name} ${apiUser.last_name}` : 
                  apiUser.email),
        role: apiUser.role
      };
      
      setUser(userData);
      
      if (toast?.toast) {
        toast.toast({
          title: 'Login Successful',
          description: `Welcome back, ${userData.fullName}!`,
        });
      }
      
      return response.data;
    } catch (err: any) {
      console.error('Login failed:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      
      if (toast?.toast) {
        toast.toast({
          title: 'Login Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API if available
      const token = jwtConfig.getToken();
      if (token) {
        await api.post('/auth/logout');
      }
      
      setUser(null);
      jwtConfig.removeToken();
      
      if (toast?.toast) {
        toast.toast({
          title: 'Logged Out',
          description: 'You have been successfully logged out.',
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
      // Even if the API call fails, we should still clear local state
      setUser(null);
      jwtConfig.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout,
      isLoading,
      error
    }}>
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