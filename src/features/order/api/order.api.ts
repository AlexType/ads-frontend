import { axiosInstance } from 'shared/api/axios';
import { useQuery } from '@tanstack/react-query';

export interface GetOrdersParams {
  status?: string;
  page?: number;
  limit?: number;
}

export const orderApi = {
  getBloggerOrders: async (params?: GetOrdersParams) => {
    const { data } = await axiosInstance.get('/orders/blogger', { params });
    return data.data;
  },

  getAdvertiserOrders: async (params?: GetOrdersParams) => {
    const { data } = await axiosInstance.get('/orders/advertiser', { params });
    return data.data;
  },

  getOrderById: async (orderId: string) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}`);
    return data.data;
  },

  acceptOrder: async (orderId: string) => {
    const { data } = await axiosInstance.post(`/orders/${orderId}/accept`);
    return data.data;
  },

  rejectOrder: async (orderId: string, reason: string) => {
    const { data } = await axiosInstance.post(`/orders/${orderId}/reject`, { reason });
    return data.data;
  },
};

export const useBloggerOrders = (params?: GetOrdersParams) => {
  return useQuery({
    queryKey: ['blogger-orders', params],
    queryFn: () => orderApi.getBloggerOrders(params),
  });
};

export const useAdvertiserOrders = (params?: GetOrdersParams) => {
  return useQuery({
    queryKey: ['advertiser-orders', params],
    queryFn: () => orderApi.getAdvertiserOrders(params),
  });
};

