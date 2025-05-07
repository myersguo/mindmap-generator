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
        grid: true,
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          minScale: 0.2,
          maxScale: 3,
        },
        connecting: {
          anchor: 'center',
          connectionPoint: 'anchor',
          connector: 'smooth',
          createEdge() {
            return this.createEdge({
              attrs: {
                line: {
                  stroke: '#333',
                  strokeWidth: 1,
                },
              },
            });
          },
        },
        highlighting: {
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#5F95FF',
                stroke: '#5F95FF',
              },
            },
          },
        },
        panning: {
          enabled: true,
        },
        interacting: {
          nodeMovable: true,
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
        border: '1px solid #f0f0f0',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
      }}
    />
  );
};

export default MindMap;
