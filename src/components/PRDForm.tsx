import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getPrompts, getDefaultPrompt } from '../services/storageService';
import { generateMindMap } from '../services/aiService';
import { saveMindMap } from '../services/storageService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getCurrentMindMap } from '../services/storageService';


const { Option } = Select;

const PRDForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState(getPrompts());
  const navigate = useNavigate();

  useEffect(() => {
    const defaultPrompt = getDefaultPrompt();
    const currentMindMap = getCurrentMindMap(); // 从 localStorage 获取
    const prdHtml = currentMindMap?.prd?.html || ''; // 获取富文本 HTML 内容
  
    form.setFieldsValue({ 
      promptId: defaultPrompt.id, 
      prd: prdHtml // 设置富文本内容
    });
  }, [form]);
  

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const selectedPrompt = prompts.find(p => p.id === values.promptId);
      
      if (!selectedPrompt) {
        message.error('请选择有效的提示语');
        return;
      }

      // 提取纯文本内容（如果需要）
      const prdText = new DOMParser().parseFromString(values.prd, 'text/html').body.textContent || '';
      
      const mindMap = await generateMindMap(prdText, selectedPrompt.content);
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

  // 自定义富文本编辑器组件
  const RichTextEditor = ({ value, onChange }: any) => {
    return (
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder="请输入产品需求文档(PRD)内容..."
        style={{ 
          height: 300,
          fontFamily: 'monospace',
          marginBottom: 24
        }}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            ['link', 'image'],
            ['clean']
          ]
        }}
      />
    );
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
          rules={[
            { 
              required: true,
              validator: (_, value) => {
                const text = new DOMParser().parseFromString(value, 'text/html').body.textContent;
                if (!text?.trim()) {
                  return Promise.reject(new Error('请输入PRD需求描述'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <RichTextEditor />
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
