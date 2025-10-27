import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from 'app/providers/use-auth';
import { useLogin } from 'features/auth/api/auth.api';
import './login.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoading } = useAuth();
  const loginMutation = useLogin();

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

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const data = await loginMutation.mutateAsync(values);
      if (data.user) {
        setUser(data.user);
        
        // Редирект на дашборд по роли
        const role = data.user.role;
        const roleBasedPath: Record<string, string> = {
          blogger: '/blogger/dashboard',
          advertiser: '/advertiser/dashboard',
          admin: '/admin/dashboard'
        };
        const path = roleBasedPath[role] || '/dashboard';
        navigate(path, { replace: true });
      }
    } catch {
      // Ошибка уже обработана в axios interceptor
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
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <h2>Вход в систему</h2>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Неверный формат email' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Введите пароль' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Пароль"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loginMutation.isPending}>
                Войти
              </Button>
            </Form.Item>

            <div className="login-links">
              <Link to="/forgot-password">Забыли пароль?</Link>
              <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

