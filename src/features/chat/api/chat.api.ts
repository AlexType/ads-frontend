import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from 'shared/api/axios';

export interface Chat {
  _id: string;
  participants: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }>;
  orderId?: string;
  lastMessage?: Message;
  lastMessageAt?: string;
  unreadCount?: {
    [key: string]: number;
  };
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  recipientId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'order_update';
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
  }>;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export const useChats = () => {
  return useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/chats');
      return data.data;
    },
  });
};

export const useChatMessages = (chatId: string) => {
  return useQuery<Message[]>({
    queryKey: ['chat-messages', chatId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/chats/${chatId}/messages`);
      return data.data;
    },
    enabled: !!chatId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ chatId, content, type = 'text' }: { chatId: string; content: string; type?: string }) => {
      const { data } = await axiosInstance.post(`/chats/${chatId}/messages`, { content, type });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

export const useMarkMessagesRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chatId: string) => {
      await axiosInstance.put(`/chats/${chatId}/messages/read`);
    },
    onSuccess: (_, chatId) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
    },
  });
};


