import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { axiosInstance } from 'shared/api/axios';
import { useAuth } from 'app/providers/use-auth';
import './register.css';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'blogger';
  const [loading, setLoading] = useState(false);

  // Редирект если уже авторизован
  if (!isLoading && user) {
    const roleBasedPath: Record<string, string> = {
      blogger: '/blogger/dashboard',
      advertiser: '/advertiser/dashboard',
      admin: '/admin/dashboard'
    };
    const path = roleBasedPath[user.role] || '/dashboard';
    return <Navigate to={path} replace />;
  }

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/register', {
        ...values,
        role,
      });
      if (data.success) {
        navigate('/login');
      }
    } catch (error) {
      // Ошибка уже обработана в axios interceptor
    } finally {
      setLoading(false);
    }
  };

  // Показываем loading пока проверяем авторизацию
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>Проверка авторизации...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <Card className="register-card">
          <h2>Регистрация {role === 'blogger' ? 'блогера' : 'рекламодателя'}</h2>
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Введите имя' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Имя"
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Введите фамилию' }]}
            >
              <Input
                placeholder="Фамилия"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Неверный формат email' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
              />
            </Form.Item>

            {role === 'advertiser' && (
              <Form.Item name="company">
                <Input placeholder="Название компании" />
              </Form.Item>
            )}

            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Введите телефон' }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="+7 (999) 123-45-67"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Введите пароль' },
                { min: 8, message: 'Минимум 8 символов' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Пароль (мин. 8 символов)"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
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
                placeholder="Подтвердите пароль"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Зарегистрироваться
              </Button>
            </Form.Item>

            <div className="register-links">
              <a href="/login">Уже есть аккаунт? Войти</a>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

