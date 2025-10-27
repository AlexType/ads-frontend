import { axiosInstance } from 'shared/api/axios';
import { useQuery } from '@tanstack/react-query';

export interface BloggerDashboardData {
  overview: {
    totalOrders: number;
    activeOrders: number;
    totalEarnings: number;
    avgRating: number;
  };
  audienceGrowth: {
    currentFollowers: number;
    growth: number;
  };
  recentOrders: any[];
}

export const dashboardApi = {
  getBloggerDashboard: async (): Promise<BloggerDashboardData> => {
    const { data } = await axiosInstance.get('/blogger/dashboard');
    return data.data;
  },

  getAdvertiserDashboard: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/advertiser/dashboard');
    return data.data;
  },
};

export const useBloggerDashboard = () => {
  return useQuery({
    queryKey: ['blogger-dashboard'],
    queryFn: dashboardApi.getBloggerDashboard,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

export const useAdvertiserDashboard = () => {
  return useQuery({
    queryKey: ['advertiser-dashboard'],
    queryFn: dashboardApi.getAdvertiserDashboard,
    staleTime: 2 * 60 * 1000,
  });
};

