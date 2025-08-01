import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';


interface User {
  uid: string;
  displayName?: string;
  email?: string;
}


export const authService = {
  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
     
      // Update display name
      if (user) {
        await updateProfile(user, { displayName });
      }
     
      return {
        uid: user.uid,
        email: user.email || undefined,
        displayName: displayName
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },


  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
     
      return {
        uid: user.uid,
        email: user.email || undefined,
        displayName: user.displayName || undefined
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },


  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Çıkış yapılırken bir hata oluştu');
    }
  },


  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          displayName: firebaseUser.displayName || undefined
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  },


  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı';
      case 'auth/wrong-password':
        return 'Hatalı şifre';
      case 'auth/invalid-email':
        return 'Geçersiz e-posta adresi';
      case 'auth/weak-password':
        return 'Şifre en az 6 karakter olmalıdır';
      case 'auth/email-already-in-use':
        return 'Bu e-posta adresi zaten kullanımda';
      case 'auth/too-many-requests':
        return 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin';
      default:
        return 'Bir hata oluştu. Lütfen tekrar deneyin';
    }
  }
};



