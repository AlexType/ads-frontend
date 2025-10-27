import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, Spin } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { AppProviders } from 'app/providers';
import { router } from 'app/routes';
import { customTheme } from 'shared/config/theme';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  return (
    <ConfigProvider theme={customTheme} locale={ruRU}>
      <AntdApp>
        <AppProviders>
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Spin size="large" />
            </div>
          }>
            <RouterProvider router={router} />
          </Suspense>
        </AppProviders>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
