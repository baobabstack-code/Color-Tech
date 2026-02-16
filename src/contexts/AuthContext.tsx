"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { isAdminEmail } from '@/lib/adminUtils';

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
        signIn(); // Open standard login if needed
    };

    const handleSignOut = () => {
        signOut();
    };

    // Check if user is admin based on session data OR email check
    const isAdmin = !!(session?.user?.isAdmin || isAdminEmail(session?.user?.email));

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