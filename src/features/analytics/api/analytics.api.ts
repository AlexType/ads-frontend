import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'shared/api/axios';

export interface CampaignDetail {
  campaign: string;
  reach: number;
  engagement: string;
  conversions: number;
  roi: number;
}

export interface MonthlyData {
  month: string;
  value: number;
  conversions: number;
}

export interface ChannelData {
  name: string;
  value: number;
}

export interface AdvertiserAnalytics {
  overview: {
    totalBudget: number;
    activeCampaigns: number;
    totalReach: number;
    avgROI: number;
  };
  campaignDetails: CampaignDetail[];
  charts: {
    monthlyData: MonthlyData[];
    channelData: ChannelData[];
  };
}

export interface FollowerGrowthData {
  month: string;
  subscribers: number;
}

export interface EngagementData {
  month: string;
  engagement: number;
}

export interface EarningsData {
  month: string;
  earnings: number;
}

export interface PlatformEarning {
  platform: string;
  earnings: number;
  percentage: number;
}

export interface TopAdvertiser {
  advertiserId: string;
  ordersCount: number;
  totalSpent: number;
}

export interface CategoryStat {
  category: string;
  orders: number;
  earnings: number;
  percentage: number;
}

export interface BloggerAnalytics {
  overview: {
    totalReach: number;
    totalEngagement: number;
    totalEarnings: number;
    totalOrders: number;
    activeOrders: number;
  };
  charts: {
    followerGrowth: FollowerGrowthData[];
    engagement: EngagementData[];
    earnings: EarningsData[];
  };
  topPlatforms: PlatformEarning[];
  topAdvertisers: TopAdvertiser[];
  categoryStats: CategoryStat[];
}

export const useAdvertiserAnalytics = () => {
  return useQuery<AdvertiserAnalytics>({
    queryKey: ['advertiser-analytics'],
    queryFn: () => {
      return axiosInstance
        .get('/analytics/advertiser')
        .then((res) => res.data.data);
    },
  });
};

export const useBloggerAnalytics = (period: string = '30') => {
  return useQuery<BloggerAnalytics>({
    queryKey: ['blogger-analytics', period],
    queryFn: () => {
      const params = new URLSearchParams();
      if (period === '7') {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        params.append('startDate', date.toISOString());
      } else if (period === '30') {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        params.append('startDate', date.toISOString());
      } else if (period === '90') {
        const date = new Date();
        date.setDate(date.getDate() - 90);
        params.append('startDate', date.toISOString());
      } else if (period === '365') {
        const date = new Date();
        date.setDate(date.getDate() - 365);
        params.append('startDate', date.toISOString());
      }
      return axiosInstance
        .get(`/analytics/blogger?${params.toString()}`)
        .then((res) => res.data.data);
    },
  });
};

