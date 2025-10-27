import { useState } from 'react';
import { Card, Tabs, Table, Tag, Button, Modal } from 'antd';
import { useBloggerOrders } from 'features/order/api/order.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from 'features/order/api/order.api';
import { formatCurrency, formatDate } from 'shared/lib/utils/format';
import './orders.css';

export const BloggerOrdersPage = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useBloggerOrders({
    status: activeTab === 'all' ? undefined : activeTab,
  });

  const acceptOrderMutation = useMutation({
    mutationFn: orderApi.acceptOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogger-orders'] });
      Modal.success({ title: 'Заказ принят' });
    },
  });

  const rejectOrderMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      orderApi.rejectOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogger-orders'] });
      Modal.success({ title: 'Заказ отклонен' });
    },
  });

  const getStatusTag = (status: string) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'Ожидание' },
      in_progress: { color: 'blue', text: 'В работе' },
      review: { color: 'purple', text: 'На проверке' },
      completed: { color: 'green', text: 'Выполнен' },
      cancelled: { color: 'red', text: 'Отменен' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Заказ',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text || 'Без названия'}</div>
          {record.campaign?.title && (
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{record.campaign.title}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Рекламодатель',
      dataIndex: 'advertiser',
      key: 'advertiser',
      render: (advertiser: any) => (
        <div>
          <div>{advertiser?.firstName} {advertiser?.lastName}</div>
          {advertiser?.company && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{advertiser.company}</div>}
        </div>
      ),
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Дедлайн',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline: string) => formatDate(deadline),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => acceptOrderMutation.mutate(record.id)}
                loading={acceptOrderMutation.isPending}
              >
                Принять
              </Button>
              <Button
                size="small"
                onClick={() => {
                  Modal.confirm({
                    title: 'Отклонить заказ',
                    content: 'Вы уверены, что хотите отклонить этот заказ?',
                    onOk: () => rejectOrderMutation.mutate({ orderId: record.id, reason: 'Отклонено' }),
                  });
                }}
                danger
              >
                Отклонить
              </Button>
            </>
          )}
          <Button size="small" onClick={() => window.location.href = `/orders/${record.id}`}>
            Подробнее
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="blogger-orders">
      <h1 className="page-title">Мои заказы</h1>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: 'Все' },
            { key: 'pending', label: 'Новые' },
            { key: 'in_progress', label: 'В работе' },
            { key: 'review', label: 'На проверке' },
            { key: 'completed', label: 'Выполненные' },
          ]}
        />
        <Table
          dataSource={orders}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

