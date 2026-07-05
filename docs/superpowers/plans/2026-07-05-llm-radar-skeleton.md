# LLM Radar Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个可运行、可构建、可部署的 `llm-radar` 项目骨架，支持 YAML 配置驱动、两模型雷达图对比、GitHub Pages 自动部署。

**Architecture:** 纯前端静态站点，Vite + React + ECharts for React；数据层由 `metrics.yaml` 与 `models/*.yaml` 组成，构建脚本校验并生成 `public/model-index.json`；前端读取索引渲染雷达图、模型元数据与来源。部署仅在 `cicd` 分支推送时触发。

**Tech Stack:** Vite, React, TypeScript, ECharts for React, js-yaml, tsx, Vitest, Playwright（可选 E2E）, GitHub Actions。

---

## File Structure

```
llm-radar/
├── .github/workflows/deploy.yml   # GitHub Actions：cicd 分支触发部署
├── public/                        # Vite 静态资源，构建脚本输出 model-index.json
├── scripts/
│   └── build-index.ts             # 校验 YAML 并生成 ModelIndex
├── src/
│   ├── components/
│   │   ├── CapabilityLegend.tsx   # 能力维度图例
│   │   ├── ModelMeta.tsx          # 模型元数据卡片
│   │   ├── ModelSelector.tsx      # 模型选择器
│   │   ├── RadarChart.tsx         # 雷达图组件
│   │   └── SourceList.tsx         # 来源列表
│   ├── data/
│   │   └── model-index-loader.ts  # 加载 /model-index.json
│   ├── hooks/
│   │   └── use-comparison.ts      # 选中模型 + 对比模式状态管理
│   ├── lib/
│   │   └── radar-option.ts        # 生成 ECharts option 的纯函数
│   ├── types.ts                   # 全局类型
│   ├── App.tsx                    # 页面布局
│   ├── index.css                  # 基础样式
│   └── main.tsx                   # React 入口
├── tests/
│   ├── fixtures/
│   │   ├── valid/
│   │   │   ├── metrics.yaml
│   │   │   └── models/
│   │   │       ├── example-alpha.yaml
│   │   │       └── example-beta.yaml
│   │   └── invalid/
│   │       ├── metrics.yaml
│   │       └── models/
│   │           └── bad-model.yaml
│   ├── build.test.ts              # 数据到部署接缝测试
│   └── radar-option.test.ts       # 雷达图 option 生成测试
├── assets/
│   └── logos/
│       └── example-corp.svg       # 示例组织 logo
├── models/
│   ├── example-alpha.yaml         # 示例模型 A
│   └── example-beta.yaml          # 示例模型 B
├── metrics.yaml                   # benchmark 定义
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── playwright.config.ts           # E2E 配置（可选）
└── README.md
```

---

## Task 1: 初始化项目并安装依赖

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: 创建 `package.json`**

```json
{
  "name": "llm-radar",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "predev": "tsx scripts/build-index.ts",
    "dev": "vite",
    "prebuild": "tsx scripts/build-index.ts",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "echarts": "^5.5.0",
    "echarts-for-react": "^3.0.2",
    "js-yaml": "^4.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "tsx": "^4.16.2",
    "typescript": "^5.5.3",
    "vite": "^5.3.3",
    "vitest": "^2.0.2"
  }
}
```

- [ ] **Step 2: 创建 `.gitignore`**

```gitignore
node_modules
dist
dist-ssr
*.local
.DS_Store
public/model-index.json
```

- [ ] **Step 3: 安装依赖**

Run: `npm install`
Expected: `node_modules/` 生成且无报错。

- [ ] **Step 4: 提交**

```bash
git add package.json .gitignore
git commit -m "chore: initialize llm-radar project"
```

---

## Task 2: Vite + React + TypeScript 入口

**Files:**
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

- [ ] **Step 1: 创建 `index.html`**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LLM Radar</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: 创建 `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/llm-radar/' : '/',
});
```

- [ ] **Step 3: 创建 `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建 `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "scripts"]
}
```

- [ ] **Step 5: 创建 `src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 6: 创建 `src/App.tsx`（骨架占位）**

```tsx
import { useEffect, useState } from 'react';
import { loadModelIndex } from './data/model-index-loader';
import { ModelIndex } from './types';

function App() {
  const [index, setIndex] = useState<ModelIndex | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModelIndex()
      .then(setIndex)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  if (error) return <div className="error">加载数据失败：{error}</div>;
  if (!index) return <div className="loading">加载中…</div>;

  return (
    <div className="app">
      <header>
        <h1>LLM Radar</h1>
        <p>基于原始论文分数的大模型能力雷达图</p>
      </header>
      <main>
        <p>已加载 {index.models.length} 个模型，{index.metrics.length} 个 benchmark。</p>
      </main>
    </div>
  );
}

export default App;
```

- [ ] **Step 7: 创建 `src/index.css`（最小样式）**

