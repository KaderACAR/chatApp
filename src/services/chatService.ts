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

// Mock data
const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Merhaba!',
    senderId: 'user1',
    senderName: 'Ahmet',
    timestamp: new Date()
  },
  {
    id: '2',
    text: 'Nasılsın?',
    senderId: 'user2',
    senderName: 'Mehmet',
    timestamp: new Date()
  }
];

const mockChats: Chat[] = [
  {
    id: 'chat1',
    participants: ['user1', 'user2'],
    lastMessage: mockMessages[1],
    lastMessageTime: new Date()
  }
];

const mockUsers = [
  { uid: 'user1', displayName: 'Ahmet', email: 'ahmet@test.com' },
  { uid: 'user2', displayName: 'Mehmet', email: 'mehmet@test.com' },
  { uid: 'user3', displayName: 'Ayşe', email: 'ayse@test.com' }
];

export const chatService = {
  async sendMessage(chatId: string, text: string, senderId: string, senderName: string) {
    // Mock send message
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Mock: Message sent', { chatId, text, senderId, senderName });
        resolve();
      }, 500);
    });
  },

  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    // Mock subscription
    setTimeout(() => {
      callback(mockMessages);
    }, 1000);
    
    return () => {}; // Mock unsubscribe
  },

  subscribeToChats(userId: string, callback: (chats: Chat[]) => void) {
    // Mock subscription
    setTimeout(() => {
      callback(mockChats);
    }, 1000);
    
    return () => {}; // Mock unsubscribe
  },

  async createChat(participants: string[]) {
    // Mock create chat
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const chatId = 'mock-chat-' + Date.now();
        console.log('Mock: Chat created', { chatId, participants });
        resolve(chatId);
      }, 500);
    });
  },

  async getUserById(userId: string) {
    // Mock get user
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.uid === userId);
        resolve(user || null);
      }, 500);
    });
  }
}; 