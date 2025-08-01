import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { db } from '../config/firebaseConfig'; // Firestore bağlantın burada olmalı
import { doc, setDoc } from 'firebase/firestore'; // Firestore ekleme



interface User {
  uid: string;
  displayName?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  // Removed duplicate register function

const register = async (email: string, password: string, displayName: string) => {
  try {
    const userData = await authService.register(email, password, displayName);
    setUser(userData);

    // Firestore'a kullanıcı bilgisi ekle
    await setDoc(doc(db, 'users', userData.uid), {
      uid: userData.uid,
      email: userData.email,
      displayName: displayName,
      createdAt: new Date().toISOString(),
    });

  } catch (error) {
    throw error;
  }
};


  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 