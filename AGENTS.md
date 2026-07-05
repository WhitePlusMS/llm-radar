# LLM Radar — AI 代理工作指南

## 项目概述

`llm-radar` 是一个**配置驱动、纯前端、可托管于 GitHub Pages** 的大模型能力雷达图站点。

- 每个大模型对应一份 YAML 配置文件（ModelCard），按公司分目录存放，例如 `models/openai/gpt-4o.yaml`。
- `metrics.yaml` 统一定义所有 benchmark 轴、原始分数尺度、归一化锚点与能力标签。
- `companies.yaml` 统一维护公司显示名称与官网链接。
- 构建时自动扫描 `models/**/*.yaml` 生成 `ModelIndex`，避免手动维护入口文件；校验失败时构建直接退出，阻止错误数据上线。
- 前端使用 React + shadcn/ui + Tailwind CSS + ECharts 渲染雷达图，支持 N 个模型对比、benchmark 自选、行业平均线、缺失分数（N/A）可视化、来源追溯。
- 通过 GitHub Actions 在 `cicd` 分支推送时自动构建并部署到 `gh-pages`；`main` 分支推送不触发构建。

**当前仓库状态**：本仓库目前处于**设计与骨架规划阶段**，代码尚未实现。项目需求、领域术语与完整实现计划分别记录在：

- `PRD.md`：产品需求文档（Problem/Solution、User Stories、实现决策、测试策略）。
- `CONTEXT.md`：领域术语表（ModelCard、Metric、Capability、ModelIndex、ScoreSourcePolicy 等）。
- `docs/superpowers/plans/2026-07-05-llm-radar-skeleton.md`：可执行的 16 步骨架实现计划，包含完整文件内容、命令与验收标准。

根目录下还有两张图片文件（`.jpg`），推测为设计稿或示意图，不纳入构建。

## 仓库结构

```
llm-radar/
├── docs/
│   └── superpowers/
│       └── plans/
│           └── 2026-07-05-llm-radar-skeleton.md   # 骨架实现计划
├── PRD.md                                          # 产品需求文档
├── CONTEXT.md                                      # 领域术语表
├── AGENTS.md                                       # 本文件
├── *.jpg                                           # 设计示意图
├── .github/workflows/deploy.yml                    # CI/CD（计划中）
├── public/                                         # Vite 静态资源 + 构建产物 model-index.json
├── scripts/
│   └── build-index.ts                              # YAML 校验与 ModelIndex 生成脚本
├── src/
│   ├── components/                                 # React 组件
│   ├── data/                                       # 数据加载
│   ├── hooks/                                      # 状态管理 hook
│   ├── lib/                                        # 纯函数工具
│   ├── types.ts                                    # 全局类型
│   ├── App.tsx                                     # 页面布局
│   ├── index.css                                   # 基础样式
│   └── main.tsx                                    # React 入口
├── tests/                                          # 接缝测试
├── assets/logos/                                   # 公司/组织 logo SVG
├── models/                                         # 模型 YAML 数据
├── metrics.yaml                                    # benchmark 定义
├── companies.yaml                                  # 公司元数据
├── index.html
├── package.json
├── tsconfig.json / tsconfig.node.json
├── vite.config.ts
├── playwright.config.ts                            # E2E 配置（可选）
└── README.md
```

> 注：上述文件/目录中带 `（计划中）` 或尚未出现的条目，均来自 `docs/superpowers/plans/2026-07-05-llm-radar-skeleton.md`，等待按该计划逐步实现。

## 技术栈

- **构建工具**：Vite
- **前端框架**：React 18（函数组件 + Hooks）
- **语言**：TypeScript
- **UI 组件库**：shadcn/ui + Tailwind CSS
- **图标库**：Lucide React
- **图表库**：ECharts for React（`echarts-for-react`）
- **YAML 解析**：js-yaml
- **Node 脚本执行**：tsx
- **测试**：Vitest（单元/接缝测试），可选 Playwright（E2E）
- **部署**：GitHub Pages + GitHub Actions
- **触发分支**：仅 `cicd` 分支推送触发构建部署；`main` 分支不触发。

选择 React + shadcn/ui + Tailwind 的原因：vibe coding / AI 代码生成时训练数据丰富，组件开箱即用，样式调整直观。

## 构建与运行命令

> 以下命令来自骨架计划，需待项目初始化完成后方可执行。

