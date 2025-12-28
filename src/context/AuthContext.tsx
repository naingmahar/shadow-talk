"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  User, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Cookies from 'js-cookie';

// 1. Define the shape of our Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure Firebase maintains the session even after browser close
    setPersistence(auth, browserLocalPersistence);

    // 2. Listen for Auth State Changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        setUser(firebaseUser);
        
        // Optional: Set a cookie so Middleware/Server-side can see the session
        const token = await firebaseUser.getIdToken();
        Cookies.set('session', token, { expires: 7, secure: true });
      } else {
        // User is logged out
        setUser(null);
        Cookies.remove('session');
      }
      
      // Critical: Set loading to false only AFTER user state is determined
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Global Logout Function
  const logout = async () => {
    try {
      setLoading(true); // Show loading while signing out
      await signOut(auth);
      setUser(null);
      Cookies.remove('session');
      sessionStorage.clear(); // Clean up practice session data
      
      // Use window.location for a hard reset to clear any "ghost" states
      window.location.href = '/';
    } catch (error) {
      console.error("Logout Error:", error);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};