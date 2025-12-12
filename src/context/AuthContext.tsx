"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextProps } from '@/types/AuthContext';
import { useHydration } from '@/hooks/useHydration';
import { apiFetch } from "@/lib/api";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isHydrated = useHydration();

  // Check auth status on admin pages
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    async function checkAuth() {
      try {
        const res = await apiFetch('/api/admin/me');
        if (res.ok) {
          setIsAuthenticated(true);
          localStorage.setItem('admin_logged_in', 'true');
        } else {
          throw new Error('Not authenticated');
        }
      } catch {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_logged_in');
      } finally {
        setIsLoading(false);
      }
    }

    const path = window.location.pathname;
    const isLoginPage = path === '/admin/login';
    const isAdminRoute = path.startsWith('/admin');
    const hasAuthFlag = localStorage.getItem('admin_logged_in') === 'true';

    // Check auth only if on admin route (excluding login) OR if we have a local flag saying we might be logged in
    if (!isLoginPage && (isAdminRoute || hasAuthFlag)) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [isHydrated]);

  // When user logs in successfully (after login API call that sets cookies)
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('admin_logged_in', 'true');
  };

  // When user logs out, call logout API to clear cookies and update state
  const handleLogout = async () => {
    try {
      await apiFetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsAuthenticated(false);
    localStorage.removeItem('admin_logged_in');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, handleLogin, handleLogout }}>
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
