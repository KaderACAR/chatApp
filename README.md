# ChatApp - React Native

Mobil chat uygulaması. React Native ve NativeWind kullanılarak geliştirilmiştir.

## Özellikler

- 🔐 Kullanıcı kaydı ve girişi 
- 💬 Mesajlaşma 
- 👥 Kullanıcı listesi
- 🔍 Kullanıcı arama
- 📱 Modern ve kullanıcı dostu arayüz
- 🌙 NativeWind ile stil yönetimi

## Teknolojiler

- **React Native** - Mobil uygulama geliştirme
- **NativeWind** - CSS-in-JS styling
- **TypeScript** - Tip güvenliği
- **Expo** - Geliştirme platformu
- **React Navigation** - Navigation yönetimi
- **AsyncStorage** 

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd chatApp
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı çalıştırın:
```bash
npm start
```

## Proje Yapısı

```
src/
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── navigation/
│   ├── index.tsx           # Ana navigation
│   └── screens/
│       ├── Login.tsx       # Giriş ekranı
│       ├── Register.tsx    # Kayıt ekranı
│       ├── ChatList.tsx    # Sohbet listesi
│       ├── Chat.tsx        # Mesajlaşma ekranı
│       └── NewChat.tsx     # Yeni sohbet ekranı
├── services/
│   ├── authService.ts      # Authentication servisi 
│   └── chatService.ts      # Chat servisi (Mock)
└── App.tsx                 # Ana uygulama bileşeni
```

## Ekranlar

### 1. Login Ekranı
- E-posta ve şifre ile giriş (Mock)
- Kayıt ekranına yönlendirme
- Modern ve temiz tasarım

### 2. Register Ekranı
- Kullanıcı kaydı (ad, e-posta, şifre) 
- Şifre doğrulama
- Giriş ekranına yönlendirme

### 3. ChatList Ekranı
- Mevcut sohbetlerin listesi 
- Son mesaj önizlemesi
- Yeni sohbet başlatma butonu
- Çıkış yapma özelliği

### 4. Chat Ekranı
- Mesajlaşma 
- Mesaj gönderme/alma
- Otomatik scroll
- Mesaj zaman damgası

### 5. NewChat Ekranı
- Kullanıcı listesi 
- Kullanıcı arama
- Yeni sohbet başlatma

## Firebase

Bu uygulama da firebase kullanmaktadır:

- **Authentication**: Firebase Authentication 
- **Chat**: Firestore 
- **Messages**: 


## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)


## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. MIT Lisansı © 2025 Kader Acar
