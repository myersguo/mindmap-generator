import axios from 'axios';
import { getModelConfig } from './storageService';
import { MindMapNode } from '../types';

export interface MindMapResponse {
  nodes: MindMapNode[];
}


const normalizeNode = (node: any): MindMapNode => {
  const { id, label } = node;
  const rawChildren = Array.isArray(node.children) ? node.children : [];
  const children: MindMapNode[] = rawChildren.map(normalizeNode);
  return { id, label, children };
};

export const generateMindMap = async (
  prd: string,
  promptTemplate: string
): Promise<MindMapResponse> => {
  const config = getModelConfig();
  let rawContent = '';

  const systemMessage = {
    role: 'system',
    content: `You are a helpful assistant that generates test cases. Always respond with a pure JSON object with a top-level \"nodes\" array. Each node must have keys \"id\" (string), \"label\" (string), and optionally \"children\" (array).` 
  };

  const userPrompt = promptTemplate.replace('{{PRD}}', prd);

  try {
    const response = await axios.post(
      config.baseUrl,
      {
        model: config.model,
        messages: [systemMessage, { role: 'user', content: userPrompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );

    
    const responseText = response.data.choices[0].message.content;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/{[\s\S]*}/) || 
                      responseText;
    
    let jsonContent = jsonMatch[1] || jsonMatch[0];
    
    
    jsonContent = jsonContent.replace(/^```json/, '').replace(/```$/, '');
    
    const parsedData = JSON.parse(jsonContent);
    
    const traverse = (node: any) => {
      node.id = Math.random().toString(36).substring(2, 15);
      if (node.children) {
        node.children.forEach(traverse);
      }
    }
    return parsedData.nodes[0];
  } catch (error) {
    console.error('AI API调用失败或返回格式不正确:', error);
    throw new Error(`无法生成符合格式要求的脑图，请检查模型输出. 原始返回:\n${rawContent}`);
  }
};
