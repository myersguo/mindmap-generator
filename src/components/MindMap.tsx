
import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { renderMindMap } from '../utils/mindmapConverter';
import { MindMapNode } from '../types';

interface MindMapProps {
  data: MindMapNode;
  onGraphReady?: (graph: Graph | null) => void;
}

const MindMap: React.FC<MindMapProps> = ({ data, onGraphReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (containerRef.current && !graphRef.current) {
      graphRef.current = new Graph({
        container: containerRef.current,
        grid: false,
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          minScale: 0.2,
          maxScale: 3,
        },
        connecting: {
          anchor: 'orth',
          connector: 'rounded',
          connectionPoint: 'boundary',
          router: {
            name: 'er',
            args: {
              offset: 24,
              direction: 'H',
            },
          },
        },
        panning: {
          enabled: true,
        },
      });
      
      if (onGraphReady) {
        onGraphReady(graphRef.current);
      }
    }

    if (graphRef.current && data) {
      renderMindMap(graphRef.current, data);
    }

    return () => {
      if (onGraphReady) {
        onGraphReady(null);
      }
      graphRef.current?.dispose();
      graphRef.current = null;
    };
  }, [data, onGraphReady]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 'calc(100vh - 200px)',
        backgroundColor: '#fff',
      }}
    />
  );
};

export default MindMap;
