"use client";

import React, { createContext, useContext } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";

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
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  const login = async (email: string, password: string) => {
    // Clerk handles login through their components
    // This is kept for compatibility but redirects to sign-in
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
    return Promise.resolve();
  };

  const logout = async () => {
    await signOut();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const user: User | null = clerkUser
    ? {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: clerkUser.fullName,
      role: clerkUser.publicMetadata?.role as string || "user",
    }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!clerkUser,
        login,
        logout,
        isLoading: !isLoaded,
        error: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};