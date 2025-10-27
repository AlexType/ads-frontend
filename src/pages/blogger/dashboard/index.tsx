import { Card, Statistic, Row, Col, Spin } from 'antd';
import { DollarOutlined, FileTextOutlined, TrophyOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useBloggerDashboard } from 'features/dashboard/api/dashboard.api';
import { motion } from 'framer-motion';
import './dashboard.css';

export const BloggerDashboardPage = () => {
  const { data, isLoading } = useBloggerDashboard();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const { overview } = data || {};

  return (
    <div className="blogger-dashboard">
      <h1 className="page-title">Дашборд</h1>

      {/* Статистика */}
      <Row gutter={[24, 24]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="stat-card">
              <Statistic
                title="Всего заказов"
                value={overview?.totalOrders || 0}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#6366f1' }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="stat-card">
              <Statistic
                title="Активных"
                value={overview?.activeOrders || 0}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#10b981' }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="stat-card">
              <Statistic
                title="Заработок"
                value={overview?.totalEarnings || 0}
                prefix={<DollarOutlined />}
                suffix="₽"
                valueStyle={{ color: '#f59e0b' }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="stat-card">
              <Statistic
                title="Рейтинг"
                value={overview?.avgRating || 0}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#ef4444' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Последние заказы */}
      <Card className="recent-orders" style={{ marginTop: 24 }}>
        <h2>Последние заказы</h2>
        <div className="orders-list">
          {data?.recentOrders?.map((order: any) => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <h3>{order.title}</h3>
                <p>{order.description}</p>
              </div>
              <div className="order-status">
                <span className={`status-badge ${order.status}`}>{order.status}</span>
              </div>
            </div>
          ))}
          {(!data?.recentOrders || data.recentOrders.length === 0) && (
            <p>Нет заказов</p>
          )}
        </div>
      </Card>
    </div>
  );
};

