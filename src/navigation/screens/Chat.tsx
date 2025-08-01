import React, { useEffect, useState, useRef } from 'react';
import {View,Text,TextInput,TouchableOpacity,FlatList,KeyboardAvoidingView,Platform,Alert,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { chatService, Message } from '../../services/chatService';
import LoadingScreen from '../../components/LoadingScreen';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig'; // Ensure Firebase is configured properly

interface ChatProps {
  navigation: any;
  route: any;
}

export default function Chat({ navigation, route }: ChatProps) {
  const { chatId, otherUserId } = route.params;
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) return;

    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text || '',
        senderId: doc.data().senderId || '',
        senderName: doc.data().senderName || 'Kullanıcı',
        timestamp: doc.data().timestamp || new Date().toISOString(),
      }));
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !isAuthenticated || !user) return;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: newMessage.trim(),
        senderId: user.uid,
        senderName: user.displayName || 'Kullanıcı',
        timestamp: new Date().toISOString(),
      });
      setNewMessage('');
    } catch (error) {
      Alert.alert('Hata', 'Mesaj gönderilemedi');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (!user) return null;
    
    const isOwnMessage = item.senderId === user.uid;

    return (
      <View className={`flex-row ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 px-4`}>
        <View
          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-green-500 rounded-br-md'
              : 'bg-gray-200 rounded-bl-md'
          }`}
        >
          <Text
            className={`text-sm ${
              isOwnMessage ? 'text-white' : 'text-gray-800'
            }`}
          >
            {item.text}
          </Text>
          <Text
            className={`text-xs mt-1 ${
              isOwnMessage ? 'text-green-100' : 'text-gray-500'
            }`}
          >
            {item.timestamp
              ? new Date(item.timestamp).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Şimdi'}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <Text className="text-sky-500 text-lg font-semibold">←</Text>
          </TouchableOpacity>
          <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mr-3">
            <Text className="text-white font-semibold">
              {messages[0]?.senderName?.charAt(0) || 'U'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-gray-800 text-lg">
              {messages[0]?.senderName || 'Kullanıcı'}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-center">
                Henüz mesaj yok{'\n'}
                İlk mesajı siz gönderin!
              </Text>
            </View>
          }
        />

        {/* Message Input */}
        <View className="bg-white px-4 py-3 border-t border-gray-200 flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-3 text-gray-800"
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center ${
              newMessage.trim() ? 'bg-green-500' : 'bg-gray-300'
            }`}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Text className="text-white font-bold">→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}