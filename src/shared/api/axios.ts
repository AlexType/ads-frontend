import axios from 'axios';
import { message } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'https://ads-backend-production-3188.up.railway.app/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor с автоматическим обновлением токена
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Обработка 401 (Unauthorized) - автоматическое обновление токена
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      // Публичные страницы не требуют редиректа
      const publicPages = ['/', '/login', '/register'];
      const currentPath = window.location.pathname;
      
      // Если это публичная страница или запрос к /profile при первой загрузке - просто отклоняем
      if (publicPages.includes(currentPath) || error.config.url?.includes('/profile')) {
        return Promise.reject(error);
      }

      // Пытаемся обновить токен
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const response = await axiosInstance.post('/auth/refresh');
          
          if (response.data.success) {
            processQueue(null, null);
            return axiosInstance(originalRequest);
          } else {
            throw new Error('Refresh failed');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Если refresh не удался, редиректим на login
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Если уже идет обновление токена, добавляем запрос в очередь
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return axiosInstance(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    // Обработка 403 (Forbidden)
    if (error.response?.status === 403) {
      message.error('Доступ запрещен');
      return Promise.reject(error);
    }

    // Обработка 500 (Server Error)
    if (error.response?.status >= 500) {
      message.error('Ошибка сервера. Попробуйте позже');
      return Promise.reject(error);
    }

    // Обработка других ошибок
    if (error.response) {
      const errorMessage = error.response.data?.error?.message || error.response.data?.message || 'Произошла ошибка';
      message.error(errorMessage);
    } else if (error.request) {
      message.error('Нет ответа от сервера. Проверьте подключение к интернету');
    } else {
      message.error('Ошибка при настройке запроса');
    }

    return Promise.reject(error);
  }
);

