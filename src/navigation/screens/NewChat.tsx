import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { chatService } from '../../services/chatService';
import LoadingScreen from '../../components/LoadingScreen';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

interface User {
  uid: string;
  displayName?: string;
  email?: string;
}

interface NewChatProps {
  navigation: any;
}

export default function NewChat({ navigation }: NewChatProps) {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      // Fetch users from Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '!=', user.uid));
      const querySnapshot = await getDocs(q);

      const usersData: User[] = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as User[];

      setUsers(usersData);
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user?.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
 

  const startChat = async (otherUser: User) => {
    try {
      if (!user) {
        Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
        return;
      }

      console.log('Starting chat with user:', otherUser);
      console.log('Authenticated user:', user);
      // Create or get existing chat ID
      const chatId = await chatService.createChat([user.uid, otherUser.uid]);
      console.log('Chat created with ID:', chatId);

      // Navigate to the Chat screen
      navigation.replace('Chat', { chatId, otherUserId: otherUser.uid });
    } catch (error) {
      Alert.alert('Hata', 'Sohbet başlatılamadı');
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200 bg-white"
      onPress={() => startChat(item)}
    >
              <View className="w-12 h-12 bg-sky-500 rounded-full items-center justify-center mr-4">
          <Text className="text-white font-semibold text-lg">
            {item.displayName?.charAt(0) || 'U'}
          </Text>
        </View>
        
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-lg">
            {item.displayName || 'Kullanıcı'}
          </Text>
                  <Text className="text-gray-600 text-sm">
            {item.email || 'E-posta yok'}
          </Text>
      </View>
      
      <Text className="text-green-500 font-semibold">→</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3"
        >
          <Text className="text-sky-500 text-lg font-semibold">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Yeni Sohbet</Text>
      </View>

      {/* Search */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-2 text-gray-800"
          placeholder="Kullanıcı ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.uid}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center">
              {searchQuery ? 'Kullanıcı bulunamadı' : 'Kullanıcı yok'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}