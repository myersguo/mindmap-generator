import { Graph, Node, Edge } from '@antv/x6';
import { MindMapNode } from '../types';

export const convertToX6Data = (
  node: MindMapNode, 
  parentId?: string, 
  x: number = 400, 
  y: number = 40, 
  level: number = 0
): (Node.Metadata | Edge.Metadata)[] => {
  const cells: (Node.Metadata | Edge.Metadata)[] = [];
  
  cells.push({
    id: node.id,
    shape: 'rect',
    x: x,
    y: y,
    width: Math.max(node.label.length * 10, 100),
    height: 40,
    attrs: {
      body: {
        fill: level === 0 ? '#f5a623' : level === 1 ? '#7ed321' : '#4a90e2',
        stroke: '#333',
        rx: 8,
        ry: 8,
      },
      label: {
        text: node.label,
        fill: '#fff',
        fontSize: level === 0 ? 16 : 14,
        fontWeight: level === 0 ? 'bold' : 'normal',
      },
    },
  } as Node.Metadata);

  if (parentId) {
    cells.push({
      id: `${parentId}-${node.id}`,
      shape: 'edge',
      source: { cell: parentId },
      target: { cell: node.id },
      attrs: {
        line: {
          stroke: '#333',
          strokeWidth: 2,
        },
      },
    } as Edge.Metadata);
  }

  if (node.children && node.children.length > 0) {
    const childWidth = 200;
    const totalWidth = childWidth * node.children.length;
    const startX = x - totalWidth / 2;
    
    node.children.forEach((child, index) => {
      const childX = startX + childWidth * index + childWidth / 2;
      const childY = y + 100;
      
      const childCells = convertToX6Data(
        child, 
        node.id, 
        childX, 
        childY, 
        level + 1
      );
      
      cells.push(...childCells);
    });
  }

  return cells;
};

export const renderMindMap = (graph: Graph, node: MindMapNode) => {
  graph.clearCells();
  const cellsData = convertToX6Data(node);
  
  cellsData.forEach(cellData => {
    if (cellData.shape === 'edge') {
      graph.addEdge(cellData as Edge.Metadata);
    } else {
      graph.addNode(cellData as Node.Metadata);
    }
  });
  
  graph.centerContent();
};