```bash
# 安装依赖
npm install

# 本地开发（先运行 build-index 再启动 Vite）
npm run dev

# 仅生成 model-index.json
npx tsx scripts/build-index.ts

# 生产构建（tsc + vite build，build 前会自动执行 prebuild）
npm run build

# 预览生产产物
npm run preview

# 运行单元/接缝测试
npm test

# 持续测试
npm run test:watch

# 可选：运行 Playwright E2E 测试
npm run test:e2e
```

### 构建脚本行为

`scripts/build-index.ts` 负责：

1. 读取并校验 `metrics.yaml` 与 `companies.yaml`。
2. 扫描 `models/**/*.yaml`，逐条校验 ModelCard 结构。
3. 生成 `public/model-index.json`，包含 metrics、companies、models、元数据摘要、生成时间。
4. 校验所有 `scores` 的 key 必须存在于 `metrics.yaml`；允许 metrics 预定义但暂无模型分数。
5. 校验 `source` / `source_index` 引用存在性。
6. 校验 logo 文件存在性，缺失时给出**警告但不阻断构建**（UI 降级为文字 fallback）。
7. 任何结构性校验失败都导致构建退出非零，阻止错误数据上线。

构建脚本支持参数：

```bash
npx tsx scripts/build-index.ts \
  --models-dir models \
  --metrics-file metrics.yaml \
  --out-dir public
```

## 数据文件规范

### `metrics.yaml`

统一定义所有 benchmark 轴。

```yaml
metrics:
  - id: mmlu-pro
    name: MMLU-Pro
    description: Professional and academic knowledge benchmark.
    scale: percentage        # percentage | zero_to_one | raw
    higher_is_better: true
    capability_tags: [knowledge]

  - id: arena-elo
    name: LMSYS Arena ELO
    scale: raw
    higher_is_better: true
    max_value: 1400          # raw 尺度必填
    capability_tags: [chat, preference]
```

### `companies.yaml`

```yaml
companies:
  - key: alibaba
    name: Alibaba
    website: https://www.aliyun.com
```

### `models/{company}/{model-id}.yaml`

```yaml
id: alibaba/qwen-3.7-plus
name: Qwen 3.7 Plus
company: alibaba              # 对应 companies.yaml 的 key
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
    value: null               # 未报告即缺失（N/A）
```

### 数据来源策略（ScoreSourcePolicy）

- 只采用模型发布方原始论文、技术报告或官方 leaderboard 中报告的分数。
- 不采用第三方复测、社区重跑或匿名来源的分数。
- 每个分数通过 `source` 字段指向 ModelCard `sources` 列表中的 `key`；若未指定，则 fallback 到模型级主 source。
- UI 必须显示来源标题与链接。

### Capability 约定

- Capability 仅用于对 benchmark 轴进行**分组、筛选和着色**，**不直接生成 composite score**，避免黑箱聚合。
- 示例：`reasoning`、`coding`、`math`、`knowledge`、`long-context`、`instruction-following`。

## 代码组织

- `src/types.ts`：所有领域类型（`Metric`、`ModelCard`、`ModelIndex`、`Source`、`ScoreEntry` 等）。
- `src/data/model-index-loader.ts`：运行时从 `/model-index.json` 加载索引。
- `src/lib/radar-option.ts`：纯函数，根据模型与 metric 生成 ECharts option，包含归一化、缺失值处理、交集/并集逻辑。
- `src/hooks/use-comparison.ts`：选中模型 + 对比模式的状态管理，状态同步到 URL query string。
- `src/components/*`：React 展示组件（ModelSelector、RadarChart、ModelMeta、SourceList、CapabilityLegend 等）。
- `tests/build.test.ts`：数据到部署接缝测试。
- `tests/radar-option.test.ts`：雷达图 option 生成接缝测试。

## 代码风格指南

- **语言**：TypeScript；首版 UI 文案为中文。
- **组件**：函数组件 + Hooks，避免类组件。
- **样式**：Tailwind CSS 为主；少量全局基础样式放在 `src/index.css`。
- **纯函数优先**：数据转换（如 `buildRadarOption`、`normalizeScore`、`selectMetrics`）写为纯函数，方便测试。
- **类型安全**：开启 `strict`、`noUnusedLocals`、`noUnusedParameters`、`noFallthroughCasesInSwitch`。
- **文件命名**：React 组件使用 PascalCase（`RadarChart.tsx`），工具/hook 使用 kebab-case（`radar-option.ts`、`use-comparison.ts`）。
- **注释**：关键业务规则（如 Capability 不生成 composite score、N/A 含义、数据来源策略）需要注释说明。
- **常量**：颜色、默认 benchmark 列表、标签枚举等抽取为常量或配置，避免硬编码。

