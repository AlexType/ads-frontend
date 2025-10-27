import { axiosInstance } from 'shared/api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export interface GetCampaignsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateCampaignDto {
  title: string;
  campaignType: string;
  description?: string;
  budget: {
    total: number;
  };
  targetAudience: {
    demographics?: any;
    interests: string[];
    location?: string;
  };
  startDate: string;
  endDate: string;
  categories: string[];
}

export const campaignApi = {
  getCampaigns: async (params?: GetCampaignsParams) => {
    const { data } = await axiosInstance.get('/campaigns', { params });
    return data.data;
  },

  getCampaignById: async (campaignId: string) => {
    const { data } = await axiosInstance.get(`/campaigns/${campaignId}`);
    return data.data;
  },

  createCampaign: async (campaignData: CreateCampaignDto) => {
    const { data } = await axiosInstance.post('/campaigns', campaignData);
    return data.data;
  },

  updateCampaign: async (campaignId: string, campaignData: Partial<CreateCampaignDto>) => {
    const { data } = await axiosInstance.put(`/campaigns/${campaignId}`, campaignData);
    return data.data;
  },

  deleteCampaign: async (campaignId: string) => {
    const { data } = await axiosInstance.delete(`/campaigns/${campaignId}`);
    return data;
  },
};

export const useCampaigns = (params?: GetCampaignsParams) => {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: () => campaignApi.getCampaigns(params),
  });
};

export const useCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => campaignApi.getCampaignById(campaignId),
    enabled: !!campaignId,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: campaignApi.createCampaign,
    onSuccess: () => {
      message.success('Кампания успешно создана');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['advertiser-dashboard'] });
    },
    onError: () => {
      message.error('Не удалось создать кампанию');
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string; data: Partial<CreateCampaignDto> }) =>
      campaignApi.updateCampaign(campaignId, data),
    onSuccess: () => {
      message.success('Кампания обновлена');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: campaignApi.deleteCampaign,
    onSuccess: () => {
      message.success('Кампания удалена');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['advertiser-dashboard'] });
    },
    onError: () => {
      message.error('Не удалось удалить кампанию');
    },
  });
};

