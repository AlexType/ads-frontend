# 🚀 Деплой на Vercel

## Быстрый деплой через Vercel CLI

### 1. Установка Vercel CLI

```bash
npm i -g vercel
```

### 2. Логин в Vercel

```bash
vercel login
```

### 3. Деплой из папки frontend

```bash
cd frontend
vercel
```

Следуйте инструкциям:
- Set up and deploy? **Y**
- Which scope? Выберите ваш аккаунт
- Link to existing project? **N**
- Project name? `influencerhub-frontend` (или свое)
- Directory? `./frontend` или `.`
- Override settings? **N**

### 4. Добавление переменных окружения

```bash
# Добавить переменную окружения
vercel env add VITE_API_URL

# Выбрать environment: Production
# Ввести URL вашего бэкенда: https://your-backend-api.com/api/v1
```

Или через Vercel Dashboard:
1. Откройте проект
2. Settings > Environment Variables
3. Добавьте: `VITE_API_URL` = `https://your-backend-api.com/api/v1`

## Автоматический деплой через Git

### Подключение к GitHub

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Подключите ваш GitHub репозиторий
4. Настройки проекта:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Добавление Environment Variables

В настройках проекта добавьте:

```
VITE_API_URL=https://your-backend-api.com/api/v1
```

## Настройки для Production

### vercel.json

Проект уже включает `vercel.json` с оптимальными настройками:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Environment Variables в Vercel

Обязательно добавьте в Vercel Dashboard:

```
# Production
VITE_API_URL=https://api.yourdomain.com/api/v1

# Development (опционально)
VITE_API_URL=http://localhost:3000/api/v1
```

## Проверка деплоя

После деплоя проверьте:

1. ✅ Сайт открывается
2. ✅ API запросы идут на правильный URL
3. ✅ Авторизация работает
4. ✅ Уведомления работают
5. ✅ Графики и данные загружаются

## Custom Domain (опционально)

В настройках проекта:
1. Settings > Domains
2. Add domain
3. Следуйте инструкциям по DNS

## Troubleshooting

### Проблема: White screen после деплоя

**Решение:** Проверьте что `outputDirectory` в vercel.json = `dist`

### Проблема: 404 на перезагрузке страницы

**Решение:** Убедитесь что в vercel.json есть rewrites для SPA

### Проблема: API запросы идут на localhost

**Решение:** Добавьте переменную VITE_API_URL в Vercel

```bash
vercel env add VITE_API_URL production
```

### Проблема: CORS ошибки

**Решение:** Убедитесь что backend настроен на разрешение запросов с вашего Vercel домена

## Полезные команды

```bash
# Посмотреть логи
vercel logs

# Посмотреть деплой
vercel inspect

# Роллбэк к предыдущей версии
vercel rollback
```

## Production Checklist

- [x] .gitignore настроен
- [x] Нет секретов в коде
- [x] vercel.json создан
- [x] Environment Variables настроены
- [x] Build успешно проходит
- [x] Custom Domain настроен (если нужно)
- [x] Analytics подключен (опционально)

## Следующие шаги

После успешного деплоя:

1. Проверьте что сайт работает
2. Настройте custom domain
3. Включите HTTPS (автоматически)
4. Настройте analytics (Vercel Analytics)
5. Настройте мониторинг (Vercel Monitoring)

---

**Готово к деплою! 🚀**

