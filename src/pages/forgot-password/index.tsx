import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Space } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from 'app/providers/use-auth';
import { axiosInstance } from 'shared/api/axios';
import './forgot-password.css';

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Если пользователь уже авторизован, редиректим на дашборд
  if (user) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' :
                         user.role === 'blogger' ? '/blogger/dashboard' :
                         '/advertiser/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email: values.email
      });

      if (response.data.success) {
        message.success('Инструкции по восстановлению пароля отправлены на email');
        setSuccess(true);
      } else {
        message.error('Произошла ошибка');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      // Даже если ошибка, показываем успех для безопасности
      message.success('Если пользователь с таким email существует, мы отправили инструкции на email');
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-container">
        <Card className="forgot-password-card">
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <MailOutlined style={{ fontSize: 64, color: '#52c41a' }} />
            <Title level={3}>Проверьте email</Title>
            <Text type="secondary">
              Если пользователь с таким email существует, мы отправили инструкции по восстановлению пароля.
            </Text>
            <Space>
              <Button type="primary" onClick={() => navigate('/login')}>
                Вернуться к входу
              </Button>
              <Link to="/">
                <Button>На главную</Button>
              </Link>
            </Space>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <Card className="forgot-password-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <MailOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={2}>Восстановление пароля</Title>
            <Text type="secondary">
              Введите email адрес, на который мы отправим инструкции по восстановлению пароля
            </Text>
          </div>

          <Form
            name="forgot-password"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Введите корректный email' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Отправить
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login">
              <Button type="link" icon={<ArrowLeftOutlined />}>
                Вернуться к входу
              </Button>
            </Link>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;


