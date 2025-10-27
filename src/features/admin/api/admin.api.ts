import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from 'shared/api/axios';

// Типы
export interface AdminStats {
  totalUsers: number;
  totalBloggers: number;
  totalAdvertisers: number;
  totalAdmins: number;
}

export interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  isActive: boolean;
  order: number;
}

// Queries
export const useAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: () => {
      return axiosInstance
        .get('/admin/stats')
        .then((res) => res.data.data);
    },
  });
};

export const useAdmins = () => {
  return useQuery<{ admins: Admin[] }>({
    queryKey: ['admins'],
    queryFn: () => {
      return axiosInstance
        .get('/admin/admins')
        .then((res) => res.data.data);
    },
  });
};

export const useServices = () => {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => {
      return axiosInstance
        .get('/admin/services')
        .then((res) => res.data.data);
    },
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => {
      return axiosInstance
        .get('/admin/dashboard')
        .then((res) => res.data.data);
    },
  });
};

// Mutations
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string; firstName: string; lastName: string }) => {
      return axiosInstance.post('/admin/admins', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ adminId, data }: { adminId: string; data: Partial<Admin> }) => {
      return axiosInstance.put(`/admin/admins/${adminId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (adminId: string) => {
      return axiosInstance.delete(`/admin/admins/${adminId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Service>) => {
      return axiosInstance.post('/admin/services', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: Partial<Service> }) => {
      return axiosInstance.put(`/admin/services/${serviceId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: string) => {
      return axiosInstance.delete(`/admin/services/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

