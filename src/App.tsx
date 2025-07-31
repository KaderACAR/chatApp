import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './navigation';
import './global.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
          <Text style={{ fontSize: 18, color: '#374151', marginBottom: 10 }}>
            Bir hata oluştu
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', paddingHorizontal: 20 }}>
            Uygulama yeniden başlatılıyor...
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
