import React from 'react';
import { Layout } from 'antd';
import Header from '../components/Header';
import PRDForm from '../components/PRDForm';

const { Content } = Layout;

const HomePage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '24px' }}>
        <PRDForm />
      </Content>
    </Layout>
  );
};

export default HomePage;
