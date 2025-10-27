import { Dropdown, Badge, Button, Empty, Space, Spin } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from 'features/notifications/api/notifications.api';
import { formatRelativeTime } from 'shared/lib/utils/format';
import './notifications.css';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data, isLoading, refetch } = useNotifications({ read: false, limit: 10 });
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const notifications = data?.notifications || [];
  const unreadCount = notifications.length;

  // Автоматическое обновление каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleNotificationClick = (notification: any) => {
    setOpen(false);
    
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
    
    // Редирект на нужную страницу в зависимости от типа
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    } else if (notification.data?.orderId) {
      navigate(`/orders/${notification.data.orderId}`);
    } else if (notification.type === 'message') {
      navigate(`/chats/${notification.data?.chatId}`);
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead.mutate();
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, { icon: string; color: string }> = {
      order: { icon: '📦', color: '#1890ff' },
      message: { icon: '💬', color: '#52c41a' },
      campaign: { icon: '🎯', color: '#722ed1' },
      payment: { icon: '💰', color: '#f5222d' },
      system: { icon: '⚙️', color: '#faad14' },
    };
    return iconMap[type] || { icon: '🔔', color: '#8c8c8c' };
  };

  const notificationsContent = (
    <div className="notifications-dropdown">
      <div className="notifications-header">
        <Space>
          <h3>Уведомления</h3>
          {unreadCount > 0 && <Badge count={unreadCount} />}
        </Space>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
            loading={markAllAsRead.isPending}
          >
            Прочитать все
          </Button>
        )}
      </div>

      <div className="notifications-list">
        {isLoading ? (
          <div className="notifications-loading">
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Нет новых уведомлений"
            style={{ padding: '20px 0' }}
          />
        ) : (
          <AnimatePresence>
            {notifications.map((item: any) => {
              const icon = getNotificationIcon(item.type);
              return (
                <motion.div
                  key={item.id || item._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`notification-item ${item.read ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className="notification-icon" style={{ background: icon.color + '20', color: icon.color }}>
                    {icon.icon}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {item.title}
                      {!item.read && <span className="unread-indicator" />}
                    </div>
                    <div className="notification-message">{item.message}</div>
                    <div className="notification-time">{formatRelativeTime(item.createdAt)}</div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notifications-footer">
          <Button 
            type="link" 
            block 
            onClick={() => {
              setOpen(false);
              navigate('/notifications');
            }}
          >
            Посмотреть все уведомления
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => notificationsContent}
      trigger={['click']}
      placement="bottomRight"
      overlayStyle={{ paddingTop: '0' }}
    >
      <Badge 
        count={unreadCount} 
        size="small"
        offset={[-2, 2]}
        style={{ 
          backgroundColor: '#ff4d4f',
        }}
      >
        <div className="notification-bell-wrapper">
          <BellOutlined className={`notification-bell ${unreadCount > 0 ? 'has-unread' : ''}`} />
        </div>
      </Badge>
    </Dropdown>
  );
};

