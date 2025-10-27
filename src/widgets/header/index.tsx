import { Layout, Avatar, Dropdown, Typography, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from 'app/providers/use-auth';
import { NotificationsDropdown } from 'widgets/notifications-dropdown';
import type { MenuProps } from 'antd';
import './header.css';

const { Text } = Typography;

export const Header = () => {
  const { user, logout } = useAuth();

  // Функция для получения инициалов
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return `${first}${last}`;
  };

  // Функция для получения полного имени в формате "Фамилия И. О."
  const getFullName = () => {
    if (!user?.lastName && !user?.firstName) return 'Пользователь';

    const lastName = user.lastName || '';
    const firstName = user.firstName || '';
    const middleName = user.middleName || '';

    const initials = [];
    if (firstName) initials.push(firstName[0]?.toUpperCase());
    if (middleName) initials.push(middleName[0]?.toUpperCase());

    if (lastName && initials.length > 0) {
      // Формат: Фамилия И. О.
      return `${lastName} ${initials.join('. ')}.`;
    } else if (lastName) {
      return lastName;
    } else if (firstName) {
      return firstName;
    }

    return 'Пользователь';
  };

  // Функция для получения роли на русском
  const getRoleLabel = () => {
    const roles: Record<string, string> = {
      blogger: 'Блогер',
      advertiser: 'Рекламодатель',
      admin: 'Администратор',
    };
    return roles[user?.role || ''] || user?.role || '';
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'settings',
      label: 'Настройки',
      onClick: () => {
        if (user?.role === 'blogger') window.location.href = '/blogger/settings';
        else if (user?.role === 'advertiser') window.location.href = '/advertiser/settings';
        else if (user?.role === 'admin') window.location.href = '/admin/settings';
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Выход',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <Layout.Header className="app-header">
      <div className="header-right">
        <NotificationsDropdown />
        <Space size="middle" style={{ cursor: 'pointer' }}>
          <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Space size="small" style={{ cursor: 'pointer' }}>
              <Avatar src={user?.avatar} style={{ backgroundColor: '#1890ff' }}>
                {!user?.avatar && getInitials(user?.firstName, user?.lastName)}
              </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <Text strong>{getFullName()}</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {getRoleLabel()}
                </Text>
              </div>
            </Space>
          </Dropdown>
        </Space>
      </div>
    </Layout.Header>
  );
};
