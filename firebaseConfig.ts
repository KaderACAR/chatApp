// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//import { getAnalytics } from 'firebase/analytics';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZjwnYJbQdQxApn4BQ-6AB8U9RQu5TiNg",
  authDomain: "chatapp-6493f.firebaseapp.com",
  projectId: "chatapp-6493f",
  storageBucket: "chatapp-6493f.firebasestorage.app",
  messagingSenderId: "855204241861",
  appId: "1:855204241861:web:561efda42f54710d616bac",
  measurementId: "G-MLEYZSHVG8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
//const analytics = getAnalytics(app);




export { auth, db };


