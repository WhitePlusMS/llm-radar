# LLM Radar — 产品需求文档（PRD）

## Problem Statement

大模型发布时通常会在论文或官方 leaderboard 中报告多个 benchmark 分数，但这些分数分散在表格里，很难一眼看出模型在不同能力维度上的整体表现。维护者希望每有新模型发布时，只需要在仓库里新增一份配置文件，网站就能自动展示该模型的能力雷达图；访问者则希望能够并排对比多个模型，并且清楚看到每个分数的来源、尺度以及缺失项的含义。

目前缺少一个**配置驱动、纯前端、可 GitHub Pages 托管**的雷达图工具，它能把原始论文分数直接转化为可交互的多模型对比视图，同时避免黑箱聚合和第三方复测带来的偏差。

## Solution

建设一个名为 `llm-radar` 的静态站点：

- 每个模型对应一个 YAML 配置文件（ModelCard），按公司分目录存放，例如 `models/openai/gpt-4o.yaml`。
- `metrics.yaml` 统一定义所有 benchmark 轴、原始分数尺度、归一化锚点与能力标签。
- `companies.yaml` 统一维护公司显示名称与官网链接。
- 构建时自动扫描 `models/**/*.yaml` 生成 `ModelIndex`，避免手动维护入口文件；校验失败时构建直接退出，阻止错误数据上线。
- 前端用 React + shadcn/ui + Tailwind CSS + ECharts 渲染雷达图，支持 N 个模型对比、benchmark 自选、可配置行业平均线、缺失分数（NA）可视化、来源追溯。
- 通过 GitHub Actions 在 `cicd` 分支推送时自动构建并部署到 `gh-pages`；`main` 分支推送不触发构建。

## User Stories

1. 作为仓库维护者，我希望每新增一个模型只需在 `models/` 下创建一份 YAML 文件，这样我就不用手改前端代码或索引文件。
2. 作为仓库维护者，我希望新增 benchmark 时只需修改 `metrics.yaml`，这样后续模型都可以引用同一个定义。
3. 作为仓库维护者，我希望构建脚本能自动汇总所有模型文件生成索引，这样我可以避免漏加或拼写错误。
4. 作为仓库维护者，我希望构建在 YAML 格式非法、必填字段缺失、引用了未定义的 benchmark 或 source 越界时直接失败，这样我能尽早发现数据错误。
5. 作为仓库维护者，我希望每个分数都追溯到原始论文/官方报告，这样网站不依赖第三方复测数据。
6. 作为访问者，我希望在雷达图上选择多个模型进行对比，这样我能直观看到它们在不同 benchmark 上的差异。
7. 作为访问者，我希望默认只看到一套精选 benchmark 轴，这样首屏清晰、对比有意义。
8. 作为访问者，我希望可以展开完整的 benchmark 列表并自行勾选，这样我能探索不常见的评测维度。
9. 作为访问者，我希望雷达图默认显示“所有模型平均线”作为基准，这样我能判断单个模型处于行业什么位置。
10. 作为访问者，我希望可以自定义参与平均计算的模型集合，这样我能对比“我关心的子集”平均线。
11. 作为访问者，我希望某个模型缺失的 benchmark 在雷达图上落在中心 0 分位置，多边形自然连到中心，tooltip 标注“N/A”，这样我不会把它误解为实际 0 分。
12. 作为访问者，我希望鼠标悬停在数据点上时能看到原始分数、归一化分数、满分锚点和来源链接，这样我能追溯到论文中的具体位置。
13. 作为访问者，我希望看到每个模型的组织 logo、模型名、参数量、架构、上下文窗口、输入/输出模态、权重开放标签，这样我能快速了解模型背景。
14. 作为访问者，我希望按公司或标签筛选模型列表，这样我能快速找到想对比的模型。
15. 作为访问者，我希望在桌面和手机上都能正常查看雷达图和模型信息，这样我不用固定设备访问。
16. 作为访问者，我希望雷达图下方提供数据表格视图，这样我在需要精确数值时可以直接复制或阅读。
17. 作为访问者，我希望 URL 能记录当前选中的模型、benchmark 和平均线设置，这样我可以直接分享某个对比视图。
18. 作为 CI 系统，我希望只有 `cicd` 分支推送才触发构建和部署，这样 `main` 分支的随意提交不会污染线上站点。
19. 作为维护者，我希望 logo 以静态 SVG 文件形式放在 `assets/logos/` 下，这样我可以轻松替换或新增组织标识。
20. 作为维护者，我希望构建产物包含可部署的静态文件，这样我可以随时在本地或任意静态服务器预览。
21. 作为贡献者，我希望项目有明确的数据来源策略和 YAML 格式说明，这样我知道该提交什么样的分数。
22. 作为访问者，我希望页面 footer 显示数据最后更新时间，这样我知道仓库数据有多新。

## Implementation Decisions

### 1. 数据文件组织

