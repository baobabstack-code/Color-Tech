import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Client login
      if (email === 'test@example.com' && password === 'password123') {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: email,
          role: 'client'
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      // Admin login
      else if (email.startsWith('admin@') && password === 'admin123') {
        const mockUser: User = {
          id: '3',
          name: 'Admin User',
          email: email,
          role: 'admin'
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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