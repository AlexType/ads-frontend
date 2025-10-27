import { Card, Form, Input, Button, message, Space, Typography, Divider, Row, Col, Spin } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from 'shared/api/axios';
import './landing.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

interface LandingSettings {
  hero: {
    title: string;
    subtitle: string;
    ctaText?: string;
  };
  features?: Array<{
    title: string;
    description: string;
    icon: string;
    link?: string;
  }>;
  stats?: {
    totalBloggers: number;
    totalAdvertisers: number;
    totalOrders: number;
    totalRevenue: number;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  contact?: {
    email: string;
    phone: string;
    workingHours: string;
  };
}

export const AdminLandingSettings = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['landing-settings'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/admin/settings/landing');
      return data.data?.landingPage || data.data || {};
    },
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (values: LandingSettings) => {
      const { data } = await axiosInstance.put('/admin/settings/landing', values);
      return data;
    },
    onSuccess: () => {
      message.success('Настройки лендинга сохранены');
      queryClient.invalidateQueries({ queryKey: ['landing-settings'] });
      queryClient.invalidateQueries({ queryKey: ['landing-data'] });
    },
    onError: () => {
      message.error('Ошибка при сохранении настроек');
    },
  });

  const onFinish = (values: LandingSettings) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="admin-landing-settings">
      <Card>
        <Title level={2}>Настройки лендинга</Title>
        <Paragraph type="secondary">
          Управляйте содержимым главной страницы сайта
        </Paragraph>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          initialValues={currentSettings}
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Hero Section */}
          <Card type="inner" title="Секция Hero" style={{ marginBottom: 24 }}>
            <Form.Item
              name={['hero', 'title']}
              label="Заголовок"
              rules={[{ required: true, message: 'Введите заголовок' }]}
            >
              <Input size="large" placeholder="Найдите идеального блогера для вашего бренда" />
            </Form.Item>

            <Form.Item
              name={['hero', 'subtitle']}
              label="Подзаголовок"
              rules={[{ required: true, message: 'Введите подзаголовок' }]}
            >
              <TextArea
                rows={3}
                placeholder="Платформа для поиска и сотрудничества с инфлюенсерами. Быстро, просто, эффективно."
              />
            </Form.Item>
          </Card>

          {/* Statistics */}
          <Card type="inner" title="Статистика" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name={['stats', 'totalBloggers']} label="Всего блогеров">
                  <Input type="number" placeholder="5000" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name={['stats', 'totalAdvertisers']} label="Рекламодателей">
                  <Input type="number" placeholder="1500" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name={['stats', 'totalOrders']} label="Заказов">
                  <Input type="number" placeholder="10000" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name={['stats', 'totalRevenue']} label="Общий доход (₽)">
                  <Input type="number" placeholder="50000000" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Features */}
          <Card type="inner" title="Преимущества" style={{ marginBottom: 24 }}>
            <Form.List name="features">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      type="inner"
                      extra={<Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />}
                      style={{ marginBottom: 16 }}
                    >
                      <Row gutter={16}>
                        <Col xs={24} sm={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'icon']}
                            label="Иконка"
                          >
                            <Input placeholder="✨" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={16}>
                          <Form.Item
                            {...restField}
                            name={[name, 'title']}
                            label="Название"
                          >
                            <Input placeholder="AI-Подбор блогеров" />
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            label="Описание"
                          >
                            <TextArea rows={2} placeholder="Описание преимущества" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()} block>
                    Добавить преимущество
                  </Button>
                </>
              )}
            </Form.List>
          </Card>

          {/* FAQ */}
          <Card type="inner" title="FAQ (Часто задаваемые вопросы)" style={{ marginBottom: 24 }}>
            <Form.List name="faq">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      type="inner"
                      extra={<Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />}
                      style={{ marginBottom: 16 }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'question']}
                        label="Вопрос"
                        rules={[{ required: true, message: 'Введите вопрос' }]}
                      >
                        <Input placeholder="Как найти подходящего блогера?" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'answer']}
                        label="Ответ"
                        rules={[{ required: true, message: 'Введите ответ' }]}
                      >
                        <TextArea rows={3} placeholder="Ответ на вопрос..." />
                      </Form.Item>
                    </Card>
                  ))}
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()} block>
                    Добавить вопрос
                  </Button>
                </>
              )}
            </Form.List>
          </Card>

          {/* Contact Info */}
          <Card type="inner" title="Контактная информация" style={{ marginBottom: 24 }}>
            <Paragraph type="secondary" style={{ marginBottom: 16 }}>
              Эта информация отображается в футере сайта
            </Paragraph>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name={['contact', 'email']} label="Email">
                  <Input placeholder="info@influencerhub.ru" type="email" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name={['contact', 'phone']} label="Телефон">
                  <Input placeholder="+7 (999) 123-45-67" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name={['contact', 'workingHours']} label="Часы работы">
                  <Input placeholder="Ежедневно с 9:00 до 21:00" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={updateMutation.isPending}
            >
              Сохранить изменения
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