```css
:root {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  color: #213547;
  background-color: #ffffff;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.app header {
  text-align: center;
  margin-bottom: 2rem;
}

.error {
  color: #d32f2f;
  padding: 1rem;
  border: 1px solid #ef9a9a;
  border-radius: 8px;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
```

- [ ] **Step 8: 验证 dev 服务器启动**

Run: `npm run dev`
Expected: 终端显示本地地址，浏览器打开后显示 "LLM Radar" 与 "已加载 0 个模型..."（因为还没有数据）。

按 `Ctrl+C` 停止。

- [ ] **Step 9: 提交**

```bash
git add .
git commit -m "chore: setup vite react typescript scaffold"
```

---

## Task 3: 静态数据目录与示例数据

**Files:**
- Create: `metrics.yaml`
- Create: `models/example-alpha.yaml`
- Create: `models/example-beta.yaml`
- Create: `assets/logos/example-corp.svg`

- [ ] **Step 1: 创建 `metrics.yaml`**

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

  - id: gsm8k
    name: GSM8K
    description: Grade school math word problems.
    scale: percentage
    higher_is_better: true
    capability_tags: [math]

  - id: gpqa
    name: GPQA
    description: Graduate-level physics questions.
    scale: percentage
    higher_is_better: true
    capability_tags: [reasoning]
```

- [ ] **Step 2: 创建 `models/example-alpha.yaml`**

```yaml
id: example-alpha
name: Example Alpha
organization: Example Corp
release_date: "2024-01-01"
parameters: "7B"
architecture: Dense
context_window: 8192
weight_availability: open
logo: assets/logos/example-corp.svg
sources:
  - title: Example Alpha Technical Report
    url: https://example.com/alpha
    type: report
scores:
  mmlu-pro: { value: 62.5, source_index: 0 }
  humaneval: { value: 58.0, source_index: 0 }
  gsm8k: { value: 45.0, source_index: 0 }
```

- [ ] **Step 3: 创建 `models/example-beta.yaml`**

```yaml
id: example-beta
name: Example Beta
organization: Example Corp
release_date: "2024-06-01"
parameters: "70B"
architecture: Dense
context_window: 128000
weight_availability: limited
logo: assets/logos/example-corp.svg
sources:
  - title: Example Beta Technical Report
    url: https://example.com/beta
    type: report
scores:
  mmlu-pro: { value: 78.0, source_index: 0 }
  humaneval: { value: null }
  gpqa: { value: 55.0, source_index: 0 }
```

- [ ] **Step 4: 创建 `assets/logos/example-corp.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="45" fill="#3b82f6"/>
  <text x="50" y="60" text-anchor="middle" fill="white" font-size="28" font-family="sans-serif">E</text>
</svg>
```

- [ ] **Step 5: 提交**

```bash
git add metrics.yaml models/ assets/
git commit -m "data: add sample metrics and model cards"
```

---

## Task 4: 类型定义与数据加载

**Files:**
- Create: `src/types.ts`
- Create: `src/data/model-index-loader.ts`

- [ ] **Step 1: 创建 `src/types.ts`**

```ts
export type Scale = 'percentage' | 'zero_to_one' | 'raw';

export interface Metric {
  id: string;
  name: string;
  description?: string;
  scale: Scale;
  higher_is_better: boolean;
  capability_tags: string[];
  max_value?: number;
}

export interface Source {
  title: string;
  url: string;
  type: 'paper' | 'report' | 'leaderboard';
}

export interface ScoreEntry {
  value: number | null;
  source_index: number;
}

export interface ModelCard {
  id: string;
  name: string;
  organization: string;
  release_date: string;
  parameters: string;
  architecture: string;
  context_window: number;
  weight_availability: 'closed' | 'limited' | 'open';
  logo: string;
  sources: Source[];
  scores: Record<string, ScoreEntry>;
}

export interface ModelIndex {
  metrics: Metric[];
  models: ModelCard[];
  generatedAt: string;
}
```

- [ ] **Step 2: 创建 `src/data/model-index-loader.ts`**

```ts
import { ModelIndex } from '../types';

export async function loadModelIndex(): Promise<ModelIndex> {
  const response = await fetch('/model-index.json');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: 无法加载 model-index.json`);
  }
  return response.json() as Promise<ModelIndex>;
}
```

- [ ] **Step 3: 提交**

```bash
git add src/types.ts src/data/model-index-loader.ts
git commit -m "feat: add domain types and index loader"
```

---

## Task 5: 构建脚本（校验 + 生成 ModelIndex）

**Files:**
- Create: `scripts/build-index.ts`

- [ ] **Step 1: 创建 `scripts/build-index.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { Metric, ModelCard, ModelIndex, Scale } from '../src/types';

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    modelsDir: getArg(args, '--models-dir') || 'models',
    metricsFile: getArg(args, '--metrics-file') || 'metrics.yaml',
    outDir: getArg(args, '--out-dir') || 'public',
  };
}

function getArg(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[build-index] ${message}`);
}

