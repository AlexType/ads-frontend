import { ReactNode } from 'react';
import { Spin } from 'antd';
import { useAuthProfile, useLogout } from 'features/auth/api/auth.api';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './auth-context';
import type { User } from 'shared/types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useAuthProfile();
  const logoutMutation = useLogout();

  // Обновляем контекст при изменении профиля
  const user = profile || null;

  const setUser = (userData: User | null) => {
    // Обновляем кеш React Query
    if (userData) {
      queryClient.setQueryData(['auth-profile'], userData);
      queryClient.setQueryData(['profile'], userData);
    } else {
      queryClient.setQueryData(['auth-profile'], null);
      queryClient.setQueryData(['profile'], null);
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Игнорируем ошибки при logout
    } finally {
      queryClient.clear();
      window.location.href = '/login';
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

