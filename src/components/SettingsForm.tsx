import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, Space, Table, Modal, message, Tabs } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { ModelConfig, Prompt } from '../types';
import { getModelConfig, saveModelConfig, getPrompts, savePrompts } from '../services/storageService';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const SettingsForm: React.FC = () => {
  const [modelForm] = Form.useForm();
  const [promptForm] = Form.useForm();
  const [modelConfig, setModelConfig] = useState<ModelConfig>(getModelConfig());
  const [prompts, setPrompts] = useState<Prompt[]>(getPrompts());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    modelForm.setFieldsValue(modelConfig);
  }, [modelForm, modelConfig]);

  const handleModelSave = (values: ModelConfig) => {
    saveModelConfig(values);
    setModelConfig(values);
    message.success('模型配置已保存');
  };

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    promptForm.resetFields();
    setIsModalVisible(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    promptForm.setFieldsValue({
      name: prompt.name,
      content: prompt.content,
      isDefault: prompt.isDefault,
    });
    setIsModalVisible(true);
  };

  const handleDeletePrompt = (id: string) => {
    const targetPrompt = prompts.find(p => p.id === id);
    if (targetPrompt?.isDefault) {
      message.error('默认提示不能删除');
      return;
    }

    if (prompts.length <= 1) {
      message.error('至少保留一个提示');
      return;
    }

    const newPrompts = prompts.filter(p => p.id !== id);
    savePrompts(newPrompts);
    setPrompts(newPrompts);
    message.success('提示已删除');
  };

  const handlePromptSave = (values: any) => {
    const newPrompt: Prompt = {
      id: editingPrompt ? editingPrompt.id : uuidv4(),
      name: values.name,
      content: values.content,
      isDefault: values.isDefault,
      createdAt: editingPrompt ? editingPrompt.createdAt : new Date().toISOString(),
    };

    let newPrompts: Prompt[];
    if (editingPrompt) {
      newPrompts = prompts.map(p => (p.id === editingPrompt.id ? newPrompt : p));
    } else {
      newPrompts = [...prompts, newPrompt];
    }

    if (values.isDefault) {
      const newPrompts = prompts.map(p => ({ ...p, isDefault: p.id === values }));
      if (!newPrompts.some(p => p.isDefault)) {
        newPrompts[0].isDefault = true;
      }
      savePrompts(newPrompts);
      setPrompts(newPrompts);
    }

    savePrompts(newPrompts);
    setPrompts(newPrompts);
    setIsModalVisible(false);
    message.success(`提示已${editingPrompt ? '更新' : '添加'}`);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault: boolean) => (isDefault ? '是' : '否'),
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Prompt) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditPrompt(record)}
            type="text"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePrompt(record.id)}
            type="text"
            danger
            disabled={record.isDefault || prompts.length <= 1}
          />
        </Space>
      ),
    },
  ];

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="模型配置" key="1">
        <Form
          form={modelForm}
          layout="vertical"
          onFinish={handleModelSave}
          initialValues={modelConfig}
        >
          <Form.Item
            name="provider"
            label="AI 服务商"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Volcengine">Volcengine</Option>
              <Option value="openai">OpenAI</Option>
              <Option value="azure">Azure OpenAI</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="baseUrl"
            label="API 基础 URL"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="model"
            label="模型"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </TabPane>

      <TabPane tab="提示管理" key="2">
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddPrompt}
          >
            添加提示
          </Button>
        </div>
        <Table
          dataSource={prompts}
          columns={columns}
          rowKey="id"
          pagination={false}
        />

        <Modal
          title={`${editingPrompt ? '编辑' : '添加'}提示`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            form={promptForm}
            layout="vertical"
            onFinish={handlePromptSave}
          >
            <Form.Item
              name="name"
              label="提示名称"
              rules={[{ required: true, message: '请输入提示名称' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="content"
              label="提示内容"
              rules={[{ required: true, message: '请输入提示内容' }]}
            >
              <TextArea rows={15} />
            </Form.Item>

            <Form.Item
              name="isDefault"
              label="设为默认"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </TabPane>
    </Tabs>
  );
};

export default SettingsForm;
