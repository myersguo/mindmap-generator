import React, { useEffect, useState, useCallback } from 'react';
import { Layout, Tabs, Empty, Typography, Button } from 'antd';
import { Graph } from '@antv/x6';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MindMap from '../components/MindMap';
import MindMapToolbar from '../components/MindMapToolbar';
import { getCurrentMindMap } from '../services/storageService';
import { MindMapNode } from '../types';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

const MindMapPage: React.FC = () => {
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [prd, setPrd] = useState<string>('');
  const navigate = useNavigate();
  
  const [graph, setGraph] = useState<Graph | null>(null);

  
  const handleGraphReady = useCallback((newGraph: Graph | null) => {
    setGraph(newGraph);
  }, []);

  useEffect(() => {
    const currentMindMap = getCurrentMindMap();
    if (currentMindMap) {
      setMindMapData(currentMindMap.mindMap);
      setPrd(currentMindMap.prd);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          返回首页
        </Button>
        
        <Tabs defaultActiveKey="1">
          <TabPane tab="测试用例脑图" key="1">
            <div style={{ position: 'relative', height: 'calc(100vh - 200px)' }}>
              {mindMapData ? (
                <>
                  <MindMap 
                    data={mindMapData} 
                    onGraphReady={handleGraphReady} 
                  />
                  {/* Pass the state variable instead of the ref.current */}
                  <MindMapToolbar graph={graph} />
                </>
              ) : (
                <Empty description="暂无脑图数据" />
              )}
            </div>
          </TabPane>
          
          <TabPane tab="需求描述" key="2">
            <Typography>
              <Title level={4}>PRD 需求描述</Title>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                {prd}
              </Paragraph>
            </Typography>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default MindMapPage;
