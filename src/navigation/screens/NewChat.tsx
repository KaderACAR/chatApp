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
import { chatService, User } from '../../services/chatService';
import LoadingScreen from '../../components/LoadingScreen';


interface NewChatProps {
  navigation: any;
}


export default function NewChat({ navigation }: NewChatProps) {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (isAuthenticated && user) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);


  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);


      if (!isAuthenticated || !user) {
        console.log('Kullanıcı authenticate değil:', { isAuthenticated, user });
        setLoading(false);
        return;
      }


      console.log('Kullanıcılar yükleniyor...');
     
      // chatService üzerinden kullanıcıları yükle
      const usersData = await chatService.getAllUsers();
      console.log('Firebase\'den gelen kullanıcılar:', usersData);
     
      // Mevcut kullanıcıyı listeden çıkar ve geçersiz verileri filtrele
      const filteredUsers = usersData
        .filter((u: User) => u && u.uid && u.uid !== user.uid)
        .filter((u: User) => u.displayName || u.email); // En az bir tanımlayıcı bilgi olmalı
     
      console.log('Filtrelenmiş kullanıcılar:', filteredUsers);
      console.log('Mevcut kullanıcı:', user);
     
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Kullanıcı yükleme hatası:', error);
      setError('Kullanıcılar yüklenemedi');
      Alert.alert('Hata', 'Kullanıcılar yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };


  const filteredUsers = users.filter((user) => {
    if (!user) return false;
   
    const searchLower = searchQuery.toLowerCase();
    const displayName = (user.displayName || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
   
    return displayName.includes(searchLower) || email.includes(searchLower);
  });


  const startChat = async (otherUser: User) => {
    try {
      if (!user) {
        Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
        return;
      }


      if (!otherUser || !otherUser.uid) {
        Alert.alert('Hata', 'Geçersiz kullanıcı bilgisi');
        return;
      }


      console.log('Starting chat with user:', otherUser);
      console.log('Authenticated user:', user);
     
      // Create or get existing chat ID
      const chatId = await chatService.createChat([user.uid, otherUser.uid]);
      console.log('Chat created with ID:', chatId);


      // Navigate to the Chat screen
      navigation.replace('Chat', {
        chatId,
        otherUserId: otherUser.uid,
        otherUserName: otherUser.displayName || otherUser.email || 'user.name'
      });
    } catch (error) {
      console.error('Chat başlatma hatası:', error);
      Alert.alert('Hata', 'Sohbet başlatılamadı. Lütfen tekrar deneyin.');
    }
  };


  const renderUserItem = ({ item }: { item: User }) => {
    if (!item || !item.uid) return null;
   
    const displayName = item.displayName || 'user.name';
    const email = item.email || 'E-posta yok';
    const initial = displayName.charAt(0).toUpperCase();
   
    return (
      <TouchableOpacity
        className="flex-row items-center p-4 border-b border-gray-200 bg-white"
        onPress={() => startChat(item)}
        activeOpacity={0.7}
      >
        <View className="w-12 h-12 bg-sky-500 rounded-full items-center justify-center mr-4">
          <Text className="text-white font-semibold text-lg">
            {initial}
          </Text>
        </View>
       
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-lg">
            {displayName}
          </Text>
          <Text className="text-gray-600 text-sm">
            {email}
          </Text>
        </View>
       
        <Text className="text-sky-500 font-semibold">→</Text>
      </TouchableOpacity>
    );
  };


  const addTestUser = async () => {
    try {
      console.log('Test kullanıcısı ekleniyor...');
      const testUser = {
        uid: 'test-user-' + Date.now(),
        displayName: 'Test Kullanıcı ' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        createdAt: new Date().toISOString(),
      };
     
      // Firestore'a test kullanıcısı ekle
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../config/firebaseConfig');
     
      await setDoc(doc(db, 'users', testUser.uid), testUser);
      console.log('Test kullanıcısı eklendi:', testUser);
     
      // Kullanıcı listesini yenile
      loadUsers();
     
      Alert.alert('Başarılı', 'Test kullanıcısı eklendi!');
    } catch (error) {
      console.error('Test kullanıcısı ekleme hatası:', error);
      Alert.alert('Hata', 'Test kullanıcısı eklenemedi');
    }
  };


  if (loading) {
    return <LoadingScreen />;
  }


  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-sky-500 px-6 py-3 rounded-lg mb-4"
          onPress={loadUsers}
        >
          <Text className="text-white font-semibold">Tekrar Dene</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-sky-500 px-6 py-3 rounded-lg"
          onPress={addTestUser}
        >
          <Text className="text-white font-semibold">Test Kullanıcısı Ekle</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3"
          activeOpacity={0.7}
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
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>


      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.uid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center text-lg">
              {searchQuery ? 'Kullanıcı bulunamadı' : 'Henüz kayıtlı kullanıcı yok'}
            </Text>
            {!searchQuery && (
              <>
                <Text className="text-gray-400 text-center mt-2">
                  Yeni kullanıcılar kayıt oldukça burada görünecek
                </Text>
                <TouchableOpacity
                  className="bg-green-500 px-6 py-3 rounded-lg mt-4"
                  onPress={addTestUser}
                >
                  <Text className="text-white font-semibold">Test Kullanıcısı Ekle</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}



