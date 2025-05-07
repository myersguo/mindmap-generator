import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getPrompts, getDefaultPrompt } from '../services/storageService';
import { generateMindMap } from '../services/aiService';
import { saveMindMap } from '../services/storageService';

const { TextArea } = Input;
const { Option } = Select;

const PRDForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState(getPrompts());
  const navigate = useNavigate();

  useEffect(() => {
    const defaultPrompt = getDefaultPrompt();
    form.setFieldsValue({ promptId: defaultPrompt.id });
  }, [form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const selectedPrompt = prompts.find(p => p.id === values.promptId);
      
      if (!selectedPrompt) {
        message.error('请选择有效的提示语');
        return;
      }

      const mindMap = await generateMindMap(values.prd, selectedPrompt.content);
      saveMindMap(mindMap, values.prd);
      message.success('脑图生成成功！');
      navigate('/mindmap');
    } catch (error) {
      console.error('生成脑图失败:', error);
      message.error('生成脑图失败，请检查网络连接或API配置');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="生成测试用例脑图" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="prd"
          label="PRD 需求描述"
          rules={[{ required: true, message: '请输入PRD需求描述' }]}
        >
          <TextArea 
            rows={10} 
            placeholder="请输入产品需求文档(PRD)内容..."
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Form.Item
          name="promptId"
          label="选择提示模板"
          rules={[{ required: true, message: '请选择提示模板' }]}
        >
          <Select placeholder="选择提示模板">
            {prompts.map(prompt => (
              <Option key={prompt.id} value={prompt.id}>
                {prompt.name} {prompt.isDefault ? '(默认)' : ''}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
          >
            生成测试用例脑图
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PRDForm;
