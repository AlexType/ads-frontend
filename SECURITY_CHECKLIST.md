# 🔒 Чеклист безопасности для деплоя фронтенда

## ✅ Проверено и безопасно

### 1. Чувствительные данные
- ✅ Нет `.env` файлов в репозитории
- ✅ Нет хардкоженных паролей или токенов
- ✅ Нет API ключей в коде
- ✅ Переменные окружения через `import.meta.env`
- ✅ Fallback на localhost только для development

### 2. .gitignore настроен правильно
```
✅ node_modules - игнорируется
✅ dist - игнорируется
✅ .env* - игнорируется
✅ *.log - игнорируется
✅ *.tsbuildinfo - игнорируется
✅ .cache, .vite - игнорируется
```

### 3. Безопасность авторизации
- ✅ Использует httpOnly cookies (безопасно)
- ✅ withCredentials: true
- ✅ Нет токенов в localStorage
- ✅ Автоматический logout при 401
- ✅ Защищенные роуты с проверкой роли

### 4. API запросы
- ✅ Все через axios instance
- ✅ Единый interceptors для ошибок
- ✅ Правильная обработка 401/403/500
- ✅ Нет прямых API ключей

## 📦 Готово к деплою

### Что нужно для деплоя

1. **Создать `.env` файл с production URL:**
```env
VITE_API_URL=https://your-production-api.com/api/v1
```

2. **Собрать проект:**
```bash
npm run build
```

3. **Зайти в папку dist и запушить в git:**
```bash
cd dist
git init
git add .
git commit -m "Initial frontend build"
git remote add origin <your-repo-url>
git push -u origin main
```

ИЛИ

4. **Деплой через CI/CD (рекомендуется)**

## 🎯 Структура для деплоя

```
frontend/
├── .gitignore          ✅ Настроен
├── package.json        ✅ Ок
├── README.md           ✅ Обновлен
├── vite.config.ts      ✅ Ок
├── tsconfig.json       ✅ Ок
├── src/                ✅ Чисто, без секретов
├── public/             ✅ Статические файлы
├── dist/               ⚠️ В .gitignore (не коммитим)
└── node_modules/       ⚠️ В .gitignore (не коммитим)
```

## ⚠️ Важно

1. **НЕ КОММИТИТЬ:**
   - ❌ `.env` файлы
   - ❌ `node_modules/`
   - ❌ `dist/` (если не используете GitHub Pages)
   - ❌ `tsconfig.tsbuildinfo`

2. **КОММИТИТЬ:**
   - ✅ Весь `src/` код
   - ✅ `package.json`
   - ✅ Конфиги (vite.config.ts, tsconfig.json)
   - ✅ `.gitignore`
   - ✅ `README.md`

## 🌐 Деплой

### Vercel (рекомендуется)

```bash
# Установить Vercel CLI
npm i -g vercel

# Задеплоить
cd frontend
vercel

# Добавить переменную окружения
vercel env add VITE_API_URL
```

### Netlify

```bash
# Установить Netlify CLI
npm i -g netlify-cli

# Деploy
netlify deploy --dir=dist --prod

# Добавить переменные в Netlify dashboard
# Site settings > Environment variables
```

### GitHub Pages

```bash
# В vite.config.ts добавить:
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## 📊 Размеры проекта

- **Исходный код:** ~11,865 файлов (TS/TSX)
- **Production build:** 1.5 MB (dist/)
- **node_modules:** 334 MB (игнорируется)

## ✅ Финальная проверка

Перед push в Git:

```bash
# 1. Проверить что нет .env
ls -la | grep .env

# 2. Проверить что .gitignore работает
git status --ignored

# 3. Инициализировать git (если еще не сделано)
git init

# 4. Добавить файлы
git add .

# 5. Проверить что попадет в коммит
git status

# 6. Убедиться что НЕТ:
# - node_modules
# - dist
# - .env
# - *.log

# 7. Коммит
git commit -m "Initial frontend deploy"

# 8. Push
git remote add origin <your-repo>
git push -u origin main
```

---

**Статус:** ✅ Готово к деплою  
**Дата проверки:** 2025-01-28

