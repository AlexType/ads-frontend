import { axiosInstance } from 'shared/api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export interface GetNotificationsParams {
  read?: boolean;
  page?: number;
  limit?: number;
}

export const notificationsApi = {
  getNotifications: async (params?: GetNotificationsParams) => {
    const { data } = await axiosInstance.get('/notifications', { params });
    return data.data;
  },

  markAsRead: async (notificationId: string) => {
    const { data } = await axiosInstance.put(`/notifications/${notificationId}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await axiosInstance.put('/notifications/read-all');
    return data;
  },
};

export const useNotifications = (params?: GetNotificationsParams) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.getNotifications(params),
    refetchInterval: 30000, // Обновлять каждые 30 секунд
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      message.success('Все уведомления отмечены как прочитанные');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