- `models/{company}/{model-id}.yaml`：一个模型一个文件，按公司分目录。内部 `id` 使用 `company/model-id` 命名空间，UI 上按公司分组并隐藏前缀。
- `metrics.yaml`：统一定义所有 benchmark 轴，包含 id、name、description、scale、higher_is_better、max_value（raw 类型需要）、capability_tags。
- `companies.yaml`：统一定义公司 key 与显示名称、官网链接。
- `assets/logos/{company-lowercase}.svg`：公司 logo 静态文件。
- ModelIndex 不在仓库中手动维护，构建时由脚本扫描 `models/**/*.yaml` 自动生成，写入构建产物目录。

### 2. ModelCard YAML 形状（来自原型约定）

```yaml
id: alibaba/qwen-3.7-plus
name: Qwen 3.7 Plus
company: Alibaba
brand_color: "#FF6A00"
release_date: "2026-06-01"
parameters:
  total: "744B"
  active: "40B"
architecture: MoE
context_window: "1M"
modalities:
  input: [text, image, audio, video]
  output: [text, image, audio]
weight_availability_tags: [closed-weights, reasoning, multimodal]
logo: assets/logos/alibaba.svg
sources:
  - key: qwen3.7-report
    title: Qwen 3.7 Plus Technical Report
    url: https://arxiv.org/abs/...
    type: paper
scores:
  mmlu-pro:
    value: 86.5
    source: qwen3.7-report
  humaneval:
    value: 92.1
    source: qwen3.7-report
  gpqa:
    value: null  # 未报告即缺失
```

- `brand_color` 放在模型文件中，由维护者指定；同一公司的不同模型可共用相近色系，通过深浅在视觉上区分版本。
- `weight_availability_tags` 不采用单一分类，而是标签数组（如 `open-weights`、`closed-weights`、`partial-weights`、`reasoning`、`multimodal`），预定义标准标签但允许扩展。

### 3. metrics.yaml 形状

```yaml
metrics:
  - id: mmlu-pro
    name: MMLU-Pro
    description: Professional and academic knowledge benchmark.
    scale: percentage
    higher_is_better: true
    capability_tags: [knowledge]

  - id: humaneval
    name: HumanEval
    description: Code generation benchmark.
    scale: percentage
    higher_is_better: true
    capability_tags: [coding]

  - id: arena-elo
    name: LMSYS Arena ELO
    description: Crowd-sourced chatbot arena preference ELO.
    scale: raw
    higher_is_better: true
    max_value: 1400
    capability_tags: [chat, preference]
```

- `scale` 支持 `percentage`、`zero_to_one`、`raw`。
- `raw` 类型必须提供 `max_value` 作为归一化锚点。
- `capability_tags` 用于 benchmark 分组、筛选和图例，不直接生成 composite score。

### 4. 雷达图轴与 Capability

- 雷达图的每个轴对应一个 **Benchmark**（即 `metrics.yaml` 中的条目）。
- **Capability** 仅用于对轴进行分组、筛选和着色，不直接生成 composite score，避免黑箱聚合。
- 默认精选一组核心 benchmark（如 MMLU-Pro、GSM8K、HumanEval、长上下文、指令遵循、工具调用、事实可靠性），用户可勾选/取消，也可从完整分类列表中增选。

### 5. 多模型对比与 NA 处理

- 支持同时加载 N 个模型进行对比，每个模型使用自己的 `brand_color`；同公司不同版本建议用同一色系的不同深浅。
- 雷达图轴集合由用户当前勾选的 benchmark 决定，与是否被所有模型报告无关。
- 若某模型在当前勾选 benchmark 上无分数，该点落在雷达图中心 0 分位置，多边形自然连到中心；tooltip 显示“N/A”。
- 顶点标签显示原始分数；tooltip 同时显示原始分数、归一化 0-100 值与 `max_value` 锚点。

### 6. 分数归一化

- 所有分数在前端统一映射到 0–100 用于雷达图半径。
- `percentage` 直接渲染；`zero_to_one` 乘以 100；`raw` 按 `value / max_value * 100` 线性映射。
- Tooltip 和表格中始终保留原始值与单位，避免归一化掩盖真实差异。

### 7. 平均线

- 默认显示一条“所有模型平均”的灰色虚线基线，作为行业参考。
- 用户在模型选择器中可控制每个模型是否“显示在雷达图”以及是否“计入平均线”。
- 平均线根据当前勾选“计入平均”的模型实时计算；若没有任何模型计入平均，则隐藏该线。
- 平均线状态也同步到 URL，可分享。

### 8. 来源策略

- 只采用模型发布方原始论文、技术报告或官方 leaderboard 中报告的分数。
- 不采用第三方复测、社区重跑或匿名来源的分数。
- 每个分数通过 `source` 字段指向 ModelCard `sources` 列表中的 `key`；若未指定，则 fallback 到模型级主 source。
- UI 显示来源标题与链接。

### 9. 技术栈

