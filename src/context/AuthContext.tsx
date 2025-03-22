import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextProps } from '@/types/AuthContext';

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Update authentication status on token changes
  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    updateAuthState(); // Initial check
    window.addEventListener('storage', updateAuthState); // Listen for storage changes

    return () => window.removeEventListener('storage', updateAuthState);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
