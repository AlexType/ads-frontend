import { Card, Tabs, Button } from 'antd';
import { SettingOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export const AdminSettingsPage = () => {
  const navigate = useNavigate();

  const tabs = [
    {
      key: 'landing',
      label: 'Настройки лендинга',
      icon: <GlobalOutlined />,
      content: (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3>Управление содержимым главной страницы</h3>
            <p>Настройте заголовки, текст, статистику и FAQ для лендинга</p>
          </div>
          <Button type="primary" onClick={() => navigate('/admin/settings/landing')}>
            Открыть настройки
          </Button>
        </Card>
      ),
    },
    {
      key: 'contact',
      label: 'Контактная информация',
      icon: <MailOutlined />,
      content: (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3>Контактные данные</h3>
            <p>Настройте email, телефон, адрес и часы работы</p>
          </div>
          <Button type="primary" disabled>
            Скоро
          </Button>
        </Card>
      ),
    },
    {
      key: 'seo',
      label: 'SEO настройки',
      icon: <SettingOutlined />,
      content: (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3>SEO оптимизация</h3>
            <p>Мета-теги, описания и OG изображения</p>
          </div>
          <Button type="primary" disabled>
            Скоро
          </Button>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>Настройки сайта</h1>
      <Tabs items={tabs} />
    </div>
  );
};


