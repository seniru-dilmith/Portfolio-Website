"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextProps } from '@/types/AuthContext';

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on admin pages or when a previous admin session is stored
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        setIsAuthenticated(res.ok);
        if (!res.ok) {
          localStorage.removeItem('isAdmin');
        }
      } catch {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdmin');
      }
    }

    if (typeof window !== 'undefined') {
      const shouldCheck =
        window.location.pathname.startsWith('/admin') ||
        localStorage.getItem('isAdmin') === 'true';
      if (shouldCheck) {
        checkAuth();
      }
    }
  }, []);

  // When user logs in successfully (after login API call that sets cookies)
  const handleLogin = () => {
    // Persist admin flag so we can re-check on refresh
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAdmin', 'true');
    }
    setIsAuthenticated(true);
  };

  // When user logs out, call logout API to clear cookies and update state
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdmin');
    }
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
