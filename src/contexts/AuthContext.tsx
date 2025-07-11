"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    setIsLoading(status === 'loading');
    if (status === 'authenticated' && session?.user) {
      setError(null);
    }
  }, [status, session]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        toast.toast({
          title: 'Login Failed',
          description: result.error,
          variant: 'destructive',
        });
        throw new Error(result.error);
      }

      if (result?.ok) {
        toast.toast({
          title: 'Login Successful',
          description: `Welcome back!`,
        });
      }
      return result;
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'An unexpected error occurred during login.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      toast.toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (err) {
      console.error('Logout error:', err);
      setError('An unexpected error occurred during logout.');
    } finally {
      setIsLoading(false);
    }
  };

  const user: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email || '',
    name: session.user.name,
    role: (session.user as any).role, // Cast session.user to any to access role
  } : null;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      isLoading,
      error,
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