// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔁 Bu kısımdaki değerleri kendi Firebase projenle değiştir.
const firebaseConfig = {
    apiKey: "AIzaSyBZjwnYJbQdQxApn4BQ-6AB8U9RQu5TiNg",
  authDomain: "chatapp-6493f.firebaseapp.com",
  projectId: "chatapp-6493f",
  storageBucket: "chatapp-6493f.firebasestorage.app",
  messagingSenderId: "855204241861",
  appId: "1:855204241861:web:561efda42f54710d616bac",
  measurementId: "G-MLEYZSHVG8"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
