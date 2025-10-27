import { axiosInstance } from 'shared/api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const profileApi = {
  getBloggerProfile: async () => {
    const { data } = await axiosInstance.get('/blogger/profile');
    return data.data;
  },

  updateBloggerProfile: async (profileData: any) => {
    const { data } = await axiosInstance.put('/blogger/profile', profileData);
    return data.data;
  },

  getProfile: async () => {
    const { data } = await axiosInstance.get('/profile');
    return data.data;
  },

  updateProfile: async (profileData: any) => {
    const { data } = await axiosInstance.put('/profile', profileData);
    return data.data;
  },
};

export const useBloggerProfile = () => {
  return useQuery({
    queryKey: ['blogger-profile'],
    queryFn: profileApi.getBloggerProfile,
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });
};

export const useUpdateBloggerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateBloggerProfile,
    onSuccess: () => {
      message.success('Профиль обновлен');
      queryClient.invalidateQueries({ queryKey: ['blogger-profile'] });
    },
    onError: () => {
      message.error('Не удалось обновить профиль');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      message.success('Профиль обновлен');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-profile'] });
    },
  });
};