- 构建工具：Vite
- 前端框架：React（函数组件 + Hooks）
- UI 组件库：shadcn/ui + Tailwind CSS
- 图标库：Lucide React
- 图表库：ECharts for React（`echarts-for-react`）
- 部署：GitHub Pages + GitHub Actions
- 触发分支：`cicd` 分支推送触发构建并推送到 `gh-pages`；`main` 推送不触发。
- 选择 React + shadcn/ui 的原因：vibe coding 时 AI 代码生成质量更高，组件库开箱即用，Tailwind 样式调整最直观。

### 10. 构建脚本

- 使用 Node.js/TypeScript 脚本在构建阶段执行：
  1. 读取并校验 `metrics.yaml` 与 `companies.yaml`。
  2. 扫描 `models/**/*.yaml`，逐条校验 ModelCard 结构。
  3. 生成 `model-index.json`，包含 metrics、companies、models、元数据摘要、分数映射、生成时间。
  4. 校验所有 `scores` 的 key 必须存在于 `metrics.yaml`；反之不强制（允许 metrics 预定义但暂无模型分数）。
  5. 校验 source 引用存在性。
  6. 校验 logo 文件存在性，缺失时给出警告但不阻断构建（可选降级为文字 fallback）。
- 任何结构性校验失败都导致构建退出非零，阻止错误数据上线。

### 11. URL 状态

- 前端通过 query string 记录当前选中的模型 ID、勾选的 benchmark、平均线设置与显示模式，例如 `?models=openai/gpt-4o,alibaba/qwen-3.7-plus&metrics=mmlu-pro,humaneval&avg=all`。
- 分享链接打开时自动恢复对应视图。

### 12. 页面布局

- 桌面端：左侧为选中模型的信息卡片区（logo、参数、模态、标签、来源），右侧为雷达图与 benchmark 选择器。
- 移动端：上下堆叠，模型信息卡片可折叠。
- 顶部：全局搜索框 + 公司/标签过滤 + 模型多选器。
- 雷达图下方：数据表格视图，展示原始分数与来源。
- Footer：数据最后更新时间（来自 `model-index.json` 生成时间）。

## Testing Decisions

### Seam 1：数据到部署（Data-to-Deploy）

- **范围**：给定一组有效的 `metrics.yaml`、`companies.yaml` 和 `models/**/*.yaml` 数据，运行完整构建流程，验证产物可部署。
- **验收标准**：
  - 构建命令退出码为 0。
  - 产物目录中包含 `model-index.json` 且结构与输入一致。
  - 产物目录中包含可部署的静态 HTML/CSS/JS。
  - 若输入 YAML 非法、必填字段缺失、引用了未定义的 benchmark 或 source 不存在，构建必须失败并输出清晰错误。
- **方式**：在 CI 和本地通过 `npm run build` 直接跑最高层接缝，不测试内部函数。

### Seam 2：雷达图 option 生成

- **范围**：用固定模型数据调用 radar option 生成函数，验证外部可见的 ECharts option 结构。
- **验收标准**：
  - 对于缺失分数的模型，对应数据点值为 0 并带有虚线/空心标记。
  - 系列数量与选中模型数量一致，平均线作为额外系列存在。
  - indicator 数量与当前勾选的 benchmark 数量一致。
- **方式**：Vitest 单元测试，只测输入输出，不依赖 DOM。

### 什么算好的测试

- 只测外部行为（构建产物、渲染结果、用户可交互状态、函数输入输出），不测实现细节（私有函数、内部 hook、具体文件路径）。
- 优先使用真实构建产物做端到端断言，而不是大量单元测试。

## Out of Scope

1. 自动从论文或 leaderboard 抓取分数。
2. 后端服务、数据库或用户认证。
3. 基于 capability 的复合评分、排序算法或模型排行榜。
4. 第三方复测数据（如 LMSYS Arena 社区投票）的收录；若收录也仅作为来源明确的 raw benchmark，不改变来源策略。
5. 深色模式（第一版）。
6. 模型详情页/独立路由（第一版）。
7. 价格和输出速度（第一版，避免非论文数据来源争议）。
8. 多语言界面（首版仅中文）。
9. 实时协作编辑或评论系统。

## Further Notes

- NA（未报告）的可视化需要与真实 0 分区分开：中心点使用虚线/空心样式，tooltip 明确写“N/A”，并在图例/说明中解释含义。
- 为无障碍和可访问性考虑，雷达图下方应提供等价的表格视图。
- 随着 benchmark 数量增长，用户自选轴数可能过多；UI 应在并集/多选场景下给出“轴数过多可能影响可读性”的轻提示，但不强制限制。
- Logo 文件使用公司 lowercase 名称命名，缺失时使用公司名首字母 fallback，避免硬编码图片 URL 导致外链失效。
- 公司主色不单独维护；由每个模型文件的 `brand_color` 决定，建议同公司模型使用相近色系。
