import { collection, addDoc, query, where, getDocs, onSnapshot, doc, getDoc } from 'firebase/firestore';
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

export const chatService = {
  async sendMessage(chatId: string, text: string, senderId: string, senderName: string) {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    await addDoc(messagesRef, {
      text,
      senderId,
      senderName,
      timestamp: new Date(),
    });
  },

  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message));
      callback(messages);
    });
    return unsubscribe;
  },

  subscribeToChats(userId: string, callback: (chats: Chat[]) => void) {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Chat));
      callback(chats);
    });
    return unsubscribe;
  },

  async createChat(participants: string[]) {
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
    });

    return newChat.id;
  },

  async getUserById(userId: string) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? { uid: userDoc.id, ...userDoc.data() } : null;
  },

  async getUserChats(userId: string): Promise<Chat[]> {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', userId));

    const querySnapshot = await getDocs(q);
    const chats: Chat[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Chat[];

    return chats;
  },
};