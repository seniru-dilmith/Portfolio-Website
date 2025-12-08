"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextProps } from '@/types/AuthContext';
import { useHydration } from '@/hooks/useHydration';
import { apiFetch } from "@/lib/api";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isHydrated = useHydration();

  // Check auth status on admin pages
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    async function checkAuth() {
      try {
        const res = await apiFetch('/api/admin/me');
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    }

    const path = window.location.pathname;
    const isLoginPage = path === '/admin/login';

    // Check auth on all pages to verify admin status globally
    if (!isLoginPage) {
      checkAuth();
    }
  }, [isHydrated]);
  // When user logs in successfully (after login API call that sets cookies)
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // When user logs out, call logout API to clear cookies and update state
  const handleLogout = async () => {
    try {
      await apiFetch('/api/admin/logout', { method: 'POST' });
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
