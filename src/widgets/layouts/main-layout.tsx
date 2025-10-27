import { Layout } from 'antd';
import { Header } from '../header';
import { Sidebar } from '../sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import './main-layout.css';

export const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <Layout className="main-layout">
      <Sidebar />
      <Layout className="layout-content">
        <Header />
        <Layout.Content className="content-wrapper">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

