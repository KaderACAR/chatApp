import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { chatService, Chat } from '../../services/chatService';
import LoadingScreen from '../../components/LoadingScreen';

interface ChatListProps {
  navigation: any;
}

export default function ChatList({ navigation }: ChatListProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = chatService.subscribeToChats(user.uid, (chats) => {
      setChats(chats);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, isAuthenticated]);

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Hata', error.message || 'Çıkış yapılırken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Refresh logic can be added here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    if (!user) return null;
    
    const otherParticipant = item.participants.find(p => p !== user.uid);
    
    return (
      <TouchableOpacity
        className="flex-row items-center p-4 border-b border-gray-200 bg-slate-100"
        onPress={() => navigation.navigate('Chat', { chatId: item.id, otherUserId: otherParticipant })}
      >
        <View className="w-12 h-12 bg-sky-400 rounded-full items-center justify-center mr-4">
          <Text className="text-white font-semibold text-lg">
            {item.lastMessage?.senderName?.charAt(0) || 'U'}
          </Text>
        </View>
        
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-lg">
            {item.lastMessage?.senderName || 'Kullanıcı'}
          </Text>
          <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
            {item.lastMessage?.text || 'Henüz mesaj yok'}
          </Text>
        </View>
        
        {item.lastMessageTime && (
          <Text className="text-gray-400 text-xs">
            {new Date(item.lastMessageTime).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ImageBackground 
    source={require('../../assets/swan.png')} // arka plan görseli
      className="flex-1"
      resizeMode="cover">

    
    <SafeAreaView className="flex-1 bg-500">
      {/* Header */}
      <View className="bg-transparent px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Sohbetler</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text className="text-red-500 font-semibold">Çıkış</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-white-500 text-lg text-center">
              Henüz sohbet yok{'\n'}
              Yeni bir sohbet başlatın!
            </Text>
          </View>
        }
      />

      {/* New Chat Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-sky-400 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('NewChat')}
      >
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </ImageBackground>
  );
} 