'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Profile } from '@/lib/supabase';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        const storedProfile = localStorage.getItem('userProfile');

        if (storedUserId && storedProfile) {
          setUser({ id: storedUserId });
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('[v0] Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Sign in failed');
    }

    const data = await response.json();
    setUser(data.user);
    setProfile(data.profile);
    
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('userProfile', JSON.stringify(data.profile));
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          // If response is not JSON (HTML error page), provide a better message
          throw new Error(
            response.status === 503
              ? 'Database connection failed. Please check your MongoDB URI in environment variables.'
              : `Sign up failed: ${response.statusText}`
          );
        }
        throw new Error(error.error || 'Sign up failed');
      }

      const data = await response.json();
      setUser(data.user);
      
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userProfile', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        phone: null,
        location: null,
        farm_name: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
    } catch (err) {
      console.error('[v0] Sign up error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('userId');
      localStorage.removeItem('userProfile');
    } catch (error) {
      console.error('[v0] Error during sign out:', error);
    }
  };

  const refetchProfile = async () => {
    if (!user) return;
    
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('[v0] Error fetching profile:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    // Update local storage
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile, refetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
