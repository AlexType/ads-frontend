import { axiosInstance } from 'shared/api/axios';
import { useQuery } from '@tanstack/react-query';
import { Blogger, Pagination } from 'shared/types';

export interface SearchBloggersParams {
  category?: string;
  minFollowers?: number;
  maxFollowers?: number;
  platforms?: string;
  languages?: string;
  location?: string;
  minEngagementRate?: number;
  maxPrice?: number;
  sortBy?: 'followers' | 'rating' | 'price';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchBloggersResponse {
  bloggers: Blogger[];
  pagination?: Pagination;
  total?: number;
}

export const searchApi = {
  searchBloggers: async (params?: SearchBloggersParams): Promise<SearchBloggersResponse> => {
    const { data } = await axiosInstance.get('/search/bloggers', { params });
    return data.data;
  },

  getBloggerById: async (bloggerId: string) => {
    const { data } = await axiosInstance.get(`/search/bloggers/${bloggerId}`);
    return data.data;
  },
};

export const useSearchBloggers = (params?: SearchBloggersParams) => {
  return useQuery({
    queryKey: ['search-bloggers', params],
    queryFn: () => searchApi.searchBloggers(params),
    staleTime: 1 * 60 * 1000, // 1 минута
  });
};

export const useBloggerDetails = (bloggerId: string) => {
  return useQuery({
    queryKey: ['blogger-details', bloggerId],
    queryFn: () => searchApi.getBloggerById(bloggerId),
    enabled: !!bloggerId,
  });
};

