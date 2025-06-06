"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextProps } from '@/types/AuthContext';

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount by calling an API endpoint that verifies cookie
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');  // new endpoint that returns 200 if logged in
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // When user logs in successfully (after login API call that sets cookies)
  const handleLogin = () => {
    // just update state to true because token cookie is set by server already
    setIsAuthenticated(true);
  };

  // When user logs out, call logout API to clear cookies and update state
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
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
