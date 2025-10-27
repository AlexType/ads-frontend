import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, App } from 'antd';
import { EyeOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from 'shared/api/axios';
import type { Order } from 'shared/types';
import './orders.css';

export const AdvertiserOrdersPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('all');

  // Получение заказов
  const { data, isLoading } = useQuery({
    queryKey: ['advertiser-orders', activeTab],
    queryFn: async () => {
      const params: Record<string, string> = { page: '1', limit: '100' };
      if (activeTab !== 'all') {
        params.status = activeTab;
      }
      const { data } = await axiosInstance.get('/orders/advertiser', { params });
      return data.data;
    },
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination || { total: 0, current: 1, itemsPerPage: 10 };

  // Действия с заказами
  const approveOrder = useMutation({
    mutationFn: async (orderId: string) => {
      await axiosInstance.post(`/orders/${orderId}/approve`);
    },
    onSuccess: () => {
      message.success('Заказ принят');
      queryClient.invalidateQueries({ queryKey: ['advertiser-orders'] });
    },
    onError: () => message.error('Не удалось принять заказ'),
  });

  const requestChanges = useMutation({
    mutationFn: async ({ orderId, changes }: { orderId: string; changes: string }) => {
      await axiosInstance.post(`/orders/${orderId}/request-changes`, { changes });
    },
    onSuccess: () => {
      message.success('Запрошены правки');
      queryClient.invalidateQueries({ queryKey: ['advertiser-orders'] });
    },
    onError: () => message.error('Не удалось запросить правки'),
  });

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: 'Ожидает' },
      accepted: { color: 'blue', text: 'Принят' },
      in_progress: { color: 'processing', text: 'В работе' },
      submitted: { color: 'purple', text: 'На проверке' },
      completed: { color: 'success', text: 'Завершён' },
      cancelled: { color: 'default', text: 'Отменён' },
      rejected: { color: 'error', text: 'Отклонён' },
    };
    const cfg = config[status] || { color: 'default', text: status };
    return <Tag color={cfg.color}>{cfg.text}</Tag>;
  };

  const handleApprove = (orderId: string) => {
    Modal.confirm({
      title: 'Принять работу?',
      content: 'Работа будет принята и отмечена как выполненная',
      okText: 'Принять',
      okType: 'primary',
      onOk: () => approveOrder.mutate(orderId),
    });
  };

  const handleRequestChanges = (orderId: string) => {
    let changesText = '';
    Modal.confirm({
      title: 'Запросить правки',
      content: (
        <div>
          <p style={{ marginBottom: '8px' }}>Укажите, какие правки необходимы:</p>
          <textarea
            id="changes-input"
            placeholder="Например: нужно добавить логотип компании, изменить текст..."
            style={{ width: '100%', minHeight: '100px', padding: '8px', marginTop: '8px' }}
            onChange={(e) => (changesText = e.target.value)}
          />
        </div>
      ),
      okText: 'Отправить запрос',
      okType: 'primary',
      onOk: () => {
        if (!changesText.trim()) {
          message.warning('Укажите, какие правки необходимы');
          return;
        }
        requestChanges.mutate({ orderId, changes: changesText });
      },
    });
  };

  const columns = [
    {
      title: 'Блогер',
      dataIndex: 'bloggerId',
      key: 'blogger',
      render: (blogger: any) => (
        <Space>
          {blogger?.avatar && <img src={blogger.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />}
          <span>{blogger?.firstName || 'Неизвестно'} {blogger?.lastName || ''}</span>
        </Space>
      ),
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString('ru-RU')} ₽`,
      sorter: (a: Order, b: Order) => a.price - b.price,
    },
    {
      title: 'Дедлайн',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline: string) => new Date(deadline).toLocaleDateString('ru-RU'),
      sorter: (a: Order, b: Order) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Ожидает', value: 'pending' },
        { text: 'Принят', value: 'accepted' },
        { text: 'В работе', value: 'in_progress' },
        { text: 'На проверке', value: 'submitted' },
        { text: 'Завершён', value: 'completed' },
        { text: 'Отменён', value: 'cancelled' },
      ],
      onFilter: (value: any, record: Order) => record.status === value,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/orders/${record.id || record._id}`)}
          >
            Просмотр
          </Button>
          {record.status === 'review' && (
            <>
              <Button
                icon={<CheckOutlined />}
                size="small"
                type="primary"
                onClick={() => handleApprove(record.id || record._id)}
              >
                Принять
              </Button>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleRequestChanges(record.id || record._id)}
              >
                Правки
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Мои заказы</h2>
          <Space>
            <Button
              type={activeTab === 'all' ? 'primary' : 'default'}
              onClick={() => setActiveTab('all')}
            >
              Все
            </Button>
            <Button
              type={activeTab === 'pending' ? 'primary' : 'default'}
              onClick={() => setActiveTab('pending')}
            >
              Новые
            </Button>
            <Button
              type={activeTab === 'in_progress' ? 'primary' : 'default'}
              onClick={() => setActiveTab('in_progress')}
            >
              В работе
            </Button>
            <Button
              type={activeTab === 'submitted' ? 'primary' : 'default'}
              onClick={() => setActiveTab('submitted')}
            >
              На проверке
            </Button>
            <Button
              type={activeTab === 'completed' ? 'primary' : 'default'}
              onClick={() => setActiveTab('completed')}
            >
              Выполненные
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.itemsPerPage,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Всего ${total} заказов`,
          }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

