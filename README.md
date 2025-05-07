# PRD 测试用例脑图生成器

一个基于大语言模型的测试用例生成工具，能够根据产品需求文档(PRD)自动生成结构化的测试用例脑图。

## ✨ 功能特点

- 📝 支持输入PRD内容，自动生成测试用例脑图
- 🧠 基于大语言模型智能分析需求并生成测试点
- 🗂️ 结构化展示测试用例，包括功能、性能、兼容性等维度
- 🎨 交互式脑图界面，支持缩放、拖拽等操作
- ⚙️ 可配置的提示词模板，适应不同测试需求
- 🔄 支持测试用例的保存和查看

## 🚀 快速开始

### 环境要求

- Node.js (v14 或更高版本)
- npm (v6 或更高版本) 或 yarn

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/your-username/mindmap-generator.git
   cd mindmap-generator
   ```

2. 安装依赖：
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 配置API密钥：
   - 在设置页面配置您的大模型API密钥
   - 默认使用火山引擎的API端点，可根据需要修改

4. 启动开发服务器：
   ```bash
   npm start
   # 或
   yarn start
   ```

5. 打开浏览器访问 [http://localhost:3006](http://localhost:3006)

## 🛠️ 使用说明

1. 在首页输入PRD内容
2. 选择测试用例模板（默认提供标准模板）
3. 点击"生成测试用例脑图"按钮
4. 查看生成的测试用例脑图，可切换查看原始PRD内容
5. 使用工具栏进行脑图操作（缩放、全屏等）

## 🔧 配置说明

在设置页面可以：
- 配置大模型API密钥和端点
- 管理提示词模板
- 自定义测试用例生成规则

## 🏗️ 技术栈

- [React](https://reactjs.org/) - 前端框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript
- [AntV X6](https://x6.antv.vision/) - 图可视化引擎
- [Ant Design](https://ant.design/) - 企业级UI组件库
- [Axios](https://axios-http.com/) - HTTP客户端

## 📄 开源协议

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request
