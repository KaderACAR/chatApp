import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  navigation: any;
}

export default function Login({ navigation }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuth();

  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const emailInputAnim = useRef(new Animated.Value(0)).current;
  const passwordInputAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sayfa yüklendiğinde animasyonları başlat
    Animated.sequence([
      // Logo animasyonu
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // İçerik animasyonu
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      // Hatalı input animasyonu
      Animated.sequence([
        Animated.timing(emailInputAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emailInputAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emailInputAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    // Buton basma animasyonu
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Giriş Hatası', error.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50  ">
      {/* Animated Background Elements */}
      <View className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Subtle geometric patterns */}
        <View className="absolute inset-0 opacity-30">
          <View className="absolute top-20 left-16 w-64 h-64 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl" />
          <View className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl" />
          <View className="absolute bottom-32 left-8 w-56 h-56 bg-gradient-to-br from-cyan-200/35 to-blue-200/35 rounded-full blur-3xl" />
        </View>
        
        {/* Floating elements */}
        <Animated.View 
          className="absolute top-24 right-12 w-6 h-6 bg-blue-300/60 rounded-full"
          style={{
            transform: [{ scale: fadeAnim }, { rotate: logoRotateInterpolate }],
          }}
        />
        <Animated.View 
          className="absolute bottom-56 left-20 w-4 h-4 bg-purple-300/50 rounded-full"
          style={{
            transform: [{ scale: logoScale }],
          }}
        />
        <Animated.View 
          className="absolute top-56 left-12 w-8 h-8 bg-indigo-200/40 rounded-full"
          style={{
            transform: [{ scale: fadeAnim }],
          }}
        />
        
        {/* Subtle grid pattern */}
        <View className="absolute inset-0 opacity-5">
          <View className="w-full h-full" />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <Animated.View 
            className="flex-1 justify-center"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Header */}
            <View className="items-center mb-12">
              <Animated.View 
                className="relative w-20 h-20 mb-6"
                style={{
                  transform: [
                    { scale: logoScale },
                    { rotate: logoRotateInterpolate },
                  ],
                }}
              >
                {/* Outer subtle glow */}
                <View className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-lg" />
                
                {/* Main logo container */}
                <View 
                  className="w-full h-full border-sky-500/100 backdrop-blur-xl rounded-full items-center justify-center border"
                  style={{
                    shadowColor: '#3B82F6',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 20,
                    elevation: 10,
                  }}
                >
                  <Text className="text-slate-700 text-4xl font-light ">🦢</Text>
                </View>
              </Animated.View>
              
              <Animated.Text 
                className="text-3xl font-light text-slate-800 mb-2 tracking-wide"
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                ChatApp
              </Animated.Text>
              
              <Animated.Text 
                className="text-slate-500 text-center font-light"
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                Arkadaşlarınızla sohbet edin
              </Animated.Text>
            </View>

            {/* Form */}
            <Animated.View 
              className="space-y-5"
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Animated.View
                style={{
                  transform: [{ translateX: emailInputAnim }],
                }}
              >
                <Text className="text-slate-600 font-light mb-3">E-posta</Text>
                <Animated.View
                  style={{
                    transform: [{ scale: emailFocused ? 1.02 : 1 }],
                  }}
                >
                  <TextInput
                    className={`bg-white/70 backdrop-blur-xl border rounded-xl px-4 py-4 text-slate-700 font-light transition-all duration-300 ${
                      emailFocused ? 'border-blue-300 bg-white/90 shadow-lg' : 'border-slate-200'
                    }`}
                    placeholder="E-posta adresinizi girin"
                    placeholderTextColor="rgba(100, 116, 139, 0.6)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => {
                      setEmailFocused(true);
                      Animated.spring(emailInputAnim, {
                        toValue: 1,
                        useNativeDriver: true,
                      }).start();
                    }}
                    onBlur={() => {
                      setEmailFocused(false);
                      Animated.spring(emailInputAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                      }).start();
                    }}
                  />
                </Animated.View>
              </Animated.View>

              <Animated.View
                style={{
                  transform: [{ translateX: passwordInputAnim }],
                }}
              >
                <Text className="text-slate-600 font-light mb-3">Şifre</Text>
                <Animated.View
                  style={{
                    transform: [{ scale: passwordFocused ? 1.02 : 1 }],
                  }}
                >
                  <TextInput
                    className={`bg-white/70 backdrop-blur-xl border rounded-xl px-4 py-4 text-slate-700 font-light transition-all duration-300 ${
                      passwordFocused ? 'border-blue-300 bg-white/90 shadow-lg' : 'border-slate-200'
                    }`}
                    placeholder="Şifrenizi girin"
                    placeholderTextColor="rgba(100, 116, 139, 0.6)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    onFocus={() => {
                      setPasswordFocused(true);
                      Animated.spring(passwordInputAnim, {
                        toValue: 1,
                        useNativeDriver: true,
                      }).start();
                    }}
                    onBlur={() => {
                      setPasswordFocused(false);
                      Animated.spring(passwordInputAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                      }).start();
                    }}
                  />
                </Animated.View>
              </Animated.View>

              <Animated.View
                className="pt-6"
                style={{
                  transform: [{ scale: buttonScale }],
                }}
              >
                <TouchableOpacity
                  disabled={loading}
                  activeOpacity={0.9}
                  onPress={handleLogin}
                  onPressIn={() => {
                    Animated.spring(buttonScale, {
                      toValue: 0.98,
                      useNativeDriver: true,
                    }).start();
                  }}
                  onPressOut={() => {
                    Animated.spring(buttonScale, {
                      toValue: 1,
                      useNativeDriver: true,
                    }).start();
                  }}
                >
                  <View 
                    className={`rounded-xl py-3 overflow-hidden self-center  ${
                      loading ? 'bg-slate-300' : 'bg-white/60'
                    }`}
                    style={{
                      shadowColor: '#1E293B',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 12,
                      elevation: 8,
                    }}
                  >
                    <View className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 backdrop-blur-xl" />
                    <Animated.Text 
                      className="text-black self-center border border-sky-200 px-3 py-2 rounded-xl font-light text-lg "
                      style={{
                        opacity: loading ? 0.8 : 1,
                      }}
                    >
                      {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </Animated.Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            {/* Register Link */}
            <Animated.View 
              className="mt-6 items-center"
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Text className="text-slate-500 font-light">Hesabınız yok mu?</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.8}
                className="mt-2"
              >
                <Text className="text-sky-500 font-light underline">
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}