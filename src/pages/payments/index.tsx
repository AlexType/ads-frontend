import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Statistic, 
  Row, 
  Col, 
  Select, 
  Button,
  DatePicker,
  Space,
  Typography,
  Tooltip,
} from 'antd';
import { DownloadOutlined, FilterOutlined, DollarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  Legend,
  Filler
);
import { usePayments } from 'features/payments/api/payments.api';
import type { ColumnsType } from 'antd/es/table';
import './payments.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface Payment {
  _id: string;
  orderId: {
    _id: string;
    title?: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
}

const statusColors: Record<string, string> = {
  pending: 'orange',
  processing: 'blue',
  completed: 'green',
  failed: 'red',
  refunded: 'default',
};

const statusLabels: Record<string, string> = {
  pending: 'Ожидается',
  processing: 'Обрабатывается',
  completed: 'Выплачено',
  failed: 'Ошибка',
  refunded: 'Возврат',
};

const PaymentsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);
  
  const { data, isLoading } = usePayments({
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const stats = data?.stats || {};
  const payments = data?.payments || [];
  const monthlyEarnings = data?.chart?.monthlyEarnings || [];

  const columns: ColumnsType<Payment> = [
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Заказ',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId: any) => (
        <Tooltip title={`ID: ${orderId?._id || orderId}`}>
          {orderId?.title || `Заказ ${orderId?._id?.substring(0, 8)}`}
        </Tooltip>
      ),
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Payment) => (
        <span style={{ fontWeight: 'bold' }}>
          {amount.toLocaleString('ru-RU')} {record.currency}
        </span>
      ),
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status] || 'default'}>
          {statusLabels[status] || status}
        </Tag>
      ),
      filters: [
        { text: 'Ожидается', value: 'pending' },
        { text: 'Обрабатывается', value: 'processing' },
        { text: 'Выплачено', value: 'completed' },
        { text: 'Ошибка', value: 'failed' },
        { text: 'Возврат', value: 'refunded' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Дата поступления',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString('ru-RU') : '-',
    },
  ];

  // График заработка
  const earningsChartData = {
    labels: monthlyEarnings.map(item => item.month),
    datasets: [
      {
        label: 'Заработок (₽)',
        data: monthlyEarnings.map(item => item.earnings),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
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

  const handleExport = () => {
    // TODO: Реализовать экспорт в Excel
    console.log('Export to Excel');
  };

  return (
    <div className="payments-page">
      <div className="payments-header">
        <Title level={2}>💳 История платежей</Title>
        <Space>
          <RangePicker 
            format="DD.MM.YYYY"
            onChange={setDateRange}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 200 }}
            options={[
              { label: 'Все', value: 'all' },
              { label: 'Ожидается', value: 'pending' },
              { label: 'Обрабатывается', value: 'processing' },
              { label: 'Выплачено', value: 'completed' },
              { label: 'Ошибка', value: 'failed' },
            ]}
          />
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
          >
            Экспорт
          </Button>
        </Space>
      </div>

      {/* Статистика */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Общий заработок"
              value={stats.totalEarnings || 0}
              prefix={<DollarOutlined />}
              suffix="₽"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Ожидает выплаты"
              value={stats.pendingEarnings || 0}
              prefix={<ClockCircleOutlined />}
              suffix="₽"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Всего транзакций"
              value={stats.totalPayments || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* График заработка */}
      {monthlyEarnings.length > 0 && (
        <Card title="График доходов" style={{ marginBottom: 24, height: 400 }}>
          <Line data={earningsChartData} options={chartOptions} />
        </Card>
      )}

      {/* Таблица платежей */}
      <Card title="Транзакции">
        <Table
          columns={columns}
          dataSource={payments}
          loading={isLoading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Всего ${total} платежей`,
          }}
        />
      </Card>
    </div>
  );
};

export default PaymentsPage;

