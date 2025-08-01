import { collection, addDoc, query, where, getDocs, onSnapshot, doc, getDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';


export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: any;
}


export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: any;
}


export interface User {
  uid: string;
  displayName?: string;
  email?: string;
  createdAt?: string;
}


export const chatService = {
  async sendMessage(chatId: string, text: string, senderId: string, senderName: string) {
    try {
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const messageData = {
        text,
        senderId,
        senderName,
        timestamp: new Date(),
      };
     
      // Mesajı ekle
      const messageRef = await addDoc(messagesRef, messageData);
     
      // Chat'in son mesajını güncelle
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: {
          text,
          senderId,
          senderName,
          timestamp: new Date(),
        },
        lastMessageTime: new Date(),
      });
     
      return messageRef.id;
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      throw error;
    }
  },


  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
   
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      callback(messages);
    });
   
    return unsubscribe;
  },


  subscribeToChats(userId: string, callback: (chats: Chat[]) => void) {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', userId));
   
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as Chat));
      callback(chats);
    });
   
    return unsubscribe;
  },


  async createChat(participants: string[]) {
    try {
      const chatsRef = collection(db, 'chats');


      // Check if a chat already exists between these participants
      const q = query(chatsRef, where('participants', 'array-contains', participants[0]));
      const querySnapshot = await getDocs(q);


      console.log('Checking for existing chats with participants:', participants);
      for (const doc of querySnapshot.docs) {
        console.log('Existing chat found:', doc.id, doc.data());
        const chat = doc.data() as Chat;
        if (participants.every((p) => chat.participants.includes(p))) {
          console.log('Returning existing chat ID:', doc.id);
          return doc.id; // Return existing chat ID
        }
      }


      console.log('No existing chat found. Creating a new chat.');
      // Create a new chat if none exists
      const newChat = await addDoc(chatsRef, {
        participants,
        lastMessage: null,
        lastMessageTime: null,
        createdAt: new Date(),
      });


      return newChat.id;
    } catch (error) {
      console.error('Chat oluşturma hatası:', error);
      throw error;
    }
  },


  async getUserById(userId: string) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? { uid: userDoc.id, ...userDoc.data() } : null;
    } catch (error) {
      console.error('Kullanıcı getirme hatası:', error);
      return null;
    }
  },


  async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('participants', 'array-contains', userId));


      const querySnapshot = await getDocs(q);
      const chats: Chat[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];


      return chats;
    } catch (error) {
      console.error('Chat listesi getirme hatası:', error);
      return [];
    }
  },


  async getAllUsers(): Promise<User[]> {
    try {
      console.log('getAllUsers çağrıldı');
      const usersRef = collection(db, 'users');
      console.log('users collection referansı alındı');
     
      const querySnapshot = await getDocs(usersRef);
      console.log('Firestore query tamamlandı, döküman sayısı:', querySnapshot.docs.length);
     
      const users = querySnapshot.docs.map((doc) => {
        const userData = {
          uid: doc.id,
          ...doc.data(),
        };
        console.log('Kullanıcı verisi:', userData);
        return userData;
      }) as User[];
     
      console.log('Toplam kullanıcı sayısı:', users.length);
      return users;
    } catch (error) {
      console.error('Kullanıcı listesi getirme hatası:', error);
      return [];
    }
  },
};



