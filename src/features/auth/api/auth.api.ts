import { axiosInstance } from 'shared/api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from 'shared/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  getProfile: async (): Promise<User> => {
    const { data } = await axiosInstance.get('/profile');
    return data.data;
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    return data.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
};

export const useAuthProfile = () => {
  return useQuery({
    queryKey: ['auth-profile'],
    queryFn: authApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: false, // Не ретраим для профиля, если 401 - значит не авторизован
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Инвалидируем кеш профиля после успешного входа
      queryClient.invalidateQueries({ queryKey: ['auth-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Очищаем все кешированные данные
      queryClient.clear();
    },
  });
};


