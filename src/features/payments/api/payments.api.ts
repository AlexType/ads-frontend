import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'shared/api/axios';

export interface Payment {
  _id: string;
  orderId: {
    _id: string;
    title?: string;
  };
  fromUserId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  toUserId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  processedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface MonthlyEarning {
  month: string;
  earnings: number;
}

export interface PaymentsData {
  payments: Payment[];
  stats: {
    totalEarnings: number;
    pendingEarnings: number;
    totalPayments: number;
  };
  chart: {
    monthlyEarnings: MonthlyEarning[];
  };
}

interface UsePaymentsParams {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const usePayments = (params?: UsePaymentsParams) => {
  return useQuery<PaymentsData>({
    queryKey: ['payments', params],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      
      return axiosInstance
        .get(`/payments?${queryParams.toString()}`)
        .then((res) => res.data.data);
    },
  });
};

export const usePayment = (paymentId: string) => {
  return useQuery<Payment>({
    queryKey: ['payment', paymentId],
    queryFn: () => {
      return axiosInstance
        .get(`/payments/${paymentId}`)
        .then((res) => res.data.data);
    },
    enabled: !!paymentId,
  });
};