function loadMetrics(filePath: string): Metric[] {
  assert(fs.existsSync(filePath), `metrics file not found: ${filePath}`);
  const raw = yaml.load(fs.readFileSync(filePath, 'utf-8')) as { metrics: Metric[] };
  assert(raw && Array.isArray(raw.metrics), 'metrics.yaml must contain a "metrics" array');

  const ids = new Set<string>();
  for (const m of raw.metrics) {
    assert(m.id && typeof m.id === 'string', 'metric id is required');
    assert(m.name && typeof m.name === 'string', `metric ${m.id}: name is required`);
    assert(['percentage', 'zero_to_one', 'raw'].includes(m.scale), `metric ${m.id}: scale must be percentage | zero_to_one | raw`);
    assert(!ids.has(m.id), `duplicate metric id: ${m.id}`);
    ids.add(m.id);
    if (m.scale === 'raw') {
      assert(typeof m.max_value === 'number' && m.max_value > 0, `metric ${m.id}: raw scale requires positive max_value`);
    }
    if (!m.capability_tags) m.capability_tags = [];
  }
  return raw.metrics;
}

function loadModel(filePath: string, metricIds: Set<string>): ModelCard {
  const raw = yaml.load(fs.readFileSync(filePath, 'utf-8')) as ModelCard;
  assert(raw && typeof raw === 'object', `invalid YAML: ${filePath}`);
  assert(raw.id, `${filePath}: id is required`);
  assert(raw.name, `${filePath}: name is required`);
  assert(raw.organization, `${filePath}: organization is required`);
  assert(raw.release_date, `${filePath}: release_date is required`);
  assert(raw.logo, `${filePath}: logo is required`);
  assert(Array.isArray(raw.sources) && raw.sources.length > 0, `${filePath}: sources must be a non-empty array`);

  const scores = raw.scores || {};
  for (const [key, entry] of Object.entries(scores)) {
    assert(metricIds.has(key), `${filePath}: score key "${key}" is not defined in metrics.yaml`);
    assert(entry && typeof entry === 'object', `${filePath}: score "${key}" must be an object`);
    assert(entry.value === null || typeof entry.value === 'number', `${filePath}: score "${key}".value must be number or null`);
    assert(typeof entry.source_index === 'number', `${filePath}: score "${key}".source_index must be a number`);
    assert(entry.source_index >= 0 && entry.source_index < raw.sources.length, `${filePath}: score "${key}".source_index out of range`);
  }

  // logo 存在性仅警告，避免缺少 logo 导致构建彻底失败
  const logoPath = raw.logo.startsWith('assets/') ? raw.logo : path.join('assets', raw.logo);
  if (!fs.existsSync(logoPath)) {
    console.warn(`[build-index] logo not found: ${logoPath} (model: ${raw.id})`);
  }

  return raw;
}

function loadModels(dir: string, metricIds: Set<string>): ModelCard[] {
  assert(fs.existsSync(dir), `models directory not found: ${dir}`);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));
  files.sort();
  return files.map((f) => loadModel(path.join(dir, f), metricIds));
}

function main() {
  const { modelsDir, metricsFile, outDir } = parseArgs();
  const metrics = loadMetrics(metricsFile);
  const metricIds = new Set(metrics.map((m) => m.id));
  const models = loadModels(modelsDir, metricIds);

  const index: ModelIndex = {
    metrics,
    models,
    generatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'model-index.json'), JSON.stringify(index, null, 2));
  console.log(`[build-index] generated model-index.json with ${models.length} models and ${metrics.length} metrics`);
}

main();
```

- [ ] **Step 2: 运行构建脚本（默认参数）**

Run: `npm run build:index`（或 `npx tsx scripts/build-index.ts`）
Expected: 终端输出 `generated model-index.json with 2 models and 4 metrics`，并生成 `public/model-index.json`。

- [ ] **Step 3: 验证 dev 服务器能加载数据**

Run: `npm run dev`
Expected: 浏览器显示 "已加载 2 个模型，4 个 benchmark"。

- [ ] **Step 4: 提交**

```bash
git add scripts/build-index.ts public/model-index.json
git commit -m "feat: add build-index script that validates YAML and generates ModelIndex"
```

---

## Task 6: 比较状态管理 Hook

**Files:**
- Create: `src/hooks/use-comparison.ts`

- [ ] **Step 1: 创建 `src/hooks/use-comparison.ts`**

```ts
import { useCallback, useMemo, useState } from 'react';
import { ModelCard } from '../types';

export type ComparisonMode = 'intersection' | 'union';

export interface ComparisonState {
  leftModelId: string | null;
  rightModelId: string | null;
  mode: ComparisonMode;
  setLeftModelId: (id: string | null) => void;
  setRightModelId: (id: string | null) => void;
  setMode: (mode: ComparisonMode) => void;
  leftModel: ModelCard | undefined;
  rightModel: ModelCard | undefined;
}

function readUrlState(): { left: string | null; right: string | null; mode: ComparisonMode } {
  const params = new URLSearchParams(window.location.search);
  const models = params.get('models');
  const [left, right] = models ? models.split(',').slice(0, 2) : [null, null];
  const mode = params.get('mode') as ComparisonMode;
  return {
    left: left || null,
    right: right || null,
    mode: mode === 'union' ? 'union' : 'intersection',
  };
}

