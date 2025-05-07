import React from 'react';
import { Button, Tooltip, Space } from 'antd';
import { 
  FullscreenOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';
import { Graph } from '@antv/x6';

interface MindMapToolbarProps {
  graph: Graph | null;
}

const MindMapToolbar: React.FC<MindMapToolbarProps> = ({ graph }) => {
  const handleZoomIn = () => {
    if (graph) {
      const currentZoom = graph.zoom();
      const newZoom = Math.min(3, currentZoom + 0.2);
      graph.zoomTo(newZoom); 
    }
  };

  const handleZoomOut = () => {
    if (graph) {
      const currentZoom = graph.zoom();
      const newZoom = Math.max(0.2, currentZoom - 0.2);
      graph.zoomTo(newZoom);
    }
  };

  const handleFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  };

  const handleReset = () => {
    if (graph) {
      graph.zoomTo(1, { minScale: 0.5, maxScale: 3 });
      graph.centerContent();
      graph.positionPoint({ x: 0, y: 0 }, 100, 100);
    }
  };

  return (
    <Space 
      style={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        background: 'rgba(255, 255, 255, 0.8)', 
        padding: '8px', 
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      <Tooltip title="全屏">
        <Button 
          icon={<FullscreenOutlined />} 
          onClick={handleFullscreen} 
          type="text"
        />
      </Tooltip>
      <Tooltip title="放大">
        <Button 
          icon={<ZoomInOutlined />} 
          onClick={handleZoomIn} 
          type="text"
        />
      </Tooltip>
      <Tooltip title="缩小">
        <Button 
          icon={<ZoomOutOutlined />} 
          onClick={handleZoomOut} 
          type="text"
        />
      </Tooltip>
      <Tooltip title="重置">
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleReset} 
          type="text"
        />
      </Tooltip>
    </Space>
  );
};

export default MindMapToolbar;