## 测试策略

本项目采用**接缝测试（seam testing）**为主，优先验证外部可见行为，避免过度测试实现细节。

### Seam 1：数据到部署（Data-to-Deploy）

- **范围**：给定有效的 `metrics.yaml`、`companies.yaml` 和 `models/**/*.yaml`，运行完整构建流程，验证产物可部署。
- **验收标准**：
  - `npm run build` 退出码为 0。
  - `dist/` 包含可部署的静态 HTML/CSS/JS。
  - `public/model-index.json`（或构建产物中的对应文件）结构与输入一致。
  - 若 YAML 非法、必填字段缺失、引用未定义 benchmark 或 source 不存在，构建必须失败并输出清晰错误。
- **实现**：`tests/build.test.ts` 调用 `npx tsx scripts/build-index.ts` 并断言产物与错误行为。

### Seam 2：雷达图 option 生成

- **范围**：用固定模型数据调用 `buildRadarOption`，验证 ECharts option 结构。
- **验收标准**：
  - 缺失分数对应数据点值为 0 并带有虚线/空心标记。
  - 系列数量与选中模型数量一致，平均线作为额外系列存在（如已实现）。
  - `indicator` 数量与当前勾选的 benchmark 数量一致。
- **实现**：`tests/radar-option.test.ts` 纯输入输出测试，不依赖 DOM。

### 测试原则

- 只测外部行为（构建产物、函数输入输出、用户可交互状态），不测私有函数、内部 hook、具体文件路径。
- 优先使用真实构建产物做端到端断言，而不是大量单元测试。
- E2E 使用 Playwright（可选），覆盖页面加载、选择模型、雷达图渲染、URL 状态恢复。

## 部署流程

1. 代码推送到 `cicd` 分支触发 `.github/workflows/deploy.yml`。
2. GitHub Actions 执行：
   - `npm ci`
   - `npm test`
   - `GITHUB_PAGES=true npm run build`
   - 上传 `dist/` 为 Pages artifact
3. `deploy` job 将 artifact 部署到 `gh-pages` 分支并发布到 GitHub Pages。
4. `main` 分支推送**不会**触发部署，避免随意提交污染线上站点。

Vite 配置中已包含 base 路径适配：

```ts
base: process.env.GITHUB_PAGES === 'true' ? '/llm-radar/' : '/',
```

## 安全与合规注意事项

- **数据来源**：严格遵守 ScoreSourcePolicy，不收录第三方复测或匿名来源分数，避免版权与可靠性争议。
- **外部链接**：来源链接必须是模型发布方官方 URL（论文、技术报告、官方 leaderboard），避免使用可能失效或带追踪参数的第三方短链。
- **XSS 预防**：ECharts tooltip formatter 使用 HTML 时，确保来自 YAML 的字符串（模型名、来源标题）经过转义或仅作为文本插入，避免渲染未过滤的用户可控 HTML。
- **构建安全**：构建脚本运行在 CI 与本地，避免读取仓库外路径；参数路径应做基本校验，防止路径遍历。
- **依赖安全**：定期审计 `npm` 依赖，特别是 `js-yaml` 这类解析库，及时更新到修复版本。
- **不收集用户数据**：本项目为纯前端静态站点，无后端、无数据库、无用户认证，不涉及 PII 收集。
- ** secrets**：仓库若后续需要 GitHub Pages 部署 token，使用 GitHub 原生 `GITHUB_TOKEN`，不要硬编码个人 token。

## 贡献与开发流程

1. 克隆仓库后运行 `npm install`。
2. 按 `docs/superpowers/plans/2026-07-05-llm-radar-skeleton.md` 的 16 步计划实现骨架（或根据当前进度继续）。
3. 新增模型时：
   - 在 `models/{company}/` 下新增 YAML 文件。
   - 若使用新 benchmark，先在 `metrics.yaml` 中定义。
   - 将公司 logo 放入 `assets/logos/{company-key}.svg`。
4. 提交前运行 `npm test` 与 `npm run build`，确保校验通过。
5. 将改动推送到 `cicd` 分支触发自动部署；`main` 仅用于不立即上线的协作开发。

