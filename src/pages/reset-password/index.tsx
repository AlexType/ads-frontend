import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Space } from 'antd';
import { LockOutlined, MailOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from 'app/providers/use-auth';
import { axiosInstance } from 'shared/api/axios';
import './reset-password.css';

const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Если пользователь уже авторизован, редиректим на дашборд
  if (user) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' :
                         user.role === 'blogger' ? '/blogger/dashboard' :
                         '/advertiser/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Если нет токена, редиректим на forgot-password
  if (!token) {
    return <Navigate to="/forgot-password" replace />;
  }

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword: values.password
      });

      if (response.data.success) {
        message.success('Пароль успешно изменен');
        setSuccess(true);
      } else {
        message.error('Произошла ошибка');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      message.error(error.response?.data?.error?.message || 'Токен недействителен или истек');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reset-password-container">
        <Card className="reset-password-card">
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
            <Title level={3}>Пароль изменен</Title>
            <Text type="secondary">
              Ваш пароль успешно изменен. Теперь вы можете войти в систему.
            </Text>
            <Button type="primary" size="large" onClick={() => navigate('/login')}>
              Войти
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <Card className="reset-password-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <MailOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={2}>Новый пароль</Title>
            <Text type="secondary">
              Введите новый пароль
            </Text>
          </div>

          <Form
            name="reset-password"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              name="password"
              label="Новый пароль"
              rules={[
                { required: true, message: 'Введите пароль' },
                { min: 8, message: 'Пароль должен быть минимум 8 символов' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                  message: 'Пароль должен содержать заглавные, строчные буквы, цифры и специальные символы'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Новый пароль"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Подтверждение пароля"
              rules={[
                { required: true, message: 'Подтвердите пароль' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Подтверждение пароля"
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
                Изменить пароль
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

export default ResetPasswordPage;


