export interface ModelConfig {
  provider: 'openai' | 'azure' | 'other' | 'Volcengine';
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface Prompt {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  collapsed?: boolean;
}
