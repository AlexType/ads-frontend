import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from 'widgets/layouts/main-layout';
import { LandingPage } from 'pages/landing';
import { LoginPage } from 'pages/login';
import { RegisterPage } from 'pages/register';
import ForgotPasswordPage from 'pages/forgot-password';
import ResetPasswordPage from 'pages/reset-password';
import { NotFoundPage } from 'pages/error/not-found';
import { BloggerDashboardPage } from 'pages/blogger/dashboard';
import { AdvertiserDashboardPage } from 'pages/advertiser/dashboard';
import { BloggerOrdersPage } from 'pages/blogger/orders';
import { BloggerAnalyticsPage } from 'pages/blogger/analytics';
import { AdvertiserSearchPage } from 'pages/advertiser/search';
import { AdvertiserCampaignsPage } from 'pages/advertiser/campaigns';
import { AdvertiserAnalyticsPage } from 'pages/advertiser/analytics';
import { AdvertiserOrdersPage } from 'pages/advertiser/orders';
import { BloggerProfilePage as BloggerOwnProfilePage } from 'pages/blogger/profile';
import { BloggerProfilePage } from 'pages/bloggers';
import { OrderDetailsPage } from 'pages/order-details';
import { SettingsPage } from 'pages/settings';
import { AdminDashboardPage } from 'pages/admin/dashboard';
import { AdminAdminsPage } from 'pages/admin/admins';
import { AdminServicesPage } from 'pages/admin/services';
import { AdminLandingSettings } from 'pages/admin/settings/landing';
import { ChatListPage } from 'pages/chat';
import PaymentsPage from 'pages/payments';
import { ProtectedRoute } from './protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPasswordPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: '/blogger/dashboard',
        element: (
          <ProtectedRoute requiredRole="blogger">
            <BloggerDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/blogger/orders',
        element: (
          <ProtectedRoute requiredRole="blogger">
            <BloggerOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/blogger/analytics',
        element: (
          <ProtectedRoute requiredRole="blogger">
            <BloggerAnalyticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/advertiser/dashboard',
        element: (
          <ProtectedRoute requiredRole="advertiser">
            <AdvertiserDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/advertiser/search',
        element: (
          <ProtectedRoute requiredRole="advertiser">
            <AdvertiserSearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/advertiser/campaigns',
        element: (
          <ProtectedRoute requiredRole="advertiser">
            <AdvertiserCampaignsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/advertiser/analytics',
        element: (
          <ProtectedRoute requiredRole="advertiser">
            <AdvertiserAnalyticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/advertiser/orders',
        element: (
          <ProtectedRoute requiredRole="advertiser">
            <AdvertiserOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/blogger/profile',
        element: (
          <ProtectedRoute requiredRole="blogger">
            <BloggerOwnProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/bloggers/:id',
        element: (
          <ProtectedRoute requiredRole="advertiser">
            <BloggerProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders/:id',
        element: (
          <ProtectedRoute>
            <OrderDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/blogger/settings',
        element: (
          <ProtectedRoute requiredRole="blogger">
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/payments',
        element: (
          <ProtectedRoute>
            <PaymentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/advertiser/settings',
        element: (
          <ProtectedRoute requiredRole="advertiser">
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/settings',
        element: (
          <ProtectedRoute requiredRole="admin">
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/settings/landing',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminLandingSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/dashboard',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/admins',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminAdminsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/services',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminServicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/blogger/chats',
        element: (
          <ProtectedRoute requiredRole="blogger">
            <ChatListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/advertiser/chats',
        element: (
          <ProtectedRoute requiredRole="advertiser">
            <ChatListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/chats',
        element: (
          <ProtectedRoute requiredRole="admin">
            <ChatListPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

