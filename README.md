# ChatApp - React Native

WhatsApp benzeri bir mobil chat uygulaması. React Native ve NativeWind kullanılarak geliştirilmiştir.

## Özellikler

- 🔐 Kullanıcı kaydı ve girişi (Mock)
- 💬 Mesajlaşma (Mock)
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
│   ├── authService.ts      # Authentication servisi (Mock)
│   └── chatService.ts      # Chat servisi (Mock)
└── App.tsx                 # Ana uygulama bileşeni
```

## Ekranlar

### 1. Login Ekranı
- E-posta ve şifre ile giriş (Mock)
- Kayıt ekranına yönlendirme
- Modern ve temiz tasarım

### 2. Register Ekranı
- Kullanıcı kaydı (ad, e-posta, şifre) (Mock)
- Şifre doğrulama
- Giriş ekranına yönlendirme

### 3. ChatList Ekranı
- Mevcut sohbetlerin listesi (Mock)
- Son mesaj önizlemesi
- Yeni sohbet başlatma butonu
- Çıkış yapma özelliği

### 4. Chat Ekranı
- Mesajlaşma (Mock)
- Mesaj gönderme/alma
- Otomatik scroll
- Mesaj zaman damgası

### 5. NewChat Ekranı
- Kullanıcı listesi (Mock)
- Kullanıcı arama
- Yeni sohbet başlatma

## Mock Servisler

Bu uygulama şu anda mock servisler kullanmaktadır:

- **Authentication**: Gerçek Firebase Authentication yerine mock servis
- **Chat**: Gerçek Firestore yerine mock servis
- **Messages**: Gerçek zamanlı mesajlaşma yerine mock veri

Gerçek Firebase entegrasyonu için:
1. Firebase projesi oluşturun
2. Firebase SDK'yı ekleyin
3. Mock servisleri gerçek Firebase servisleriyle değiştirin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
