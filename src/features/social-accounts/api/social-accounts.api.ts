import { axiosInstance } from 'shared/api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const socialAccountsApi = {
  getSocialAccounts: async () => {
    const { data } = await axiosInstance.get('/blogger/social-accounts');
    return data.data;
  },

  createSocialAccount: async (accountData: { platform: string; username: string; profileUrl: string }) => {
    const { data } = await axiosInstance.post('/blogger/social-accounts', accountData);
    return data.data;
  },

  updateSocialAccount: async (accountId: string, accountData: any) => {
    const { data } = await axiosInstance.put(`/blogger/social-accounts/${accountId}`, accountData);
    return data.data;
  },

  syncSocialAccount: async (accountId: string) => {
    const { data } = await axiosInstance.post(`/blogger/social-accounts/${accountId}/sync`);
    return data.data;
  },

  deleteSocialAccount: async (accountId: string) => {
    const { data } = await axiosInstance.delete(`/blogger/social-accounts/${accountId}`);
    return data;
  },
};

export const useSocialAccounts = () => {
  return useQuery({
    queryKey: ['social-accounts'],
    queryFn: socialAccountsApi.getSocialAccounts,
  });
};

export const useCreateSocialAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialAccountsApi.createSocialAccount,
    onSuccess: () => {
      message.success('Социальный аккаунт добавлен');
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
    },
  });
};

export const useSyncSocialAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialAccountsApi.syncSocialAccount,
    onSuccess: () => {
      message.success('Данные синхронизированы');
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
    },
  });
};

