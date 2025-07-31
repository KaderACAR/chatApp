import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-sky-100 justify-center items-center">
      <ActivityIndicator size="large" color="gray" />
      <Text className="text-white-800 mt-4 text-lg">🦢 Yükleniyor... 🦢</Text>
    </SafeAreaView>
  );
} 