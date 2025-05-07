import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import AppRoutes from './routes';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AppRoutes />
    </ConfigProvider>
  );
};

export default App;
