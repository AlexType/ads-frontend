import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Descriptions, Tag, Button, Space, Row, Col, Avatar, Empty, Divider, Rate, App, Image } from 'antd';
import { StarOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, ArrowLeftOutlined, CheckCircleOutlined, EyeOutlined, LikeOutlined, CommentOutlined } from '@ant-design/icons';
import { useBloggerDetails } from 'features/search/api/search.api';
import { formatNumber, formatCurrency } from 'shared/lib/utils/format';
import './BloggerProfilePage.css';

export const BloggerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  
  const { data: blogger, isLoading } = useBloggerDetails(id || '');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!blogger) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Empty description="Блогер не найден" />
      </div>
    );
  }

  const user = blogger.userId;

  return (
    <div className="blogger-profile-page">
      <Button 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/advertiser/search')}
        className="back-button"
      >
        Назад к поиску
      </Button>

      <div className="blogger-profile-header">
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={120} 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1890ff&color=fff`}
                style={{ marginBottom: '16px', border: '4px solid #667eea' }}
              />
              <h2 style={{ marginBottom: '8px', color: '#262626' }}>{user?.firstName} {user?.lastName}</h2>
              
              <div style={{ marginBottom: '16px' }}>
                <Space>
                  <Tag color="gold" icon={<StarOutlined />} style={{ fontSize: '16px', padding: '4px 12px' }}>
                    {blogger.rating?.toFixed(1) || 0}
                  </Tag>
                  {blogger.availabilityStatus === 'available' && (
                    <Tag color="success" icon={<CheckCircleOutlined />} style={{ fontSize: '14px', padding: '4px 12px' }}>
                      Доступен
                    </Tag>
                  )}
                </Space>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Button 
                  type="primary" 
                  size="large"
                  block
                  onClick={() => navigate(`/advertiser/orders/new?bloggerId=${id}`)}
                  style={{ height: '48px', fontSize: '16px' }}
                >
                  Создать заказ
                </Button>
              </div>

              {/* Социальные аккаунты */}
              {blogger.socialAccounts && blogger.socialAccounts.length > 0 && (
                <Card 
                  title="Социальные сети" 
                  style={{ marginTop: '24px' }}
                  size="small"
                >
                  {blogger.socialAccounts.map((account: { _id: string; platform: string; username: string; followers?: number }) => (
                    <div key={account._id} className="social-account-item">
                      <GlobalOutlined />
                      <div style={{ flex: 1 }}>
                        <div><strong>{account.platform.toUpperCase()}:</strong> {account.username}</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                          {formatNumber(account.followers || 0)} подписчиков
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </Col>

          {/* Правая колонка - Детальная информация */}
          <Col xs={24} md={16}>
            {/* Основная информация */}
            <Card title="Основная информация" style={{ marginBottom: '24px' }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Категории">
                  {blogger.categories?.map((cat: string) => (
                    <Tag key={cat} color="blue" style={{ marginTop: '4px' }}>{cat}</Tag>
                  ))}
                </Descriptions.Item>
                <Descriptions.Item label="Языки">
                  {blogger.languages?.map((lang: string) => (
                    <Tag key={lang}>{lang.toUpperCase()}</Tag>
                  ))}
                </Descriptions.Item>
                <Descriptions.Item label="Подписчики">
                  {formatNumber(blogger.audienceStats?.totalFollowers || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Заказов выполнено">
                  {blogger.completedOrders || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Вовлеченность">
                  {((blogger.engagement?.engagementRate || 0) * 100).toFixed(2)}%
                </Descriptions.Item>
                <Descriptions.Item label="Средний лайки">
                  {formatNumber(blogger.engagement?.avgLikes || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Средние комментарии">
                  {formatNumber(blogger.engagement?.avgComments || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Время ответа">
                  {blogger.responseTime || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Цены */}
            <Card title="Цены на услуги" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col xs={8} sm={8}>
                  <div className="price-card">
                    <div className="price-amount">{formatCurrency(blogger.pricing?.post || 0)}</div>
                    <div className="price-label">Пост</div>
                  </div>
                </Col>
                <Col xs={8} sm={8}>
                  <div className="price-card">
                    <div className="price-amount">{formatCurrency(blogger.pricing?.story || 0)}</div>
                    <div className="price-label">Story</div>
                  </div>
                </Col>
                <Col xs={8} sm={8}>
                  <div className="price-card">
                    <div className="price-amount">{formatCurrency(blogger.pricing?.reel || 0)}</div>
                    <div className="price-label">Reel</div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Аудитория */}
            {blogger.audienceStats && (
              <Card title="Аудитория" style={{ marginBottom: '24px' }}>
                <Row gutter={16}>
                  <Col xs={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold' }}>♂️</div>
                      <div style={{ color: '#666' }}>Мужчины</div>
                      <div style={{ fontSize: '20px', marginTop: '4px' }}>
                        {((blogger.audienceStats.genderDistribution?.male || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </Col>
                  <Col xs={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold' }}>♀️</div>
                      <div style={{ color: '#666' }}>Женщины</div>
                      <div style={{ fontSize: '20px', marginTop: '4px' }}>
                        {((blogger.audienceStats.genderDistribution?.female || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </Col>
                  <Col xs={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold' }}>📊</div>
                      <div style={{ color: '#666' }}>Средний возраст</div>
                      <div style={{ fontSize: '20px', marginTop: '4px' }}>
                        {blogger.audienceStats.avgAge || '-'} лет
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Отзывы */}
            {blogger.reviews && blogger.reviews.length > 0 && (
              <Card title={`Отзывы (${blogger.reviews.length})`}>
                {blogger.reviews.map((review: { _id: string; fromUserId?: { firstName?: string; lastName?: string }; rating: number; comment: string; createdAt: string }) => (
                  <div key={review._id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{review.fromUserId?.firstName} {review.fromUserId?.lastName}</strong>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      <Rate disabled defaultValue={review.rating} />
                    </div>
                    <p style={{ marginTop: '8px', marginBottom: 0 }}>{review.comment}</p>
                    <Divider style={{ margin: '12px 0' }} />
                  </div>
                ))}
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

