"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface AuthContextType {
    user: Session['user'] | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    signIn: () => void;
    signOut: () => void;
    session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(status === 'loading');
    }, [status]);

    const handleSignIn = () => {
        signIn('google');
    };

    const handleSignOut = () => {
        signOut();
    };

    // Check if user is admin based on email
    const isAdmin = session?.user?.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'colorterch25@gmail.com');

    const value: AuthContextType = {
        user: session?.user || null,
        isLoading,
        isAuthenticated: !!session,
        isAdmin,
        signIn: handleSignIn,
        signOut: handleSignOut,
        session,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}