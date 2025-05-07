import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <AntHeader style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          测试用例脑图生成器
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ border: 'none' }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">首页</Link>
          </Menu.Item>
          <Menu.Item key="/settings" icon={<SettingOutlined />}>
            <Link to="/settings">设置</Link>
          </Menu.Item>
        </Menu>
      </div>
    </AntHeader>
  );
};

export default Header;
