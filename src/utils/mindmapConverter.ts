import { Graph, Node, Edge,ToolsView } from '@antv/x6';
import { MindMapNode } from '../types';


const NODE_HEIGHT = 36;
const BASE_HORIZONTAL_GAP = 40;  
const BASE_VERTICAL_GAP = 20;    
const MIN_WIDTH = 120;           
const CHAR_WIDTH = 10;           
const H_PADDING = 40;            
const VERTICAL_GAP_FACTOR = 8;   
const HORIZONTAL_GAP_FACTOR = 0.3; 

const LEVEL_STYLES = [
  { 
    fill: '#5F95FF',
    stroke: '#5F95FF', 
    fontSize: 16,
    fontWeight: 'bold',
    textAnchor: 'left',
    textVerticalAnchor: 'middle'
  },
  { 
    fill: '#5F95FF',
    stroke: 'none', 
    fontSize: 14,
    fontWeight: 'bold',
    textAnchor: 'left',
    textVerticalAnchor: 'middle'
  },
  { 
    fill: '#ffffff',
    stroke: 'none', 
    fontSize: 12,
    fontWeight: 'normal',
    textAnchor: 'left',
    textVerticalAnchor: 'middle'
  }
];

export const convertToX6Data = (
  node: MindMapNode,
  parentId?: string,
  x: number = 100,
  y: number = 100,
  level: number = 0,
  siblingsMaxWidth: number = 0,
  siblingsChildrenCount: number = 0
): { cells: (Node.Metadata | Edge.Metadata)[]; bounds: { width: number; height: number } } => {
  const cells: (Node.Metadata | Edge.Metadata)[] = [];
  
  
  const textWidth = node.label.length * CHAR_WIDTH;
  const width = Math.max(textWidth + H_PADDING, MIN_WIDTH);
  const style = LEVEL_STYLES[Math.min(level, LEVEL_STYLES.length - 1)];

  const nodeData: Node.Metadata = {
    id: node.id,
    shape: 'rect',
    x,
    y,
    width,
    height: NODE_HEIGHT,
    level: level,
    attrs: {
      body: {
        fill: style.fill,
        stroke: level === 0 ? style.stroke : 'none', 
        strokeWidth: level === 0 ? 1 : 0, 
        rx: 4,
        ry: 4,
      },
      label: {
        text: node.label,
        fill: level >= 2 ? '#333' : '#fff',
        textAnchor: style.textAnchor,
        textVerticalAnchor: style.textVerticalAnchor,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        refX: 10,
        refY: '50%',
      },
    },
    data: {
      collapsed: node.collapsed
    }
  };
  cells.push(nodeData);

  
  if (parentId) {
    cells.push({
      id: `${parentId}-${node.id}`,
      shape: 'edge',
      source: parentId,
      target: node.id,
      router: {
        name: 'manhattan',
        args: {
          startDirections: ['right'],
          endDirections: ['left'],
          dx: level == 2 ? -16 : '25%',
        },
      },
      attrs: {
        line: {
          stroke: '#A2B1C3',
          strokeWidth: 1,
          targetMarker: null,
        },
      },
    });
  }

  let totalWidth = width;
  let totalHeight = NODE_HEIGHT;

  
  if (!node.collapsed && node.children && node.children.length > 0) {
    const childrenCount = node.children.length;
    
    
    let maxChildWidth = 0;
    let totalChildrenCount = 0;
    
    node.children.forEach(child => {
      const childWidth = Math.max(child.label.length * CHAR_WIDTH + H_PADDING, MIN_WIDTH);
      maxChildWidth = Math.max(maxChildWidth, childWidth);
      
      if (child.children) {
        totalChildrenCount += child.children.length;
      }
    });

    
    const horizontalGap = BASE_HORIZONTAL_GAP + maxChildWidth * HORIZONTAL_GAP_FACTOR;
    
    const verticalGap = BASE_VERTICAL_GAP + 
      Math.sqrt(childrenCount) * VERTICAL_GAP_FACTOR + 
      Math.sqrt(siblingsChildrenCount) * VERTICAL_GAP_FACTOR * 0.5 +
      Math.sqrt(totalChildrenCount) * VERTICAL_GAP_FACTOR * 0.3;

    let childrenWidth = 0;
    let childrenHeight = 0;
    const childrenBounds: { width: number; height: number }[] = [];

    
    node.children.forEach(child => {
      const childSiblingsCount = node.children ? node.children.length : 0;
      const { bounds } = convertToX6Data(
        child,
        node.id,
        0,
        0,
        level + 1,
        maxChildWidth,
        childrenCount
      );
      childrenBounds.push(bounds);
      childrenHeight += bounds.height + (childrenHeight > 0 ? verticalGap : 0);
      childrenWidth = Math.max(childrenWidth, bounds.width);
    });

    
    const startY = y - childrenHeight / 2 + NODE_HEIGHT / 2;
    let currentY = startY;

    
    node.children.forEach((child, index) => {
      const childX = x + width + horizontalGap;
      const { cells: childCells } = convertToX6Data(
        child,
        node.id,
        childX,
        currentY,
        level + 1,
        maxChildWidth,
        childrenCount
      );
      
      cells.push(...childCells);
      currentY += childrenBounds[index].height + verticalGap;
    });

    totalWidth += horizontalGap + childrenWidth;
    totalHeight = Math.max(totalHeight, childrenHeight);
  }

  return { cells, bounds: { width: totalWidth, height: totalHeight } };
};


const toggleCollapse = (node: MindMapNode, id: string): boolean => {
  if (node.id === id) {
    node.collapsed = !node.collapsed;
    return true;
  }
  
  
  if (node.collapsed) {
    return false;
  }
  
  if (node.children) {
    for (const child of node.children) {
      if (toggleCollapse(child, id)) {
        return true;
      }
    }
  }
  return false;
};


export const renderMindMap = (graph: Graph, root: MindMapNode) => {
  graph.clearCells();
  const { cells } = convertToX6Data(root);
  cells.forEach((cellData) => {
    if (cellData.shape === 'edge') {
      graph.addEdge(cellData as Edge.Metadata);
    } else {
      graph.addNode(cellData as Node.Metadata);
    }
  });

  
  graph.off('node:dblclick');

  
  graph.on('node:dblclick', ({ node }) => {
    toggleCollapse(root, node.id);
    renderMindMap(graph, root);
  });

  graph.centerContent();
};

