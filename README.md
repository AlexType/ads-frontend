# InfluencerHub Frontend

🚀 Современная платформа для поиска и сотрудничества с блогерами и инфлюенсерами.

Веб-приложение с интерактивным UI, real-time уведомлениями и анимированным дизайном для эффективного взаимодействия между рекламодателями и блогерами.

## ✨ Особенности

- 🎨 Современный дизайн с glassmorphism эффектом
- ⚡ Анимированные компоненты (Framer Motion)
- 🔔 Real-time уведомления с badge счетчиком
- 📱 Полностью адаптивная верстка
- 🎯 Feature-Sliced Design архитектура
- 🔐 Безопасная авторизация через httpOnly cookies
- 📊 Интерактивные графики и аналитика
- 💬 Real-time чат
- 🤖 AI-подбор блогеров

## 🛠 Технологический стек

### Core
- **React 19** - Последняя версия React
- **TypeScript 5.9** - Типобезопасность
- **Vite 7** - Быстрый сборщик

### UI & Design
- **Ant Design 5.27** - UI компоненты
- **Framer Motion 12** - Анимации
- **CSS3** - Современные эффекты (glassmorphism, gradients)

### State Management
- **TanStack Query 5** - Серверное состояние, кеширование
- **Zustand 5** - Клиентское состояние

### Networking
- **Axios 1.12** - HTTP клиент с interceptors
- **React Router 7** - Маршрутизация

### Charts & Visualization
- **Chart.js 4.5** - Графики
- **React ChartJS 2** - React обертка
- **Recharts 3.3** - Дополнительные графики

### Forms & Validation
- **React Hook Form 7** - Работа с формами
- **Yup 1.7** - Валидация
- **@hookform/resolvers 5** - Интеграция Yup с RHF

### Utilities
- **Day.js 1.11** - Работа с датами
- **Swiper 12** - Слайдеры и карусели
- **@ant-design/icons 6** - Иконки

## 📁 Архитектура: Feature-Sliced Design

```
src/
├── app/                      # Инициализация приложения
│   ├── providers/           # Провайдеры (React Query, Auth)
│   ├── routes/              # Роутинг с protected routes
│   └── store/               # Глобальный стор (Zustand)
│
├── shared/                  # Переиспользуемые модули
│   ├── api/                 # Axios instance + interceptors
│   ├── config/              # Конфигурация, темы
│   ├── lib/                 # Утилиты, хелперы, хуки
│   ├── types/               # TypeScript типы
│   └── ui/                  # UI компоненты
│
├── entities/                # Бизнес-сущности (Blogger, Order, etc.)
│
├── features/                # Бизнес-логика по фичам
│   ├── auth/               # Авторизация
│   ├── profile/            # Профиль
│   ├── order/              # Заказы
│   ├── campaign/           # Кампании
│   ├── notifications/      # Уведомления
│   ├── chat/               # Чат
│   ├── analytics/           # Аналитика
│   └── ...                 # Другие фичи
│
├── widgets/                # Композиции UI блоков
│   ├── header/             # Шапка с уведомлениями
│   ├── sidebar/            # Боковая панель
│   ├── layouts/            # Layout компоненты
│   └── notifications-dropdown/ # Dropdown уведомлений
│
├── pages/                  # Страницы приложения
│   ├── landing/            # Лендинг
│   ├── login/              # Вход
│   ├── register/           # Регистрация
│   ├── blogger/            # Страницы блогера
│   ├── advertiser/         # Страницы рекламодателя
│   ├── admin/              # Админ панель
│   └── ...                 # Другие страницы
│
└── components/             # Глобальные компоненты
    └── ParallaxParticles/  # Параллакс частицы
```

## 🚀 Быстрый старт

### Установка

```bash
# Установка зависимостей
npm install

# Создать .env файл (см. ниже)
cp .env.example .env

# Запустить dev сервер
npm run dev
```

### Переменные окружения

Создайте `.env` файл в корне проекта:

```env
# API URL
VITE_API_URL=http://localhost:3000/api/v1

# Другие переменные (опционально)
VITE_APP_NAME=InfluencerHub
```

### Скрипты

```bash
# Разработка
npm run dev          # Запуск dev сервера (localhost:5173)

# Сборка
npm run build        # Production сборка
npm run preview      # Предпросмотр сборки

# Линтинг
npm run lint         # Проверка кода
```

## 🎨 Дизайн-система

### Цветовая палитра

```css
/* Primary - Фиолетовый градиент */
--primary: #6366F1;           /* Индиго 500 */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--primary-dark: #4F46E5;      /* Индиго 600 */
--primary-light: #818CF8;     /* Индиго 400 */

/* Secondary */
--secondary: #8B5CF6;         /* Фиолетовый */

/* Status Colors */
--success: #10B981;           /* Зеленый */
--warning: #F59E0B;          /* Оранжевый */
--error: #EF4444;             /* Красный */

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
--backdrop-blur: blur(10px);
```

### Glassmorphism эффект

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 16px;
}
```

### Анимации

Приложение использует **Framer Motion** для плавных анимаций:

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## 🔐 Авторизация

Приложение использует **httpOnly cookies** для безопасности:

```typescript
// Axios автоматически отправляет cookies
axiosInstance.defaults.withCredentials = true;

// Interceptor обрабатывает 401 ошибки
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Редирект на логин
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📡 API Integration

