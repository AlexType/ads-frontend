export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  role: 'blogger' | 'advertiser' | 'admin';
  company?: string;
  twoFactorEnabled?: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms?: boolean;
  };
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Blogger {
  userId: User;
  categories: string[];
  languages: string[];
  location?: string;
  pricing: {
    post: number;
    story: number;
    reel: number;
    video: number;
  };
  audienceStats: {
    totalFollowers: number;
    avgViews: number;
    avgEngagement: number;
  };
  engagement: {
    engagementRate: number;
    avgLikes: number;
    avgComments: number;
  };
  rating: number;
  totalOrders: number;
  availabilityStatus: 'available' | 'busy';
}

export interface Campaign {
  id: string;
  title: string;
  campaignType: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: {
    total: number;
    allocated: number;
    spent: number;
  };
  targetAudience: {
    demographics?: any;
    interests: string[];
    location?: string;
  };
  startDate: string;
  endDate: string;
  categories: string[];
  metrics?: {
    totalReach: number;
    totalEngagement: number;
    ctr: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  campaignId?: string;
  campaign?: Campaign;
  bloggerId?: string;
  blogger?: Blogger;
  advertiserId?: string;
  advertiser?: User;
  contentType: 'post' | 'story' | 'reel' | 'video';
  description: string;
  requirements?: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  price: number;
  deadline: string;
  contentUrls?: string[];
  platformUrls?: string[];
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  bloggerId: string;
  platform: 'vk' | 'telegram' | 'youtube';
  username: string;
  profileUrl: string;
  followers: number;
  posts: number;
  verified: boolean;
  lastSync?: string;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  unreadCount?: {
    [userId: string]: number;
  };
}

export interface Message {
  id: string;
  chatId: string;
  senderId: User;
  content: string;
  type: 'text' | 'file' | 'image';
  attachments?: string[];
  read: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'order_new' | 'order_updated' | 'message' | 'payment' | 'review';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  fromUserId: User;
  toUserId: string;
  rating: number;
  comment: string;
  criteria?: {
    professionalism: number;
    contentQuality: number;
    timeliness: number;
    communication: number;
  };
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string | Order;
  fromUserId: string;
  toUserId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