function writeUrlState(left: string | null, right: string | null, mode: ComparisonMode) {
  const params = new URLSearchParams(window.location.search);
  if (left && right) {
    params.set('models', [left, right].join(','));
  } else {
    params.delete('models');
  }
  params.set('mode', mode);
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

export function useComparison(models: ModelCard[]): ComparisonState {
  const initial = useMemo(readUrlState, []);
  const [leftModelId, setLeftModelIdRaw] = useState<string | null>(initial.left);
  const [rightModelId, setRightModelIdRaw] = useState<string | null>(initial.right);
  const [mode, setModeRaw] = useState<ComparisonMode>(initial.mode);

  const setLeftModelId = useCallback((id: string | null) => {
    setLeftModelIdRaw(id);
    writeUrlState(id, rightModelId, mode);
  }, [rightModelId, mode]);

  const setRightModelId = useCallback((id: string | null) => {
    setRightModelIdRaw(id);
    writeUrlState(leftModelId, id, mode);
  }, [leftModelId, mode]);

  const setMode = useCallback((next: ComparisonMode) => {
    setModeRaw(next);
    writeUrlState(leftModelId, rightModelId, next);
  }, [leftModelId, rightModelId]);

  const modelMap = useMemo(() => {
    return new Map(models.map((m) => [m.id, m]));
  }, [models]);

  return {
    leftModelId,
    rightModelId,
    mode,
    setLeftModelId,
    setRightModelId,
    setMode,
    leftModel: leftModelId ? modelMap.get(leftModelId) : undefined,
    rightModel: rightModelId ? modelMap.get(rightModelId) : undefined,
  };
}
```

- [ ] **Step 2: 提交**

```bash
git add src/hooks/use-comparison.ts
git commit -m "feat: add comparison state hook with URL persistence"
```

---

## Task 7: 模型选择器组件

**Files:**
- Create: `src/components/ModelSelector.tsx`

- [ ] **Step 1: 创建 `src/components/ModelSelector.tsx`**

```tsx
import { ModelCard } from '../types';

interface ModelSelectorProps {
  models: ModelCard[];
  leftModelId: string | null;
  rightModelId: string | null;
  mode: 'intersection' | 'union';
  onLeftChange: (id: string | null) => void;
  onRightChange: (id: string | null) => void;
  onModeChange: (mode: 'intersection' | 'union') => void;
}

export function ModelSelector({
  models,
  leftModelId,
  rightModelId,
  mode,
  onLeftChange,
  onRightChange,
  onModeChange,
}: ModelSelectorProps) {
  return (
    <div className="model-selector">
      <div className="select-row">
        <label>
          模型 A
          <select value={leftModelId ?? ''} onChange={(e) => onLeftChange(e.target.value || null)}>
            <option value="">请选择</option>
            {models.map((m) => (
              <option key={`left-${m.id}`} value={m.id} disabled={m.id === rightModelId}>
                {m.organization} / {m.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          模型 B
          <select value={rightModelId ?? ''} onChange={(e) => onRightChange(e.target.value || null)}>
            <option value="">请选择</option>
            {models.map((m) => (
              <option key={`right-${m.id}`} value={m.id} disabled={m.id === leftModelId}>
                {m.organization} / {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mode-row">
        <span>轴模式：</span>
        <label>
          <input
            type="radio"
            value="intersection"
            checked={mode === 'intersection'}
            onChange={(e) => onModeChange(e.target.value as 'intersection' | 'union')}
          />
          交集（默认）
        </label>
        <label>
          <input
            type="radio"
            value="union"
            checked={mode === 'union'}
            onChange={(e) => onModeChange(e.target.value as 'intersection' | 'union')}
          />
          并集
        </label>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 在 `src/index.css` 中添加选择器样式**

```css
.model-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.select-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.select-row label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 240px;
  flex: 1;
}

.select-row select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.mode-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.mode-row label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}
```

- [ ] **Step 3: 提交**

```bash
git add src/components/ModelSelector.tsx src/index.css
git commit -m "feat: add model selector component"
```

---

## Task 8: 雷达图 Option 生成器（纯函数）

**Files:**
- Create: `src/lib/radar-option.ts`

- [ ] **Step 1: 创建 `src/lib/radar-option.ts`**

```ts
import { Metric, ModelCard, ScoreEntry } from '../types';

export type ComparisonMode = 'intersection' | 'union';

export interface RadarPoint {
  value: number;
  isMissing: boolean;
  originalValue: number | null;
  metricId: string;
}

export interface RadarSeries {
  name: string;
  data: (number | { value: number; itemStyle?: object; symbol?: string })[];
}

export function normalizeScore(entry: ScoreEntry | undefined, metric: Metric): number {
  if (!entry || entry.value === null) return 0;
  const v = entry.value;
  if (metric.scale === 'percentage') return v;
  if (metric.scale === 'zero_to_one') return v * 100;
  if (metric.scale === 'raw') {
    if (!metric.max_value || metric.max_value <= 0) return 0;
    return (v / metric.max_value) * 100;
  }
  return 0;
}

export function selectMetrics(
  metrics: Metric[],
  models: ModelCard[],
  mode: ComparisonMode
): Metric[] {
  if (mode === 'union') return metrics;
  const reported = new Set<string>();
  let first = true;
  for (const model of models) {
    const modelMetrics = new Set(Object.keys(model.scores));
    if (first) {
      modelMetrics.forEach((id) => reported.add(id));
      first = false;
    } else {
      for (const id of reported) {
        if (!modelMetrics.has(id)) reported.delete(id);
      }
    }
  }
  return metrics.filter((m) => reported.has(m.id));
}

export function buildRadarOption(
  metrics: Metric[],
  models: ModelCard[],
  mode: ComparisonMode
) {
  const selectedMetrics = selectMetrics(metrics, models, mode);
  const indicators = selectedMetrics.map((m) => ({ name: m.name, max: 100 }));

  const series = models.map((model) => {
    const data = selectedMetrics.map((metric) => {
      const entry = model.scores[metric.id];
      const normalized = normalizeScore(entry, metric);
      if (!entry || entry.value === null) {
        return {
          value: 0,
          itemStyle: { color: 'transparent', borderColor: '#999', borderType: 'dashed', borderWidth: 2 },
          symbol: 'emptyCircle',
          symbolSize: 8,
        };
      }
      return normalized;
    });

    return {
      value: data,
      name: model.name,
      lineStyle: { width: 2 },
      areaStyle: { opacity: 0.1 },
      symbol: 'circle',
      symbolSize: 6,
    };
  });

  return {
    tooltip: {
      trigger: 'item',
      formatter: (_params: unknown) => {
        // 复杂 formatter 在 Task 9 完善；这里先占位返回模型名
        const params = _params as { seriesName: string };
        return params.seriesName;
      },
    },
    legend: { data: models.map((m) => m.name), bottom: 0 },
    radar: {
      indicator: indicators,
      radius: '60%',
    },
    series: [
      {
        type: 'radar',
        data: series,
      },
    ],
  };
}
```

- [ ] **Step 2: 提交**

```bash
git add src/lib/radar-option.ts
git commit -m "feat: add radar option generator with intersection/union and NA handling"
```

---

## Task 9: 雷达图组件与 Tooltip

**Files:**
- Create: `src/components/RadarChart.tsx`
- Modify: `src/lib/radar-option.ts`

- [ ] **Step 1: 修改 `src/lib/radar-option.ts` 的 tooltip formatter**

将 `buildRadarOption` 中的 `tooltip.formatter` 替换为如下实现：

```ts
    tooltip: {
      trigger: 'item',
      formatter: (_params: unknown) => {
        const params = _params as {
          seriesName: string;
          data: (number | { value: number })[];
        };
        const model = models.find((m) => m.name === params.seriesName);
        if (!model) return params.seriesName;

        const rows = selectedMetrics.map((metric, idx) => {
          const entry = model.scores[metric.id];
          const raw = entry?.value ?? null;
          const display = raw === null ? '未报告' : `${raw}${metric.scale === 'zero_to_one' ? '' : '%'}`;
          return `<div>${metric.name}: ${display}</div>`;
        });

        return `<div style="font-weight:bold;margin-bottom:4px">${model.name}</div>${rows.join('')}`;
      },
    },
```

- [ ] **Step 2: 创建 `src/components/RadarChart.tsx`**

```tsx
import ReactECharts from 'echarts-for-react';
import { Metric, ModelCard } from '../types';
import { buildRadarOption, ComparisonMode } from '../lib/radar-option';

interface RadarChartProps {
  metrics: Metric[];
  models: ModelCard[];
  mode: ComparisonMode;
}

export function RadarChart({ metrics, models, mode }: RadarChartProps) {
  if (models.length === 0) {
    return <div className="chart-placeholder">请选择至少一个模型</div>;
  }

  const option = buildRadarOption(metrics, models, mode);
  return (
    <div className="radar-chart" data-testid="radar-chart">
      <ReactECharts option={option} style={{ height: 500, width: '100%' }} />
    </div>
  );
}
```

- [ ] **Step 3: 在 `src/index.css` 中添加图表样式**

```css
.radar-chart {
  background: #fafafa;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border: 2px dashed #ddd;
  border-radius: 12px;
}
```

- [ ] **Step 4: 提交**

```bash
git add src/components/RadarChart.tsx src/lib/radar-option.ts src/index.css
git commit -m "feat: add RadarChart component with ECharts and tooltip"
```

---

## Task 10: 模型元数据卡片与来源列表

**Files:**
- Create: `src/components/ModelMeta.tsx`
- Create: `src/components/SourceList.tsx`
- Create: `src/components/CapabilityLegend.tsx`

- [ ] **Step 1: 创建 `src/components/ModelMeta.tsx`**

```tsx
import { ModelCard } from '../types';

interface ModelMetaProps {
  model: ModelCard;
}

export function ModelMeta({ model }: ModelMetaProps) {
  return (
    <div className="model-meta">
      <img src={model.logo} alt={`${model.organization} logo`} className="model-logo" />
      <div className="model-info">
        <h3>{model.name}</h3>
        <dl>
          <dt>组织</dt><dd>{model.organization}</dd>
          <dt>发布日期</dt><dd>{model.release_date}</dd>
          <dt>参数量</dt><dd>{model.parameters}</dd>
          <dt>架构</dt><dd>{model.architecture}</dd>
          <dt>上下文窗口</dt><dd>{model.context_window.toLocaleString()} tokens</dd>
          <dt>权重开放</dt><dd>{model.weight_availability}</dd>
        </dl>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 `src/components/SourceList.tsx`**

```tsx
import { ModelCard } from '../types';

interface SourceListProps {
  model: ModelCard;
}

export function SourceList({ model }: SourceListProps) {
  return (
    <div className="source-list">
      <h4>数据来源</h4>
      <ol>
        {model.sources.map((s, idx) => (
          <li key={idx}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.title}
            </a>
            <span className="source-type">{s.type}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 3: 创建 `src/components/CapabilityLegend.tsx`**

```tsx
import { Metric } from '../types';

const CAPABILITY_COLORS: Record<string, string> = {
  knowledge: '#3b82f6',
  coding: '#10b981',
  math: '#f59e0b',
  reasoning: '#8b5cf6',
};

interface CapabilityLegendProps {
  metrics: Metric[];
}

export function CapabilityLegend({ metrics }: CapabilityLegendProps) {
  const capabilities = Array.from(
    new Set(metrics.flatMap((m) => m.capability_tags))
  );

  return (
    <div className="capability-legend">
      {capabilities.map((cap) => (
        <span key={cap} className="capability-badge">
          <span className="capability-dot" style={{ background: CAPABILITY_COLORS[cap] ?? '#999' }} />
          {cap}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: 在 `src/index.css` 中添加元数据与图例样式**

```css
.model-meta {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fff;
}

.model-logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.model-info h3 {
  margin: 0 0 0.5rem;
}

.model-info dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.25rem 1rem;
  margin: 0;
}

.model-info dt {
  color: #666;
}

.model-info dd {
  margin: 0;
  font-weight: 500;
}

.source-list h4 {
  margin: 0.5rem 0;
}

.source-list ol {
  padding-left: 1.25rem;
  margin: 0;
}

.source-type {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
}

.capability-legend {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.capability-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: #f3f4f6;
  font-size: 0.9rem;
}

.capability-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
```

- [ ] **Step 5: 提交**

```bash
git add src/components/ModelMeta.tsx src/components/SourceList.tsx src/components/CapabilityLegend.tsx src/index.css
git commit -m "feat: add model meta, source list, and capability legend"
```

---

## Task 11: 组装 App 页面

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 重写 `src/App.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { CapabilityLegend } from './components/CapabilityLegend';
import { ModelMeta } from './components/ModelMeta';
import { ModelSelector } from './components/ModelSelector';
import { RadarChart } from './components/RadarChart';
import { SourceList } from './components/SourceList';
import { loadModelIndex } from './data/model-index-loader';
import { useComparison } from './hooks/use-comparison';
import { ModelIndex } from './types';

function App() {
  const [index, setIndex] = useState<ModelIndex | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModelIndex()
      .then(setIndex)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const comparison = useComparison(index?.models ?? []);

  if (error) return <div className="error">加载数据失败：{error}</div>;
  if (!index) return <div className="loading">加载中…</div>;

  const selectedModels = [comparison.leftModel, comparison.rightModel].filter(Boolean);

  return (
    <div className="app">
      <header>
        <h1>LLM Radar</h1>
        <p>基于原始论文分数的大模型能力雷达图</p>
      </header>

      <main>
        <ModelSelector
          models={index.models}
          leftModelId={comparison.leftModelId}
          rightModelId={comparison.rightModelId}
          mode={comparison.mode}
          onLeftChange={comparison.setLeftModelId}
          onRightChange={comparison.setRightModelId}
          onModeChange={comparison.setMode}
        />

        <CapabilityLegend metrics={index.metrics} />

        <RadarChart
          metrics={index.metrics}
          models={selectedModels}
          mode={comparison.mode}
        />

        <section className="models-detail">
          {selectedModels.map((model) => (
            <div key={model.id} className="model-detail-card">
              <ModelMeta model={model} />
              <SourceList model={model} />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
```

- [ ] **Step 2: 在 `src/index.css` 中添加页面布局样式**

```css
.models-detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.model-detail-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

- [ ] **Step 3: 验证页面功能**

Run: `npm run dev`
Expected: 选择两个示例模型后雷达图渲染，切换交集/并集时轴变化，缺失项画到中心。

- [ ] **Step 4: 提交**

```bash
git add src/App.tsx src/index.css
git commit -m "feat: wire up App page with selector, radar, meta, and sources"
```

---

## Task 12: 接缝测试——数据到部署

**Files:**
- Create: `tests/fixtures/valid/metrics.yaml`
- Create: `tests/fixtures/valid/models/example-alpha.yaml`
- Create: `tests/fixtures/valid/models/example-beta.yaml`
- Create: `tests/fixtures/invalid/metrics.yaml`
- Create: `tests/fixtures/invalid/models/bad-model.yaml`
- Create: `tests/build.test.ts`

- [ ] **Step 1: 创建有效测试数据（完整复制 Task 3 数据）**

`tests/fixtures/valid/metrics.yaml` 与 `metrics.yaml` 内容相同。

`tests/fixtures/valid/models/example-alpha.yaml` 与 `models/example-alpha.yaml` 内容相同。

`tests/fixtures/valid/models/example-beta.yaml` 与 `models/example-beta.yaml` 内容相同。

- [ ] **Step 2: 创建无效测试数据**

`tests/fixtures/invalid/metrics.yaml`：

```yaml
metrics:
  - id: mmlu-pro
    name: MMLU-Pro
    scale: percentage
    higher_is_better: true
    capability_tags: [knowledge]
```

`tests/fixtures/invalid/models/bad-model.yaml`：

```yaml
id: bad-model
name: Bad Model
organization: Example Corp
release_date: "2024-01-01"
parameters: "7B"
architecture: Dense
context_window: 8192
weight_availability: open
logo: assets/logos/example-corp.svg
sources:
  - title: Report
    url: https://example.com
    type: report
scores:
  unknown-metric: { value: 50, source_index: 0 }
```

- [ ] **Step 3: 创建 `tests/build.test.ts`**

```ts
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('build-index data-to-deploy seam', () => {
  it('generates model-index.json from valid fixtures', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'llm-radar-valid-'));
    const projectRoot = process.cwd();

    execSync(
      `npx tsx scripts/build-index.ts --models-dir tests/fixtures/valid/models --metrics-file tests/fixtures/valid/metrics.yaml --out-dir ${tmpDir}`,
      { cwd: projectRoot, stdio: 'pipe' }
    );

    const indexPath = path.join(tmpDir, 'model-index.json');
    expect(fs.existsSync(indexPath)).toBe(true);

    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    expect(index.models).toHaveLength(2);
    expect(index.metrics).toHaveLength(4);
    expect(index.generatedAt).toBeDefined();
  });

  it('fails when a model references an undefined metric', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'llm-radar-invalid-'));
    const projectRoot = process.cwd();

    expect(() => {
      execSync(
        `npx tsx scripts/build-index.ts --models-dir tests/fixtures/invalid/models --metrics-file tests/fixtures/invalid/metrics.yaml --out-dir ${tmpDir}`,
        { cwd: projectRoot, stdio: 'pipe' }
      );
    }).toThrow();
  });
});
```

- [ ] **Step 4: 运行测试**

Run: `npm test`
Expected: 两个测试均通过。

- [ ] **Step 5: 提交**

```bash
git add tests/
git commit -m "test: add data-to-deploy seam tests"
```

---

## Task 13: 接缝测试——雷达图 Option 生成

**Files:**
- Create: `tests/radar-option.test.ts`

- [ ] **Step 1: 创建 `tests/radar-option.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { buildRadarOption, selectMetrics } from '../src/lib/radar-option';
import { Metric, ModelCard } from '../src/types';

const metrics: Metric[] = [
  { id: 'mmlu-pro', name: 'MMLU-Pro', scale: 'percentage', higher_is_better: true, capability_tags: ['knowledge'] },
  { id: 'humaneval', name: 'HumanEval', scale: 'percentage', higher_is_better: true, capability_tags: ['coding'] },
  { id: 'gsm8k', name: 'GSM8K', scale: 'percentage', higher_is_better: true, capability_tags: ['math'] },
];

const alpha: ModelCard = {
  id: 'alpha',
  name: 'Alpha',
  organization: 'Corp',
  release_date: '2024-01-01',
  parameters: '7B',
  architecture: 'Dense',
  context_window: 8192,
  weight_availability: 'open',
  logo: 'assets/logos/corp.svg',
  sources: [{ title: 'Report', url: 'https://example.com', type: 'report' }],
  scores: {
    'mmlu-pro': { value: 60, source_index: 0 },
    humaneval: { value: 50, source_index: 0 },
  },
};

const beta: ModelCard = {
  id: 'beta',
  name: 'Beta',
  organization: 'Corp',
  release_date: '2024-06-01',
  parameters: '70B',
  architecture: 'Dense',
  context_window: 128000,
  weight_availability: 'closed',
  logo: 'assets/logos/corp.svg',
  sources: [{ title: 'Report', url: 'https://example.com', type: 'report' }],
  scores: {
    'mmlu-pro': { value: 80, source_index: 0 },
    gsm8k: { value: 70, source_index: 0 },
  },
};

describe('selectMetrics', () => {
  it('returns only metrics reported by all models in intersection mode', () => {
    const selected = selectMetrics(metrics, [alpha, beta], 'intersection');
    expect(selected.map((m) => m.id)).toEqual(['mmlu-pro']);
  });

  it('returns all metrics in union mode', () => {
    const selected = selectMetrics(metrics, [alpha, beta], 'union');
    expect(selected.map((m) => m.id)).toEqual(['mmlu-pro', 'humaneval', 'gsm8k']);
  });
});

describe('buildRadarOption', () => {
  it('produces one series per model with the correct number of points', () => {
    const option = buildRadarOption(metrics, [alpha, beta], 'union');
    expect(option.radar.indicator).toHaveLength(3);
    expect(option.series[0].data).toHaveLength(3);
  });

  it('renders missing scores at the center (0)', () => {
    const option = buildRadarOption(metrics, [alpha, beta], 'union');
    const alphaData = option.series[0].data as (number | { value: number })[];
    const gsm8kPoint = alphaData[2];
    expect(typeof gsm8kPoint === 'object' && gsm8kPoint.value === 0).toBe(true);
  });
});
```

- [ ] **Step 2: 运行测试**

Run: `npm test`
Expected: 所有测试通过。

- [ ] **Step 3: 提交**

```bash
git add tests/radar-option.test.ts
git commit -m "test: add radar option seam tests"
```

---

## Task 14: GitHub Actions 部署工作流

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 创建 `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - cicd

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./llm-radar
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: ./llm-radar/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          GITHUB_PAGES: 'true'

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./llm-radar/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 验证 workflow YAML 语法**

Run: `npx yaml-lint .github/workflows/deploy.yml`（如果没有 yaml-lint，可忽略）
Expected: 无格式错误。

- [ ] **Step 3: 提交**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deploy workflow triggered by cicd branch"
```

---

## Task 15: README 与项目说明

**Files:**
- Create: `README.md`

- [ ] **Step 1: 创建 `README.md`**

```markdown
# LLM Radar

基于原始论文/官方报告分数的大模型能力雷达图。

## 本地开发

```bash
cd llm-radar
npm install
npm run dev
```

访问终端输出的本地地址即可预览。

## 添加新模型

1. 在 `models/` 下新建 `{model-id}.yaml`，参考 `models/example-alpha.yaml`。
2. 若使用了新的 benchmark，先在 `metrics.yaml` 中定义。
3. 将组织 logo 放入 `assets/logos/{organization-lowercase}.svg`。
4. 提交并推送至 `cicd` 分支，GitHub Actions 会自动构建并部署。

## 数据来源策略

- 只收录模型发布方原始论文、技术报告或官方 leaderboard 中的分数。
- 不采用第三方复测分数。
- 每个分数通过 `source_index` 追溯到具体来源。

## 部署

- 推送至 `cicd` 分支触发构建与部署。
- `main` 分支推送不会触发部署。
```

- [ ] **Step 2: 提交**

```bash
git add README.md
git commit -m "docs: add README with dev and contribution guide"
```

---

## Task 16: 端到端构建验证

**Files:**
- 无新增文件

- [ ] **Step 1: 运行生产构建**

Run: `npm run build`
Expected: `dist/` 目录生成，包含 `index.html`、静态资源以及 `model-index.json`。

- [ ] **Step 2: 预览构建产物**

Run: `npm run preview`
Expected: 浏览器访问预览地址，页面功能与 dev 模式一致。

- [ ] **Step 3: 最终提交（如产物不应入库则只验证不提交）**

`dist/` 与 `public/model-index.json` 已在 `.gitignore` 中，不需要提交。

```bash
git status
```
Expected: 工作区干净，只有已跟踪的源文件。

---

## Self-Review

### Spec Coverage

- 配置驱动：Task 3 数据文件 + Task 5 构建脚本 ✅
- 一个模型一个文件：`models/{id}.yaml` ✅
- metrics.yaml 统一定义：`metrics.yaml` ✅
- 自动 ModelIndex：Task 5 ✅
- 雷达图轴 = benchmark，Capability 分组：Task 8/9/10 ✅
- 两模型对比 + 交集/并集 + NA 处理：Task 6/8/9 ✅
- 来源追溯：Task 10 `SourceList` + `source_index` 校验 ✅
- 模型元数据：Task 10 `ModelMeta` ✅
- 归一化：Task 8 `normalizeScore` ✅
- GitHub Pages + cicd 分支触发：Task 14 ✅
- 两个测试接缝：Task 12/13 ✅

### Placeholder Scan

- 无 TBD/TODO/"fill in details"/"similar to Task N"。
- 每个代码步骤均包含完整文件内容或精确修改片段。
- 每个运行命令附带预期结果。

### Type Consistency

- `Scale`、`Metric`、`ModelCard`、`ModelIndex`、`ScoreEntry`、`Source` 全部来自 `src/types.ts`。
- `ComparisonMode` 在 `src/hooks/use-comparison.ts` 与 `src/lib/radar-option.ts` 中保持一致（`'intersection' | 'union'`）。
- `RadarChart` props 与 `buildRadarOption` 签名匹配。

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-05-llm-radar-skeleton.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach?
