import { Card, Row, Col, Statistic, Typography, Table, Tag, Spin, Alert, Progress } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  FileTextOutlined, 
  RiseOutlined,
  DollarOutlined,
  TrophyOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { useAdminDashboard } from 'features/admin/api/admin.api';
import './dashboard.css';

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title, Text } = Typography;

export const AdminDashboardPage = () => {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="Ошибка загрузки данных" type="error" />
      </div>
    );
  }

  const { platformOverview = {}, growthMetrics = {}, recentActivity = [], activityGraphs = {}, moderation = {} } = data || {};

  const recentActivityColumns = [
    {
      title: 'Заказ',
      dataIndex: '_id',
      key: '_id',
      render: (id: string) => `#${id.slice(-6)}`,
    },
    {
      title: 'Рекламодатель',
      dataIndex: 'advertiserId',
      key: 'advertiser',
      render: (advertiser: any) => advertiser ? `${advertiser.firstName} ${advertiser.lastName}` : '-',
    },
    {
      title: 'Блогер',
      dataIndex: 'bloggerId',
      key: 'blogger',
      render: (blogger: any) => blogger ? `${blogger.firstName} ${blogger.lastName}` : '-',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price ? `${price}₽` : '-',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          pending: { color: 'orange', text: 'Ожидает' },
          in_progress: { color: 'blue', text: 'В работе' },
          review: { color: 'purple', text: 'На проверке' },
          completed: { color: 'green', text: 'Завершен' },
          cancelled: { color: 'red', text: 'Отменен' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  // Графики для Chart.js
  const registrationsChartData = {
    labels: (activityGraphs.registrations || []).map((item: any) => item.date),
    datasets: [
      {
        label: 'Регистрации',
        data: (activityGraphs.registrations || []).map((item: any) => item.count),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ordersChartData = {
    labels: (activityGraphs.orders || []).map((item: any) => item.date),
    datasets: [
      {
        label: 'Заказы',
        data: (activityGraphs.orders || []).map((item: any) => item.count),
        backgroundColor: '#818cf8',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };


  return (
    <div className="admin-dashboard" style={{ padding: '24px' }}>
      <Title level={2}>Панель администратора</Title>
      <Text type="secondary">Обзор платформы и активность</Text>

      {/* Основная статистика */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Всего пользователей"
              value={platformOverview.totalUsers || 0}
              prefix={<UserOutlined style={{ color: '#3f8600' }} />}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Активных: {growthMetrics.activeUsers || 0}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Блогеров"
              value={platformOverview.totalBloggers || 0}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">+{growthMetrics.newBloggersThisMonth || 0} за месяц</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Рекламодателей"
              value={platformOverview.totalAdvertisers || 0}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">+{growthMetrics.newAdvertisersThisMonth || 0} за месяц</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Заказов"
              value={platformOverview.totalOrders || 0}
              prefix={<ShoppingCartOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Всего выполнено</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Дополнительная статистика */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Общий доход"
              value={platformOverview.totalRevenue || 0}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="₽"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Кампаний"
              value={platformOverview.totalCampaigns || 0}
              prefix={<TrophyOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary">Рост пользователей</Text>
            </div>
            <Progress percent={parseFloat(growthMetrics.growthRate || '0')} strokeColor="#52c41a" />
            <Text style={{ fontSize: '12px', color: '#666' }}>{growthMetrics.growthRate || 0}% за месяц</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary">Retention Rate</Text>
            </div>
            <Progress percent={parseFloat(growthMetrics.retentionRate || '0')} strokeColor="#1890ff" />
            <Text style={{ fontSize: '12px', color: '#666' }}>{growthMetrics.retentionRate || 0}% активность</Text>
          </Card>
        </Col>
      </Row>

      {/* Статистика по заказам */}
      {platformOverview.ordersByStatus && (
        <Card title="Заказы по статусам" style={{ marginTop: '24px' }}>
          <Row gutter={16}>
            <Col xs={12} sm={8} lg={4}>
              <div style={{ textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <div style={{ marginTop: 8 }}>
                  <Text strong>{platformOverview.ordersByStatus.completed || 0}</Text>
                  <div><Text type="secondary">Завершено</Text></div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <div style={{ textAlign: 'center' }}>
                <ScheduleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <div style={{ marginTop: 8 }}>
                  <Text strong>{platformOverview.ordersByStatus.pending || 0}</Text>
                  <div><Text type="secondary">Ожидает</Text></div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <div style={{ textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                <div style={{ marginTop: 8 }}>
                  <Text strong>{platformOverview.ordersByStatus.review || 0}</Text>
                  <div><Text type="secondary">На проверке</Text></div>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={8} lg={4}>
              <div style={{ textAlign: 'center' }}>
                <StopOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                <div style={{ marginTop: 8 }}>
                  <Text strong>{platformOverview.ordersByStatus.cancelled || 0}</Text>
                  <div><Text type="secondary">Отменено</Text></div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Графики */}
      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Регистрации за неделю">
            <div style={{ height: 250 }}>
              <Line data={registrationsChartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Заказы за неделю">
            <div style={{ height: 250 }}>
              <Bar data={ordersChartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Модерация */}
      <Card title="Модерация" style={{ marginTop: '24px' }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div style={{ padding: '16px', background: '#fff7e6', borderRadius: '8px', border: '1px solid #ffe58f' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileTextOutlined style={{ fontSize: 24, color: '#faad14' }} />
                <div>
                  <Text strong style={{ fontSize: 18 }}>{moderation.pendingProfiles || 0}</Text>
                  <div><Text type="secondary">Профилей на проверке</Text></div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ padding: '16px', background: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <div>
                  <Text strong style={{ fontSize: 18 }}>{moderation.pendingReviews || 0}</Text>
                  <div><Text type="secondary">Отзывов на модерации</Text></div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Последняя активность */}
      <Card title="Последние заказы" style={{ marginTop: '24px' }}>
        <Table
          dataSource={recentActivity}
          columns={recentActivityColumns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

