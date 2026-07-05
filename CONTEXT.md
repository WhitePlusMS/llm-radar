# 领域术语表（LLM Radar）

## ModelCard

一个模型对应一个 YAML 文件，包含身份元数据、来源、分数。

- 文件位置：`models/{company-key}/{model-slug}.yaml`
- 内部 `id`：`{company-key}/{model-slug}`，UI 上按公司分组显示并隐藏前缀
- 包含字段：
  - `id`：命名空间 id
  - `name`：模型显示名
  - `company`：公司 key，对应 `companies.yaml`
  - `brand_color`：模型主题色（HEX），同公司不同版本建议用同一色系不同深浅
  - `release_date`：发布日期（ISO 8601）
  - `parameters`：参数字段，可包含 `total`、`active` 等
  - `architecture`：架构，如 `Dense`、`MoE`
  - `context_window`：上下文窗口，如 `128K`、`1M`
  - `modalities`：`input` / `output` 数组，标准枚举为 `text`、`image`、`audio`、`video`
  - `weight_availability_tags`：权重开放标签数组，如 `open-weights`、`closed-weights`、`partial-weights`
  - `tags`：其他预定义或自定义标签，如 `reasoning`、`multimodal`、`tool-use`
  - `logo`：logo 静态文件路径，如 `assets/logos/openai.svg`
  - `sources`：来源列表，每项含 `key`、`title`、`url`、`type`
  - `scores`：benchmark 分数映射，每项含 `value`（number 或 null）、`source`（可选，默认 fallback 到模型主 source）
- logo 约定：`assets/logos/{company-key}.svg`

## CompanyProfile

公司/组织元数据，统一维护在 `companies.yaml` 中。

- 文件位置：`companies.yaml`
- 包含字段：
  - `key`：内部 key，全小写、连字符替换空格，如 `alibaba`、`zhipu-ai`
  - `name`：显示名，如 `Alibaba`、`智谱 AI`
  - `website`：官网链接（可选）

## Metric / Benchmark

雷达图的基本轴单位，对应论文/leaderboard 中报告的具体数据集或评测任务。

- 文件位置：`metrics.yaml`
- 包含字段：
  - `id`：内部 key
  - `name`：显示名
  - `description`：描述
  - `scale`：分数尺度，`percentage` | `zero_to_one` | `raw`
  - `higher_is_better`：是否越高越好
  - `max_value`：`raw` 尺度时的归一化锚点
  - `capability_tags`：能力标签，用于分组/筛选/图例
- 示例：`mmlu-pro`、`humaneval`、`gpqa`、`gsm8k`、`arena-elo`

## Capability

能力维度，仅用于对 Benchmark 进行分组、筛选和着色，**不直接作为可计算的分数**。

- 示例：`reasoning`、`coding`、`math`、`knowledge`、`long-context`、`instruction-following`
- 原则：Capability 本身不生成 composite score，避免黑箱聚合

## ModelIndex

入口文件，汇总并链接所有 ModelCard、CompanyProfile 和 Metric 定义。

- 文件位置：构建时自动生成到 `public/model-index.json`，不手动维护
- 作用：让前端一次性知道有哪些模型、公司、benchmark
- 规则：构建脚本扫描 `models/**/*.yaml` 自动汇总；任何校验失败都会让构建退出

## FrontendStack

GitHub Pages 托管的纯前端技术栈。

- 构建工具：Vite
- 框架：React（函数组件 + Hooks）
- UI 组件库：shadcn/ui
- 样式：Tailwind CSS
- 图标：Lucide React
- 图表库：ECharts for React（`echarts-for-react`）
- 部署：GitHub Actions 构建并推送到 `gh-pages` 分支
- 触发分支：`cicd` 分支推送时触发构建，`main` 分支推送不触发
- 选择 React + shadcn/ui + Tailwind 的原因：AI 代码生成工具对这套栈的训练数据最丰富，vibe coding 时生成质量和可维护性最高

## ModelSelectorState

当前页面选中的模型与显示配置，全部同步到 URL query string。

- `selectedModelIds`：显示在雷达图上的模型 id 列表
- `averageModelIds`：参与平均线计算的模型 id 列表（可与显示列表不同）
- `selectedMetricIds`：当前勾选的 benchmark 轴列表
- 状态持久化：URL query string，刷新或分享链接可恢复

## AverageLine

行业平均线，作为雷达图上的一条灰色虚线基线。

- 默认显示“所有模型平均”（即所有已录入模型都参与计算）
- 用户可在模型选择器中自定义参与平均的模型集合
- 计算方式：对当前勾选的每个 benchmark，取参与平均模型在该 benchmark 上归一化后的算术平均值
- 若没有任何模型参与平均，平均线隐藏

## MissingScore（NA）

模型未报告的 benchmark 分数。

- 可视化：在雷达图上对应轴的中心点（0 分位置），多边形自然连到中心
- 顶点标签：显示为 `N/A`
- tooltip：显示 `N/A`
- 含义：表示“该模型未提供此 benchmark 分数”，不等同于实际 0 分性能

## ScoreScale

Benchmark 分数的原始尺度，由 `metrics.yaml` 统一定义，前端据此归一化到 0–100。

- `percentage`：原始值即 0–100，直接渲染
- `zero_to_one`：原始值乘以 100 后渲染
- `raw`：需要额外提供 `max_value` 做线性归一化
- 原则：归一化只为了可视化可比，tooltip 和表格中始终显示原始值与单位

## ScoreSourcePolicy

模型分数的来源策略。

- 只采用模型发布方原始论文/技术报告/官方 leaderboard 中报告的分数
- 不采用第三方复测分数
- 每个分数通过 `source` 字段追溯到 `ModelCard.sources` 中的具体 `key`
- 若 `source` 未指定，则 fallback 到模型级主 source（通常是最早/最权威的来源）

## BuildValidation

构建阶段的数据校验策略。

- `metrics.yaml`、`companies.yaml`、`models/**/*.yaml` 都必须符合结构要求
- `scores` 中的 key 必须存在于 `metrics.yaml`
- `source` 必须指向模型文件内存在的来源 key
- logo 文件缺失时给出警告但不阻断构建
- 任何结构性错误都会让构建命令退出非零，阻止错误数据上线
