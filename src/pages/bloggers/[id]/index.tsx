import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Descriptions, Tag, Button, Space, Row, Col, Avatar, Empty, Divider, Rate, App } from 'antd';
import { StarOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useBloggerDetails } from 'features/search/api/search.api';
import { formatNumber, formatCurrency } from 'shared/lib/utils/format';

export const BloggerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message: _message } = App.useApp();
  
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
    <div style={{ padding: '24px' }}>
      <Button 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/advertiser/search')}
        style={{ marginBottom: '24px' }}
      >
        Назад к поиску
      </Button>

      <Card>
        <Row gutter={24}>
          {/* Левая колонка - Основная информация */}
          <Col xs={24} lg={8}>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={120} 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1890ff&color=fff`}
                style={{ marginBottom: '16px' }}
              />
              <h2>{user?.firstName} {user?.lastName}</h2>
              {user?.email && (
                <div style={{ marginTop: '8px', color: '#666' }}>
                  <MailOutlined /> {user.email}
                </div>
              )}
              {user?.phone && (
                <div style={{ marginTop: '8px', color: '#666' }}>
                  <PhoneOutlined /> {user.phone}
                </div>
              )}
              
              <div style={{ marginTop: '16px' }}>
                <Space>
                  <Tag color="gold">
                    <StarOutlined /> {blogger.rating?.toFixed(1) || 0}
                  </Tag>
                  {blogger.availabilityStatus === 'available' && (
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                      Доступен
                    </Tag>
                  )}
                </Space>
              </div>

              <div style={{ marginTop: '24px' }}>
                <Button 
                  type="primary" 
                  size="large"
                  block
                  onClick={() => message.info('Функция создания заказа в разработке')}
                >
                  Создать заказ
                </Button>
              </div>
            </div>

            {/* Социальные аккаунты */}
            {blogger.socialAccounts && blogger.socialAccounts.length > 0 && (
              <Card 
                title="Социальные сети" 
                style={{ marginTop: '24px' }}
                size="small"
              >
                {blogger.socialAccounts.map((account: any) => (
                  <div key={account._id} style={{ marginBottom: '12px' }}>
                    <GlobalOutlined style={{ marginRight: '8px' }} />
                    <strong>{account.platform.toUpperCase()}:</strong> {account.username}
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {formatNumber(account.followers || 0)} подписчиков
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </Col>

          {/* Правая колонка - Детальная информация */}
          <Col xs={24} lg={16}>
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
                <Col xs={12} sm={8}>
                  <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {formatCurrency(blogger.pricing?.post || 0)}
                    </div>
                    <div style={{ color: '#666', marginTop: '4px' }}>Пост</div>
                  </div>
                </Col>
                <Col xs={12} sm={8}>
                  <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {formatCurrency(blogger.pricing?.story || 0)}
                    </div>
                    <div style={{ color: '#666', marginTop: '4px' }}>Story</div>
                  </div>
                </Col>
                <Col xs={12} sm={8}>
                  <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {formatCurrency(blogger.pricing?.reel || 0)}
                    </div>
                    <div style={{ color: '#666', marginTop: '4px' }}>Reel</div>
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
                {blogger.reviews.map((review: any) => (
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
      </Card>
    </div>
  );
};


