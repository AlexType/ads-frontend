import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Timeline, Spin, Avatar } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, MessageOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'shared/api/axios';
import { formatCurrency, formatDate } from 'shared/lib/utils/format';
import './order-details.css';

export const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/orders/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs: any = {
      pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Ожидание' },
      in_progress: { color: 'blue', icon: <ClockCircleOutlined />, text: 'В работе' },
      review: { color: 'purple', icon: <CheckCircleOutlined />, text: 'На проверке' },
      completed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Выполнен' },
      cancelled: { color: 'red', icon: <ClockCircleOutlined />, text: 'Отменен' },
    };
    return configs[status] || { color: 'default', icon: null, text: status };
  };

  const statusConfig = getStatusConfig(order?.status || '');

  return (
    <div className="order-details">
      <div className="order-header">
        <div className="header-left">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginRight: 16 }}
          >
            Назад
          </Button>
          <h1>Заказ #{id}</h1>
        </div>
        <Tag color={statusConfig.color} icon={statusConfig.icon}>
          {statusConfig.text}
        </Tag>
      </div>

      <div className="order-content">
        <Card title="Информация о заказе" className="order-card">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Тип контента">
              {order?.contentType || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Цена">
              {formatCurrency(order?.price || 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Описание" span={2}>
              {order?.description || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Требования" span={2}>
              {order?.requirements || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Дедлайн">
              {formatDate(order?.deadline || '')}
            </Descriptions.Item>
            <Descriptions.Item label="Создан">
              {formatDate(order?.createdAt || '')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <div className="user-cards">
          {order?.blogger && (
            <Card title="Блогер" className="order-card">
              <div className="user-info">
                <Avatar src={order.blogger.userId?.avatar} size={64} />
                <div>
                  <h3>{order.blogger.userId?.firstName} {order.blogger.userId?.lastName}</h3>
                  <p>Рейтинг: <strong>{order.blogger.rating?.toFixed(1)}</strong></p>
                  <p>Подписчиков: <strong>{order.blogger.audienceStats?.totalFollowers || 0}</strong></p>
                </div>
              </div>
            </Card>
          )}

          {order?.advertiser && (
            <Card title="Рекламодатель" className="order-card">
              <div className="user-info">
                <Avatar src={order.advertiser.avatar} size={64} />
                <div>
                  <h3>{order.advertiser.firstName} {order.advertiser.lastName}</h3>
                  {order.advertiser.company && <p><strong>{order.advertiser.company}</strong></p>}
                  <p>{order.advertiser.email}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card title="История статусов" className="order-card">
          <Timeline>
            <Timeline.Item color="green">
              <p><strong>Создан</strong></p>
              <p>{formatDate(order?.createdAt || '')}</p>
            </Timeline.Item>
            {order?.submittedAt && (
              <Timeline.Item color="blue">
                <p><strong>Отправлен на проверку</strong></p>
                <p>{formatDate(order.submittedAt)}</p>
              </Timeline.Item>
            )}
            {order?.approvedAt && (
              <Timeline.Item color="green">
                <p><strong>Одобрен</strong></p>
                <p>{formatDate(order.approvedAt)}</p>
              </Timeline.Item>
            )}
            {order?.paidAt && (
              <Timeline.Item color="gold">
                <p><strong>Оплачен</strong></p>
                <p>{formatDate(order.paidAt)}</p>
              </Timeline.Item>
            )}
          </Timeline>
        </Card>

        {order?.contentUrls && order.contentUrls.length > 0 && (
          <Card title="Загруженный контент" className="order-card">
            <div className="content-urls">
              {order.contentUrls.map((url: string, index: number) => (
                <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="order-actions">
        <Button
          type="primary"
          icon={<MessageOutlined />}
          size="large"
        >
          Написать сообщение
        </Button>
      </div>
    </div>
  );
};
