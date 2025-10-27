import { useState } from 'react';
import { Card, Button, Tag, Spin, Descriptions, Avatar, Row, Col, Tabs, Space, Divider, Typography, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { StarOutlined, EditOutlined, GlobalOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { useBloggerProfile, useUpdateBloggerProfile } from 'features/profile/api/profile.api';
import { formatNumber, formatCurrency } from 'shared/lib/utils/format';
import './profile.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

export const BloggerProfilePage = () => {
  const { data: profile, isLoading, error } = useBloggerProfile();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const updateProfileMutation = useUpdateBloggerProfile();

  const handleEdit = () => {
    if (profile) {
      form.setFieldsValue({
        categories: profile.categories || [],
        languages: profile.languages || [],
        pricing: profile.pricing || {},
        availabilityStatus: profile.availabilityStatus || 'available',
        bio: profile.bio || '',
      });
      setIsEditModalVisible(true);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateProfileMutation.mutateAsync(values);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const user = profile?.userId || {};

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Title level={2}>Профиль</Title>
        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          Редактировать
        </Button>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card className="avatar-card">
            <Avatar size={140} src={user.avatar} className="profile-avatar" />
            <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
              {user.firstName} {user.lastName}
            </Title>
            
            <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 16 }}>
              {user.email && (
                <div className="contact-info">
                  <MailOutlined /> <Text>{user.email}</Text>
                </div>
              )}
              {user.phone && (
                <div className="contact-info">
                  <PhoneOutlined /> <Text>{user.phone}</Text>
                </div>
              )}
            </Space>

            <Divider style={{ margin: '24px 0' }} />

            <div className="profile-stats">
              <div className="stat-item">
                <StarOutlined style={{ fontSize: 24, color: '#f59e0b' }} />
                <div>
                  <div className="stat-value">{profile?.rating?.toFixed(1) || 0}</div>
                  <div className="stat-label">Рейтинг</div>
                </div>
              </div>
            </div>

            {profile?.availabilityStatus === 'available' && (
              <Tag color="success" icon={<CheckCircleOutlined />} style={{ marginTop: 16, fontSize: 14 }}>
                Доступен
              </Tag>
            )}
          </Card>

          {profile?.socialAccounts && profile.socialAccounts.length > 0 && (
            <Card title="Социальные сети" style={{ marginTop: 24 }}>
              {profile.socialAccounts.map((account: any) => (
                <div key={account._id} className="social-account">
                  <GlobalOutlined style={{ fontSize: 20, marginRight: 12 }} />
                  <div>
                    <div><strong>{account.platform.toUpperCase()}</strong></div>
                    <Text type="secondary">{account.username}</Text>
                    {account.followers && (
                      <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                        {formatNumber(account.followers)} подписчиков
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </Col>

        <Col xs={24} lg={16}>
          <Card className="info-card">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Основная информация" key="1">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Категории">
                    {profile?.categories?.map((cat: string) => (
                      <Tag key={cat} color="blue">{cat}</Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Языки">
                    {profile?.languages?.map((lang: string) => (
                      <Tag key={lang}>{lang}</Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Подписчики">
                    {formatNumber(profile?.audienceStats?.totalFollowers || 0)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Заказов выполнено">
                    {profile?.completedOrders || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Вовлеченность">
                    {((profile?.engagement?.engagementRate || 0) * 100).toFixed(2)}%
                  </Descriptions.Item>
                  <Descriptions.Item label="Средний лайки">
                    {formatNumber(profile?.engagement?.avgLikes || 0)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Средние комментарии">
                    {formatNumber(profile?.engagement?.avgComments || 0)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Время ответа">
                    {profile?.responseTime || '-'}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>

              <TabPane tab="Ценообразование" key="2">
                <div className="pricing-grid">
                  <div className="price-item">
                    <div className="price-icon">📝</div>
                    <span className="label">Пост</span>
                    <span className="value">{formatCurrency(profile?.pricing?.post || 0)}</span>
                  </div>
                  <div className="price-item">
                    <div className="price-icon">📸</div>
                    <span className="label">Story</span>
                    <span className="value">{formatCurrency(profile?.pricing?.story || 0)}</span>
                  </div>
                  <div className="price-item">
                    <div className="price-icon">🎬</div>
                    <span className="label">Reel</span>
                    <span className="value">{formatCurrency(profile?.pricing?.reel || 0)}</span>
                  </div>
                  <div className="price-item">
                    <div className="price-icon">🎥</div>
                    <span className="label">Video</span>
                    <span className="value">{formatCurrency(profile?.pricing?.video || 0)}</span>
                  </div>
                </div>
              </TabPane>

              <TabPane tab="Статистика" key="3">
                {profile?.audienceStats && (
                  <Row gutter={16}>
                    <Col xs={8}>
                      <div className="stat-card-center">
                        <div className="stat-number">♂️</div>
                        <div className="stat-label">Мужчины</div>
                        <div className="stat-value-large">
                          {((profile.audienceStats.genderDistribution?.male || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div className="stat-card-center">
                        <div className="stat-number">♀️</div>
                        <div className="stat-label">Женщины</div>
                        <div className="stat-value-large">
                          {((profile.audienceStats.genderDistribution?.female || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div className="stat-card-center">
                        <div className="stat-number">📊</div>
                        <div className="stat-label">Средний возраст</div>
                        <div className="stat-value-large">
                          {profile.audienceStats.avgAge || '-'} лет
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Редактировать профиль"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            Отмена
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            icon={<SaveOutlined />}
            loading={updateProfileMutation.isPending}
            onClick={handleSave}
          >
            Сохранить
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            categories: [],
            languages: [],
            pricing: {},
            availabilityStatus: 'available',
          }}
        >
          <Form.Item
            name="categories"
            label="Категории"
            rules={[{ required: true, message: 'Выберите категории' }]}
          >
            <Select
              mode="multiple"
              placeholder="Выберите категории"
              options={[
                { label: 'Lifestyle', value: 'lifestyle' },
                { label: 'Tech', value: 'tech' },
                { label: 'Food', value: 'food' },
                { label: 'Travel', value: 'travel' },
                { label: 'Fashion', value: 'fashion' },
                { label: 'Beauty', value: 'beauty' },
                { label: 'Fitness', value: 'fitness' },
                { label: 'Gaming', value: 'gaming' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="languages"
            label="Языки"
            rules={[{ required: true, message: 'Выберите языки' }]}
          >
            <Select
              mode="multiple"
              placeholder="Выберите языки"
              options={[
                { label: 'Русский', value: 'ru' },
                { label: 'English', value: 'en' },
                { label: 'Deutsch', value: 'de' },
                { label: 'Français', value: 'fr' },
                { label: 'Español', value: 'es' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="availabilityStatus"
            label="Статус доступности"
          >
            <Select>
              <Select.Option value="available">Доступен</Select.Option>
              <Select.Option value="busy">Занят</Select.Option>
              <Select.Option value="unavailable">Недоступен</Select.Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">Цены на услуги</Divider>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name={['pricing', 'post']}
                label="Пост (₽)"
                rules={[{ required: true, message: 'Укажите цену' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['pricing', 'story']}
                label="Story (₽)"
                rules={[{ required: true, message: 'Укажите цену' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['pricing', 'reel']}
                label="Reel (₽)"
                rules={[{ required: true, message: 'Укажите цену' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['pricing', 'video']}
                label="Video (₽)"
                rules={[{ required: true, message: 'Укажите цену' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="bio"
            label="Биография"
          >
            <TextArea rows={4} placeholder="Расскажите о себе..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

