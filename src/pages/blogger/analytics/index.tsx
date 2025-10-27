import React, { useState } from 'react';
import { Card, Statistic, Select, Row, Col, Table, Typography, Tag } from 'antd';
import { 
  RiseOutlined, 
  TrophyOutlined, 
  DollarOutlined, 
  ShoppingOutlined 
} from '@ant-design/icons';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useBloggerAnalytics } from 'features/analytics/api/analytics.api';
import './analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const { Title: TitleTypography } = Typography;

const periodOptions = [
  { label: 'Последние 7 дней', value: '7' },
  { label: 'Последние 30 дней', value: '30' },
  { label: '3 месяца', value: '90' },
  { label: 'Год', value: '365' },
];

const BloggerAnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState('30');
  const { data, isLoading } = useBloggerAnalytics(period);

  if (isLoading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Загрузка...</div>;
  }

  const overview = data?.overview || {};
  const charts = data?.charts || {};
  const topPlatforms = data?.topPlatforms || [];
  const topAdvertisers = data?.topAdvertisers || [];
  const categoryStats = data?.categoryStats || [];

  // Данные для графика роста подписчиков
  const followerGrowthChartData = {
    labels: charts.followerGrowth?.map((item: any) => item.month) || [],
    datasets: [
      {
        label: 'Подписчики',
        data: charts.followerGrowth?.map((item: any) => item.subscribers) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Данные для графика вовлеченности
  const engagementChartData = {
    labels: charts.engagement?.map((item: any) => item.month) || [],
    datasets: [
      {
        label: 'Вовлеченность (%)',
        data: charts.engagement?.map((item: any) => item.engagement) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Данные для графика заработка
  const earningsChartData = {
    labels: charts.earnings?.map((item: any) => item.month) || [],
    datasets: [
      {
        label: 'Заработок (₽)',
        data: charts.earnings?.map((item: any) => item.earnings) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const topPlatformsColumns = [
    {
      title: 'Платформа',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: 'Заработок',
      dataIndex: 'earnings',
      key: 'earnings',
      render: (value: number) => `${value.toLocaleString('ru-RU')} ₽`,
    },
    {
      title: 'Доля',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => `${value}%`,
    },
  ];

  const topAdvertisersColumns = [
    {
      title: 'Рекламодатель',
      dataIndex: 'advertiserId',
      key: 'advertiserId',
      render: (id: string) => `ID: ${id.substring(0, 8)}...`,
    },
    {
      title: 'Заказов',
      dataIndex: 'ordersCount',
      key: 'ordersCount',
    },
    {
      title: 'Потрачено',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (value: number) => `${value.toLocaleString('ru-RU')} ₽`,
    },
  ];

  const categoryColumns = [
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Заказов',
      dataIndex: 'orders',
      key: 'orders',
    },
    {
      title: 'Заработок',
      dataIndex: 'earnings',
      key: 'earnings',
      render: (value: number) => `${value.toLocaleString('ru-RU')} ₽`,
    },
    {
      title: 'Доля',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => `${value}%`,
    },
  ];

  return (
    <div className="blogger-analytics-page">
      <div className="analytics-header">
        <TitleTypography level={2}>📊 Аналитика</TitleTypography>
        <Select
          value={period}
          onChange={setPeriod}
          style={{ width: 200 }}
          options={periodOptions}
        />
      </div>

      {/* Карточки статистики */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Общий охват"
              value={(overview as any).totalReach || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Вовлеченность"
              value={(overview as any).totalEngagement || 0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Заработок"
              value={(overview as any).totalEarnings || 0}
              prefix={<DollarOutlined />}
              suffix="₽"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Активных заказов"
              value={(overview as any).activeOrders || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Графики */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Рост аудитории" style={{ height: 400 }}>
            <Line data={followerGrowthChartData} options={chartOptions} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Вовлеченность" style={{ height: 400 }}>
            <Line data={engagementChartData} options={chartOptions} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="Заработок по месяцам" style={{ height: 400 }}>
            <Bar data={earningsChartData} options={chartOptions} />
          </Card>
        </Col>
      </Row>

      {/* Статистика по платформам и категориям */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Топ платформы по заработку">
            <Table
              dataSource={topPlatforms}
              columns={topPlatformsColumns}
              pagination={false}
              rowKey="platform"
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Статистика по категориям">
            <Table
              dataSource={categoryStats}
              columns={categoryColumns}
              pagination={false}
              rowKey="category"
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Топ рекламодатели */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Топ рекламодатели">
            <Table
              dataSource={topAdvertisers}
              columns={topAdvertisersColumns}
              pagination={false}
              rowKey="advertiserId"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BloggerAnalyticsPage;

