import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';


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
    // Firebase Authentication state listener
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });


    return unsubscribe;
  }, []);


  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
    } catch (error) {
      throw error;
    }
  };


  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      throw error;
    }
  };


  const register = async (email: string, password: string, displayName: string) => {
    try {
      console.log('Register başladı:', { email, displayName });
     
      const userData = await authService.register(email, password, displayName);
      console.log('AuthService register tamamlandı:', userData);


      // Firestore'a kullanıcı bilgisi ekle
      console.log('Firestore\'a kullanıcı kaydediliyor...');
      await setDoc(doc(db, 'users', userData.uid), {
        uid: userData.uid,
        email: userData.email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
      });
      console.log('Firestore\'a kullanıcı kaydedildi');


    } catch (error) {
      console.error('Register hatası:', error);
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



