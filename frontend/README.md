# Frontend Application

Bu proje, React ve Vite kullanılarak geliştirilmiş bir frontend uygulamasıdır. Backend API'si ile haberleşmek için tasarlanmıştır.

## 🚀 Özellikler

- **React 19** ile modern component yapısı
- **React Router** ile sayfa yönlendirme
- **Axios** ile HTTP istekleri
- **React Query (@tanstack/react-query)** ile veri yönetimi
- **Authentication** sistemi (JWT token tabanlı)
- **Form validation** ve error handling
- **Loading states** ve notification sistemi
- **Responsive design** ve modern UI

## 📦 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn

### Adımlar
```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔧 Konfigürasyon

### Environment Variables
`.env` dosyasında aşağıdaki değişkenleri ayarlayın:

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Frontend App
VITE_APP_VERSION=1.0.0
```

### Backend Bağlantısı
- Backend API'si varsayılan olarak `http://localhost:3001/api` adresinde çalışır
- Vite proxy konfigürasyonu ile CORS sorunları çözülmüştür
- API istekleri için `/api` endpoint'i kullanılır

## 📁 Proje Yapısı

```
src/
├── components/          # Reusable components
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── Dashboard.jsx
│   ├── ProtectedRoute.jsx
│   ├── LoadingSpinner.jsx
│   └── Notification.jsx
├── context/             # React contexts
│   └── AuthContext.jsx
├── hooks/               # Custom hooks
│   └── useFormValidation.js
├── pages/               # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── DashboardPage.jsx
├── services/            # API services
│   └── api.js
├── App.jsx             # Main app component
└── main.jsx           # Entry point
```

## 🔐 Authentication

Uygulama JWT token tabanlı authentication kullanır:
- Login/Register formları
- Automatic token refresh
- Protected routes
- Persistent login state

## 🌐 API Entegrasyonu

### Mevcut API Endpoints
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `GET /api/auth/profile` - Kullanıcı profili
- `GET /api/users` - Kullanıcı listesi
- `GET /api/data` - Veri listesi

### API Service Kullanımı
```javascript
import { authAPI, userAPI } from '../services/api';

// Login
const result = await authAPI.login({ email, password });

// Get users
const users = await userAPI.getUsers();
```

## 🎨 UI Components

### Form Validation
```javascript
import useFormValidation, { validationRules } from '../hooks/useFormValidation';

const { values, errors, handleChange, validateAllFields } = useFormValidation(
  { email: '', password: '' },
  {
    email: [validationRules.required(), validationRules.email()],
    password: [validationRules.required(), validationRules.minLength(6)]
  }
);
```

### Notifications
```javascript
import { useNotification } from '../components/Notification';

const { showSuccess, showError } = useNotification();
showSuccess('İşlem başarılı!');
showError('Bir hata oluştu!');
```

## 🔄 Development

### Hot Module Replacement (HMR)
Vite'nin HMR özelliği sayesinde kod değişiklikleri anında yansır.

### Debugging
- React Developer Tools kullanılabilir
- Console logs backend proxy işlemleri için mevcut

### Build Process
```bash
# Development
npm run dev

# Production build
npm run build

# Build'i test et
npm run preview
```

## 🤝 Backend ile Entegrasyon

### Gerekli Backend Endpoints
Backend'inizin aşağıdaki endpoint'leri sağlaması gerekir:

1. **Authentication**
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `GET /api/auth/profile`

2. **User Management**
   - `GET /api/users`
   - `POST /api/users`
   - `PUT /api/users/:id`
   - `DELETE /api/users/:id`

3. **Data Management**
   - `GET /api/data`
   - `POST /api/data`

### CORS Ayarları
Backend'inizde CORS ayarlarını yapmanız gerekebilir:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 📱 Responsive Design

Uygulama mobile-first yaklaşımı ile geliştirilmiştir ve tüm cihazlarda uyumlu çalışır.

## 🔍 Troubleshooting

### Yaygın Sorunlar

1. **Backend bağlantı sorunu**
   - Backend server'ının çalıştığından emin olun
   - `.env` dosyasındaki `VITE_API_URL`'yi kontrol edin

2. **CORS hatası**
   - Backend'de CORS ayarlarını kontrol edin
   - Vite proxy konfigürasyonunu kontrol edin

3. **Authentication sorunları**
   - localStorage'daki token'ı kontrol edin
   - Backend'deki JWT secret'ın doğru olduğundan emin olun

### Debug Modları
```bash
# Verbose logging
npm run dev -- --debug

# Network inspection
# Browser Developer Tools > Network tab
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
