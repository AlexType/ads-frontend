import { Card, Statistic, Row, Col, Spin } from 'antd';
import { DollarOutlined, FileTextOutlined, TrophyOutlined, EyeOutlined } from '@ant-design/icons';
import { useAdvertiserDashboard } from 'features/dashboard/api/dashboard.api';
import { motion } from 'framer-motion';
import './dashboard.css';

export const AdvertiserDashboardPage = () => {
  const { data, isLoading } = useAdvertiserDashboard();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const { overview } = data || {};

  return (
    <div className="advertiser-dashboard">
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
                title="Всего кампаний"
                value={overview?.totalCampaigns || 0}
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
                value={overview?.activeCampaigns || 0}
                prefix={<TrophyOutlined />}
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
                title="Общий бюджет"
                value={overview?.totalBudget || 0}
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
                title="Общий охват"
                value={overview?.totalReach || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#ef4444' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Топ кампании */}
      <Card className="recent-campaigns" style={{ marginTop: 24 }}>
        <h2>Последние кампании</h2>
        <div className="campaigns-list">
          {data?.recentCampaigns?.map((campaign: any) => (
            <div key={campaign.id} className="campaign-item">
              <div className="campaign-info">
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>
              </div>
              <div className="campaign-status">
                <span className={`status-badge ${campaign.status}`}>{campaign.status}</span>
              </div>
            </div>
          ))}
          {(!data?.recentCampaigns || data.recentCampaigns.length === 0) && (
            <p>Нет кампаний</p>
          )}
        </div>
      </Card>
    </div>
  );
};

