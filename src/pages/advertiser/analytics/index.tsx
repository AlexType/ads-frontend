import { Card, Row, Col, Statistic, Typography, Table, Tag, Spin, DatePicker, Alert } from 'antd';
import { DollarOutlined, RiseOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAdvertiserAnalytics, CampaignDetail } from 'features/analytics/api/analytics.api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const { Title: TitleTypography } = Typography;
const { RangePicker } = DatePicker;

export const AdvertiserAnalyticsPage = () => {
  const { data, isLoading, error } = useAdvertiserAnalytics();
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

  const { overview, campaignDetails, charts } = data || {};
  const monthlyData = charts?.monthlyData || [];
  const channelData = charts?.channelData || [];

  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
  
  // Данные для Line Chart
  const lineChartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Охват',
        data: monthlyData.map(item => item.value),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#1890ff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Конверсии',
        data: monthlyData.map(item => item.conversions),
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#52c41a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            return `${context.dataset.label}: ${new Intl.NumberFormat('ru-RU').format(context.parsed.y)}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function(value: any) {
            return new Intl.NumberFormat('ru-RU', {
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(Number(value));
          },
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
        },
      },
    },
  };

  // Данные для Doughnut Chart
  const doughnutChartData = {
    labels: channelData.map(item => item.name),
    datasets: [
      {
        data: channelData.map(item => item.value),
        backgroundColor: COLORS,
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 12,
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${new Intl.NumberFormat('ru-RU').format(value)} (${percentage}%)`;
          }
        }
      },
    },
  };

  const columns = [
    {
      title: 'Кампания',
      dataIndex: 'campaign',
      key: 'campaign',
    },
    {
      title: 'Охват',
      dataIndex: 'reach',
      key: 'reach',
      render: (reach: number) => reach.toLocaleString('ru-RU'),
      sorter: (a: CampaignDetail, b: CampaignDetail) => a.reach - b.reach,
    },
    {
      title: 'Вовлеченность',
      dataIndex: 'engagement',
      key: 'engagement',
      render: (engagement: string) => `${engagement}%`,
      sorter: (a: CampaignDetail, b: CampaignDetail) => Number(a.engagement) - Number(b.engagement),
    },
    {
      title: 'Конверсии',
      dataIndex: 'conversions',
      key: 'conversions',
      sorter: (a: CampaignDetail, b: CampaignDetail) => a.conversions - b.conversions,
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      render: (roi: number) => (
        <Tag color={roi > 0 ? 'green' : 'red'}>
          {roi > 0 ? '+' : ''}{roi}%
        </Tag>
      ),
      sorter: (a: CampaignDetail, b: CampaignDetail) => a.roi - b.roi,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <TitleTypography level={2} style={{ margin: 0 }}>Аналитика</TitleTypography>
        <RangePicker />
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Общий бюджет"
              value={overview?.totalBudget || 0}
              prefix={<DollarOutlined />}
              suffix="₽"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Активные кампании"
              value={overview?.activeCampaigns || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Общий охват"
              value={overview?.totalReach || 0}
              prefix={<RiseOutlined />}
              suffix="чел."
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Средний ROI"
              value={overview?.avgROI || 0}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Динамика охвата">
            <div style={{ height: '300px', position: 'relative' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Распределение по каналам">
            <div style={{ height: '300px', position: 'relative' }}>
              {channelData.length > 0 ? (
                <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  Нет данных для отображения
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Детальная статистика по кампаниям">
        <Table
          columns={columns}
          dataSource={campaignDetails}
          rowKey="campaign"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

