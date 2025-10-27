import { useEffect, useState } from 'react';
import { Card, Form, Input, Switch, Button, Typography, Space, Divider, Spin, App, Modal } from 'antd';
import { SaveOutlined, BellOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from 'app/providers/use-auth';
import { axiosInstance } from 'shared/api/axios';
import './settings.css';

const { Title, Text } = Typography;

export const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordForm] = Form.useForm();
  
  const updateProfileMutation = useMutation({
    mutationFn: async (values: {
      firstName: string;
      lastName: string;
      middleName?: string;
      phone: string;
      bio?: string;
      notifications: {
        email: boolean;
        push: boolean;
        sms?: boolean;
      };
    }) => {
      const { data } = await axiosInstance.put('/profile', values);
      return data.data;
    },
    onSuccess: (data) => {
      message.success('Настройки успешно сохранены');
      setUser({ ...user, ...data });
    },
    onError: () => {
      message.error('Не удалось сохранить настройки');
    },
  });

  // Заполняем форму данными из контекста пользователя
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        phone: user.phone,
        bio: user.bio,
        notifications: user.notifications || {
          email: true,
          push: true,
          sms: false
        }
      });
    }
  }, [user, form]);

  const changePasswordMutation = useMutation({
    mutationFn: async (values: { currentPassword: string; newPassword: string }) => {
      const { data } = await axiosInstance.post('/profile/change-password', values);
      return data;
    },
    onSuccess: () => {
      message.success('Пароль успешно изменен');
      setIsChangePasswordModalOpen(false);
      passwordForm.resetFields();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        message.error('Неверный текущий пароль');
      } else {
        message.error('Не удалось изменить пароль');
      }
    },
  });

  const onFinish = async (values: {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    bio?: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms?: boolean;
    };
  }) => {
    // Trim всех полей
    const trimmedValues = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      middleName: values.middleName?.trim() || '',
      bio: values.bio?.trim()
    };

    updateProfileMutation.mutate(trimmedValues);
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <Title level={2}>Настройки</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="settings-form"
        >
          {/* Личные данные */}
          <Card title="Личные данные" className="settings-card">
            <Form.Item
              name="firstName"
              label="Имя"
              rules={[
                { required: true, message: 'Введите имя' },
                { whitespace: true, message: 'Имя не может состоять из пробелов' },
                { min: 2, message: 'Имя должно быть минимум 2 символа' }
              ]}
            >
              <Input placeholder="Введите имя" size="large" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Фамилия"
              rules={[
                { required: true, message: 'Введите фамилию' },
                { whitespace: true, message: 'Фамилия не может состоять из пробелов' },
                { min: 2, message: 'Фамилия должна быть минимум 2 символа' }
              ]}
            >
              <Input placeholder="Введите фамилию" size="large" />
            </Form.Item>

            <Form.Item
              name="middleName"
              label="Отчество"
              rules={[
                { whitespace: true, message: 'Отчество не может состоять из пробелов' },
                { min: 2, message: 'Отчество должно быть минимум 2 символа' }
              ]}
            >
              <Input placeholder="Введите отчество" size="large" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Телефон"
              rules={[
                { required: true, message: 'Введите телефон' },
                { pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, message: 'Формат: +7 (999) 123-45-67' }
              ]}
            >
              <Input placeholder="+7 (999) 123-45-67" size="large" />
            </Form.Item>

            <Form.Item
              name="bio"
              label="О себе"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Расскажите о себе..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Card>

          {/* Уведомления */}
          <Card 
            title={
              <Space>
                <BellOutlined />
                <span>Уведомления</span>
              </Space>
            } 
            className="settings-card"
          >
            <Form.Item 
              name={['notifications', 'email']}
              label="Email уведомления"
            >
              <Switch checkedChildren="Включено" unCheckedChildren="Выключено" />
            </Form.Item>

            <Form.Item 
              name={['notifications', 'push']}
              label="Push уведомления"
            >
              <Switch checkedChildren="Включено" unCheckedChildren="Выключено" />
            </Form.Item>

            <Form.Item 
              name={['notifications', 'sms']}
              label="SMS уведомления"
            >
              <Switch checkedChildren="Включено" unCheckedChildren="Выключено" />
            </Form.Item>

            <Text type="secondary">
              Выберите способ получения уведомлений о новых заказах, сообщениях и других событиях
            </Text>
          </Card>

          {/* Безопасность */}
          <Card 
            title={
              <Space>
                <SafetyOutlined />
                <span>Безопасность</span>
              </Space>
            } 
            className="settings-card"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={5}>Двухфакторная аутентификация (2FA)</Title>
                <Text type="secondary">
                  {user?.twoFactorEnabled 
                    ? '✅ 2FA включена. Ваш аккаунт защищен дополнительным уровнем безопасности.'
                    : 'Добавьте дополнительный уровень безопасности для вашего аккаунта'}
                </Text>
                <div style={{ marginTop: '12px' }}>
                  {user?.twoFactorEnabled ? (
                    <Button danger onClick={() => message.info('Функция в разработке')}>
                      Отключить 2FA
                    </Button>
                  ) : (
                    <Button onClick={() => message.info('Функция в разработке')}>
                      Включить 2FA
                    </Button>
                  )}
                </div>
              </div>

              <Divider />

              <div>
                <Title level={5}>Смена пароля</Title>
                <Text type="secondary">
                  Обновляйте пароль регулярно для безопасности аккаунта
                </Text>
                <div style={{ marginTop: '12px' }}>
                  <Button onClick={() => setIsChangePasswordModalOpen(true)}>
                    Изменить пароль
                  </Button>
                </div>
              </div>
            </Space>
          </Card>

          {/* Кнопка сохранения */}
          <div className="settings-actions">
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              icon={<SaveOutlined />}
              loading={updateProfileMutation.isPending}
            >
              Сохранить изменения
            </Button>
          </div>
        </Form>
      </div>

      {/* Модальное окно смены пароля */}
      <Modal
        title="Смена пароля"
        open={isChangePasswordModalOpen}
        onCancel={() => {
          setIsChangePasswordModalOpen(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={(values) => changePasswordMutation.mutate(values)}
        >
          <Form.Item
            name="currentPassword"
            label="Текущий пароль"
            rules={[{ required: true, message: 'Введите текущий пароль' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Введите текущий пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Новый пароль"
            rules={[
              { required: true, message: 'Введите новый пароль' },
              { min: 8, message: 'Пароль должен быть минимум 8 символов' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Пароль должен содержать заглавные, строчные буквы, цифры и специальные символы'
              }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Введите новый пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Подтвердите новый пароль"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Подтвердите новый пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Подтвердите новый пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={changePasswordMutation.isPending}
            >
              Изменить пароль
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

