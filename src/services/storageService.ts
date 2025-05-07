import { ModelConfig, Prompt } from '../types';

const DEFAULT_MODEL_CONFIG: ModelConfig = {
  provider: 'Volcengine',
  baseUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  apiKey: '',
  model: 'doubao-1.5-pro-256k-250115',
};

const DEFAULT_PROMPT: Prompt = {
  id: '1',
  name: '测试用例生成器',
  content: `你是一位专业的测试工程师，擅长根据产品需求(PRD)设计测试用例。
请对以下PRD进行分析，设计全面的测试用例，并以脑图结构输出：

1. 功能测试（正向场景、异常场景）
2. 性能测试
3. 兼容性测试
4. 安全性测试
5. 用户体验测试

输出格式为JSON，格式如下：
{
  "nodes": [
    {
      "id": "root",
      "label": "测试用例",
      "children": [
        {
          "id": "1",
          "label": "功能测试",
          "children": [...]
        },
        ...
      ]
    }
  ]
}

PRD内容：{{PRD}}`,
  isDefault: true,
  createdAt: new Date().toISOString(),
};

export const getModelConfig = (): ModelConfig => {
  const stored = localStorage.getItem('modelConfig');
  return stored ? JSON.parse(stored) : DEFAULT_MODEL_CONFIG;
};

export const saveModelConfig = (config: ModelConfig): void => {
  localStorage.setItem('modelConfig', JSON.stringify(config));
};

export const getPrompts = (): Prompt[] => {
  const stored = localStorage.getItem('prompts');
  if (stored) {
    return JSON.parse(stored);
  }
  return [DEFAULT_PROMPT];
};

export const savePrompts = (prompts: Prompt[]): void => {
  localStorage.setItem('prompts', JSON.stringify(prompts));
};

export const getDefaultPrompt = (): Prompt => {
  const prompts = getPrompts();
  const defaultPrompt = prompts.find(p => p.isDefault);
  return defaultPrompt || prompts[0];
};

export const saveMindMap = (mindMap: any, prd: string): void => {
  localStorage.setItem('currentMindMap', JSON.stringify({
    mindMap,
    prd,
    timestamp: new Date().toISOString()
  }));
};

export const getCurrentMindMap = () => {
  const stored = localStorage.getItem('currentMindMap');
  return stored ? JSON.parse(stored) : null;
};
