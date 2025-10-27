import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  SearchOutlined,
  MessageOutlined,
  CreditCardOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'app/providers/use-auth';
import './sidebar.css';

const { Sider } = Layout;

const menuItems = {
  blogger: [
    { key: '/blogger/dashboard', icon: React.createElement(DashboardOutlined), label: 'Дашборд' },
    { key: '/blogger/orders', icon: React.createElement(FileTextOutlined), label: 'Заказы' },
    { key: '/blogger/profile', icon: React.createElement(UserOutlined), label: 'Профиль' },
    { key: '/blogger/analytics', icon: React.createElement(BarChartOutlined), label: 'Аналитика' },
    { key: '/blogger/chats', icon: React.createElement(MessageOutlined), label: 'Сообщения' },
    { key: '/payments', icon: React.createElement(CreditCardOutlined), label: 'Платежи' },
    { key: '/blogger/settings', icon: React.createElement(SettingOutlined), label: 'Настройки' },
  ],
  advertiser: [
    { key: '/advertiser/dashboard', icon: React.createElement(DashboardOutlined), label: 'Дашборд' },
    { key: '/advertiser/search', icon: React.createElement(SearchOutlined), label: 'Поиск блогеров' },
    { key: '/advertiser/campaigns', icon: React.createElement(FileTextOutlined), label: 'Кампании' },
    { key: '/advertiser/orders', icon: React.createElement(FileTextOutlined), label: 'Заказы' },
    { key: '/advertiser/analytics', icon: React.createElement(BarChartOutlined), label: 'Аналитика' },
    { key: '/advertiser/chats', icon: React.createElement(MessageOutlined), label: 'Сообщения' },
    { key: '/advertiser/settings', icon: React.createElement(SettingOutlined), label: 'Настройки' },
  ],
  admin: [
    { key: '/admin/dashboard', icon: React.createElement(DashboardOutlined), label: 'Дашборд' },
    { key: '/admin/admins', icon: React.createElement(UserOutlined), label: 'Администраторы' },
    { key: '/admin/services', icon: React.createElement(FileTextOutlined), label: 'Услуги' },
    { key: '/admin/settings/landing', icon: React.createElement(GlobalOutlined), label: 'Настройки лендинга' },
    { key: '/admin/chats', icon: React.createElement(MessageOutlined), label: 'Сообщения' },
    { key: '/admin/settings', icon: React.createElement(SettingOutlined), label: 'Настройки' },
  ],
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const items = menuItems[user.role as 'blogger' | 'advertiser' | 'admin'] || [];

  return (
    <Sider className="app-sidebar" width={250}>
      <div className="sidebar-logo">InfluencerHub</div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