Все API вызовы через настроенный `axiosInstance`:

```typescript
import { axiosInstance } from 'shared/api/axios';

// Получение данных
const fetchData = async () => {
  const { data } = await axiosInstance.get('/endpoint');
  return data.data;
};
```

### React Query для кеширования

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['my-data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000, // 5 минут
});
```

## 📄 Страницы

### ✅ Реализовано

- **Лендинг** (`/`) - Hero с параллаксом, анимированный градиент, reel эффект
- **Авторизация** (`/login`, `/register`) - Красивый glassmorphism дизайн
- **Восстановление пароля** (`/forgot-password`, `/reset-password`) - Единый стиль
- **Header** - С уведомлениями и профилем пользователя
- **Sidebar** - Навигация по разделам
- **Dashboard блогера** - Статистика, графики, заказы
- **Dashboard рекламодателя** - Кампании, заказы, аналитика
- **Поиск блогеров** - Расширенные фильтры
- **Профиль блогера** - Детальная информация
- **Заказы** - Список и детали заказов
- **Чат** - Общение с заказчиком/исполнителем
- **Платежи** - История транзакций
- **Настройки** - Управление профилем
- **Админ панель** - Управление платформой

### 🔨 В разработке

- [ ] Real-time чат с WebSocket
- [ ] Экспорт данных в Excel
- [ ] Push уведомления
- [ ] Интеграция с VK/Telegram для синхронизации
- [ ] AI рекомендации в интерфейсе
- [ ] Расширенная аналитика
- [ ] Мобильное приложение

## 🎯 Ключевые компоненты

### Notifications Dropdown

Интерактивные уведомления с badge счетчиком и анимациями:

```typescript
<NotificationsDropdown />
```

**Возможности:**
- Badge с количеством непрочитанных
- Автоматическое обновление каждые 30 сек
- Анимация колокольчика при наличии уведомлений
- Кнопка "Прочитать все"
- Редирект на соответствующие страницы
- Иконки для разных типов уведомлений

### Parallax Particles

Фон с анимированными частицами:

```typescript
<ParallaxParticles />
```

**Эффекты:**
- Частицы реагируют на курсор
- Параллакс при скролле
- Плавные движения и градиенты

### Reel Effect

Анимированный эффект "ленты" на hover для карточек:

```css
.feature-icon-reel::before {
  /* Лента с градиентом */
  background: linear-gradient(45deg, transparent 30%, rgba(...) 50%, transparent 70%);
}
```

## 📐 Защищенные роуты

Использование `ProtectedRoute` для ограничения доступа:

```typescript
import { ProtectedRoute } from 'app/routes/protected-route';

<Route
  path="/blogger/dashboard"
  element={
    <ProtectedRoute requiredRole="blogger">
      <BloggerDashboardPage />
    </ProtectedRoute>
  }
/>
```

## 🎭 Адаптивность

Приложение полностью адаптивно для всех устройств:

- **Desktop** (1920px+) - Полный функционал
- **Laptop** (1024px - 1919px) - Оптимизированный
- **Tablet** (768px - 1023px) - Адаптивный
- **Mobile** (< 768px) - Мобильная версия

## 📊 Графики и визуализация

Используются Chart.js и Recharts для отображения данных:

```typescript
import { Line } from 'react-chartjs-2';
import { LineChart } from 'recharts';

// Chart.js для линейных графиков
<Line data={chartData} options={options} />

// Recharts для сложных дашбордов
<LineChart data={data}>
  <Line dataKey="value" />
</LineChart>
```

## 🧪 Разработка

### Структура фичи

```
features/auth/
├── api/
│   └── auth.api.ts          # API вызовы
├── hooks/
│   └── useAuth.ts           # React хуки
└── ui/
    └── LoginForm.tsx        # UI компоненты
```

### Добавление новой фичи

1. Создать папку в `features/`
2. Добавить API файлы в `api/`
3. Создать хуки в `hooks/`
4. Добавить UI компоненты в `ui/`
5. Использовать в нужных страницах

## 🔍 Линтинг

```bash
npm run lint
```

Конфигурация в `eslint.config.js` и `.prettierrc`

## 📦 Production сборка

```bash
npm run build
```

Результат в `dist/`:
- HTML файлы
- JavaScript bundle (chunked)
- CSS файлы
- Ассеты

## 🌐 Деплой

### Vercel / Netlify

```bash
# Автоматический деплой из Git
git push origin main
# Vercel/Netlify автоматически задеплоит
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 📝 Соглашения

### Naming

- Компоненты: `PascalCase` (MyComponent.tsx)
- Файлы: `camelCase` для утилит, `PascalCase` для компонентов
- Хуки: начинаются с `use` (useAuth.ts)
- Константы: `UPPER_SNAKE_CASE`

### Импорты

```typescript
// 1. React
import { useState } from 'react';

// 2. Third-party
import { Button } from 'antd';

// 3. Internal - shared
import { axiosInstance } from 'shared/api/axios';

// 4. Internal - features
import { useAuth } from 'features/auth';

// 5. Internal - widgets
import { NotificationsDropdown } from 'widgets/notifications-dropdown';

// 6. Types
import type { User } from 'shared/types';
```

## 🤝 Вклад

1. Fork проекта
2. Создать feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменений (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Создать Pull Request

## 📄 Лицензия

MIT License

---

**Разработано с ❤️ командой InfluencerHub**
