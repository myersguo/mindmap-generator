import React from 'react';
import { Layout, Card } from 'antd';
import Header from '../components/Header';
import SettingsForm from '../components/SettingsForm';

const { Content } = Layout;

const SettingsPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '24px' }}>
        <Card title="系统设置" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <SettingsForm />
        </Card>
      </Content>
    </Layout>
  );
};

export default SettingsPage;