## 关键术语速查

| 术语 | 含义 |
|------|------|
| ModelCard | 一个模型对应一份 YAML 文件，含元数据、来源、分数。 |
| Metric / Benchmark | 雷达图的基本轴单位，由 `metrics.yaml` 统一定义。 |
| Capability | 能力维度，仅用于分组/筛选/着色，不生成复合分数。 |
| ModelIndex | 构建时自动生成的入口索引，写入 `public/model-index.json`。 |
| AverageLine | 雷达图上的灰色虚线基线，默认所有模型平均。 |
| MissingScore（N/A） | 模型未报告的 benchmark，在图上落至中心 0 分位置。 |
| ScoreScale | 分数原始尺度：`percentage`、`zero_to_one`、`raw`。 |
| BuildValidation | 构建阶段的数据校验，结构错误会导致构建失败。 |

## 参考资料

- `PRD.md`：产品需求与实现决策。
- `CONTEXT.md`：完整领域术语表。
- `docs/superpowers/plans/2026-07-05-llm-radar-skeleton.md`：骨架实现计划与详细代码片段。

# 项目约束

## 项目特定指令

- 你在任何时候都不需要 npm run dev(前端)或 npm run start:dev(后端)，因为我一般都会保持着前后端的运行。
- 你有权限执行所有 sudo 权限的命令。我的用户密码是xxx，在你需要 sudo 权限的时候，你可以使用这个密码。
- 在开发任务结束前，一定要终止正在运行的服务，比如 npm run dev; npm run start:dev 等
- 前端目录为当前工作目录
- 所有修改务必遵循"最简原则"，即不必任何硬功能的冗余设计，仅对必要的多可能事件做冗余
- 所有修改遵循代码健壮性，简洁性原则。所有模块必须遵循当前代码中已有的设计风格和命名风格，尽量复用已有模块
- 注释丰富
- 日志输出不用太多，但前后端关键地方都需要输出
- 不要做任何的旧代码兼容，不要做向后兼容，这样能让问题暴露出来
- 中文回答我的问题
- 对于所有接口的返回，应该使用后端统一定义的DTO, src/common/dto/api-response.dto.ts , 进行请求体的构造与返回
- **重要**：当遇到问题时，优先考虑编译错误而不是缓存问题。TypeScript 编译错误必须立即修复。
- **重要**：每次进行操作后，需要更新一次更新说明文档。更新说明文档必须包含所有修改的详细信息，包括修改的文件、修改的原因、修改的影响等。更新文档必须写入markdown格式本地文件中。
  - **代码变更日志** → 写入项目根目录 `UPDATE_LOG.md`

### 核心开发原则

#### 代码修改原则

1. **单一职责原则** - 每个服务、方法只负责一个明确的职责域，避免职责混乱
2. **最简代码原则** - 不做向后兼容，宁愿破坏性更新也要保证代码最简化，删除所有冗余代码
3. **类型严格原则** - 所有 TypeScript 类型必须正确，不使用 any，编译错误必须立即修复
4. **KISS 原则** - 保持简单直接，如果需要解释就是太复杂了
5. **文档置信度原则** - 绝不基于推测写代码，必须基于真实可验证的技术文档。特别是涉及支付、数据库、API 等关键功能时，如果文档置信度不高，必须停止并要求用户提供准确资料
6. **及时刹车原则** - 当一个方案连续打了 2 个以上补丁仍未解决时，必须停下来重新审视最初方向，优先考虑更简单的替代方案，而非继续修补

#### 任务执行标准流程

1. **修改前说明** - 每次修改任何文件前，必须告诉用户修改原因和遵循的核心原则
2. **完整阅读** - 完整阅读所有相关文件，一行都不能少，识别功能重叠和架构模式
3. **TodoWrite 管理** - 使用 TodoWrite 工具规划和跟踪任务进度，确保不遗漏任务
4. **编译优先** - 每次修改后立即检查编译，TypeScript 编译错误优先于缓存问题
5. **功能检查** - 修改后检查是否有重复功能，遵循单一职责原则

### 联网信息获取

- 联网信息获取优先使用你的原生自带的搜索工具，不行时候再用mcp相关的搜索工具，比如context7、duckduckgo。如果搜索结果不全，可以把搜到的链接使用原生自带的搜索工具进一步打开检索。

