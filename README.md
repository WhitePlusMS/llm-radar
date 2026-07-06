# LLM Radar

配置驱动的大模型能力雷达图静态站点。每个模型对应一份 YAML 文件，构建时自动生成索引并渲染可交互的多模型 benchmark 对比视图。

## 核心特性

- **配置驱动**：新增模型只需提交 `models/{company}/{model}.yaml`，无需修改前端代码。
- **来源可追溯**：每个分数都指向原始论文、技术报告或官方 leaderboard，不依赖第三方复测。
- **多模型对比**：支持同时勾选多个模型，雷达图并排展示不同 benchmark 上的表现。
- **缺失可视化**：未报告的分数在雷达图上显示为中心 N/A 点，避免误读为真实 0 分。
- **行业平均线**：默认显示所有模型平均基线，支持自定义参与平均的模型集合。
- **GitHub Pages 托管**：纯前端静态站点，通过 GitHub Actions 自动构建部署。

## 数据文件

```text
models/                  # 模型 YAML 文件，按公司分目录
  openai/
    gpt-4o.yaml
  alibaba/
    qwen-3.7-plus.yaml
metrics.yaml             # benchmark 定义（轴、尺度、能力标签）
companies.yaml           # 公司/组织元数据
assets/logos/            # 公司 logo SVG
```

## 技术栈

- 构建工具：Vite
- 前端框架：React + Hooks
- UI 组件：shadcn/ui + Tailwind CSS
- 图表库：ECharts for React
- 部署：GitHub Pages + GitHub Actions

## 数据来源策略

- 仅收录模型发布方原始论文、技术报告或官方 leaderboard 中报告的分数。
- 不收录第三方复测、社区重跑或匿名来源的数据。
- 每个分数通过 `source` 字段指向模型文件内声明的原始来源。

## 本地开发

```bash
npm install
npm run build      # 校验数据并生成 model-index.json
npm run preview    # 预览构建产物
```

## 部署

推送至 `cicd` 分支将触发 GitHub Actions 构建，并自动部署到 `gh-pages`。

## 许可证

MIT
