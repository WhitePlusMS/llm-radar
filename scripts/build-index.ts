import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// 类型只用于开发时提示，运行时仍做宽松校验
interface Metric {
  id: string;
  name: string;
  description: string;
  scale: string;
  higher_is_better: boolean;
  max_value?: number;
  capability_tags: string[];
}

interface Company {
  key: string;
  name: string;
  website: string;
}

interface Source {
  key: string;
  title: string;
  url: string;
  type: string;
}

interface ScoreEntry {
  value: number | null;
  source?: string;
}

interface ModelCard {
  id: string;
  name: string;
  company: string;
  brand_color: string;
  release_date: string;
  parameters?: { total?: string; active?: string };
  architecture?: string;
  context_window?: string;
  modalities?: { input: string[]; output: string[] };
  weight_availability_tags: string[];
  logo?: string;
  sources: Source[];
  scores: Record<string, ScoreEntry>;
}

interface ModelIndex {
  meta: {
    generated_at: string;
    version: string;
    model_count: number;
    metric_count: number;
    company_count: number;
  };
  metrics: Metric[];
  companies: Company[];
  models: ModelCard[];
}

const VALID_SCALES = ['percentage', 'zero_to_one', 'raw'];
const VALID_SOURCE_TYPES = [
  'paper',
  'blog',
  'leaderboard',
  'report',
  'model-card',
  'model_card',
  'system-card',
  'website',
  'code',
  'codebase',
  'other',
];

function parseArgs() {
  const args = process.argv.slice(2);
  const options: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    if (args[i].startsWith('--') && i + 1 < args.length) {
      options[args[i].slice(2)] = args[i + 1];
    }
  }
  return {
    modelsDir: options['models-dir'] || 'models',
    metricsFile: options['metrics-file'] || 'metrics.yaml',
    companiesFile: options['companies-file'] || 'companies.yaml',
    outDir: options['out-dir'] || 'public',
  };
}

function fail(message: string): never {
  console.error(`[build-index] ERROR: ${message}`);
  process.exit(1);
}

function warn(message: string) {
  console.warn(`[build-index] WARN: ${message}`);
}

function loadYaml<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) fail(`文件不存在: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    return yaml.load(content) as T;
  } catch (e) {
    fail(`YAML 解析失败 ${filePath}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function validateMetrics(filePath: string): Metric[] {
  const data = loadYaml<{ metrics?: unknown[] }>(filePath);
  if (!Array.isArray(data.metrics)) fail(`${filePath}: metrics 必须是数组`);

  const ids = new Set<string>();
  data.metrics.forEach((m, idx) => {
    const metric = m as Record<string, unknown>;
    if (typeof metric.id !== 'string' || !metric.id) {
      fail(`${filePath}[${idx}]: metric.id 必填且为字符串`);
    }
    if (ids.has(metric.id)) fail(`${filePath}: 重复的 metric id "${metric.id}"`);
    ids.add(metric.id);
    if (typeof metric.name !== 'string' || !metric.name) {
      fail(`${filePath}[${idx}]: metric.name 必填`);
    }
    if (typeof metric.description !== 'string') {
      fail(`${filePath}[${idx}]: metric.description 必填`);
    }
    if (!VALID_SCALES.includes(String(metric.scale))) {
      fail(`${filePath}[${idx}]: metric.scale 必须是 ${VALID_SCALES.join('/')} 之一`);
    }
    if (typeof metric.higher_is_better !== 'boolean') {
      fail(`${filePath}[${idx}]: metric.higher_is_better 必须是布尔值`);
    }
    if (metric.scale === 'raw' && typeof metric.max_value !== 'number') {
      fail(`${filePath}[${idx}]: raw 尺度的 metric 必须设置 max_value`);
    }
    if (!Array.isArray(metric.capability_tags)) {
      fail(`${filePath}[${idx}]: metric.capability_tags 必须是数组`);
    }
  });

  return data.metrics as Metric[];
}

function validateCompanies(filePath: string): Company[] {
  const data = loadYaml<{ companies?: unknown[] }>(filePath);
  if (!Array.isArray(data.companies)) fail(`${filePath}: companies 必须是数组`);

  const keys = new Set<string>();
  data.companies.forEach((c, idx) => {
    const company = c as Record<string, unknown>;
    if (typeof company.key !== 'string' || !company.key) {
      fail(`${filePath}[${idx}]: company.key 必填`);
    }
    if (keys.has(company.key)) fail(`${filePath}: 重复的 company key "${company.key}"`);
    keys.add(company.key);
    if (typeof company.name !== 'string' || !company.name) {
      fail(`${filePath}[${idx}]: company.name 必填`);
    }
    if (typeof company.website !== 'string' || !company.website) {
      fail(`${filePath}[${idx}]: company.website 必填`);
    }
  });

  return data.companies as Company[];
}

function validateModelCard(
  filePath: string,
  model: Record<string, unknown>,
  validMetricIds: Set<string>,
  validCompanyKeys: Set<string>,
  rootDir: string
): ModelCard {
  if (typeof model.id !== 'string' || !model.id) {
    fail(`${filePath}: id 必填`);
  }
  if (typeof model.name !== 'string' || !model.name) {
    fail(`${filePath}: name 必填`);
  }
  if (typeof model.company !== 'string' || !validCompanyKeys.has(model.company)) {
    fail(`${filePath}: company "${model.company}" 未在 companies.yaml 中定义`);
  }
  if (typeof model.brand_color !== 'string' || !model.brand_color) {
    fail(`${filePath}: brand_color 必填`);
  }
  if (typeof model.release_date !== 'string' || !model.release_date) {
    fail(`${filePath}: release_date 必填`);
  }
  if (!Array.isArray(model.weight_availability_tags)) {
    fail(`${filePath}: weight_availability_tags 必须是数组`);
  }

  // sources 校验
  if (!Array.isArray(model.sources) || model.sources.length === 0) {
    fail(`${filePath}: sources 必须是非空数组`);
  }
  const sourceKeys = new Set<string>();
  (model.sources as Source[]).forEach((s, idx) => {
    if (typeof s.key !== 'string' || !s.key) fail(`${filePath}.sources[${idx}]: key 必填`);
    if (sourceKeys.has(s.key)) fail(`${filePath}.sources: 重复的 source key "${s.key}"`);
    sourceKeys.add(s.key);
    if (typeof s.title !== 'string' || !s.title) fail(`${filePath}.sources[${idx}]: title 必填`);
    if (typeof s.url !== 'string' || !s.url) fail(`${filePath}.sources[${idx}]: url 必填`);
    if (!VALID_SOURCE_TYPES.includes(String(s.type))) {
      fail(`${filePath}.sources[${idx}]: type 必须是 ${VALID_SOURCE_TYPES.join('/')} 之一`);
    }
  });

  // scores 校验
  if (typeof model.scores !== 'object' || model.scores === null) {
    fail(`${filePath}: scores 必须是对象`);
  }
  Object.entries(model.scores as Record<string, ScoreEntry | null>).forEach(([key, rawEntry]) => {
    if (!validMetricIds.has(key)) {
      fail(`${filePath}.scores: benchmark key "${key}" 未在 metrics.yaml 中定义`);
    }
    // 允许 `mmlu-pro:` 这种空值简写，视为缺失分数
    const entry: ScoreEntry = rawEntry === null ? { value: null } : rawEntry;
    if (entry && typeof entry === 'object') {
      if (entry.value !== null && typeof entry.value !== 'number') {
        fail(`${filePath}.scores.${key}: value 必须是 number 或 null`);
      }
      if (entry.source !== undefined && !sourceKeys.has(entry.source)) {
        fail(`${filePath}.scores.${key}: source "${entry.source}" 不存在于 sources 列表`);
      }
    } else {
      fail(`${filePath}.scores.${key}: 必须是对象或 null`);
    }
    // 将空值简写写回 model，保证输出 JSON 结构一致
    (model.scores as Record<string, ScoreEntry>)[key] = entry;
  });

  // logo 存在性校验：警告但不阻断
  if (typeof model.logo === 'string' && model.logo) {
    const logoPath = path.resolve(rootDir, model.logo);
    if (!fs.existsSync(logoPath)) {
      warn(`${filePath}: logo 文件不存在 ${model.logo}，UI 将降级为文字 fallback`);
    }
  }

  return model as unknown as ModelCard;
}

function scanModels(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  function walk(current: string) {
    for (const entry of fs.readdirSync(current)) {
      const full = path.join(current, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (full.endsWith('.yaml') || full.endsWith('.yml')) {
        files.push(full);
      }
    }
  }
  walk(dir);
  return files;
}

function main() {
  const rootDir = process.cwd();
  const { modelsDir, metricsFile, companiesFile, outDir } = parseArgs();

  console.log('[build-index] 开始构建模型索引...');
  console.log(`  modelsDir: ${modelsDir}`);
  console.log(`  metricsFile: ${metricsFile}`);
  console.log(`  companiesFile: ${companiesFile}`);
  console.log(`  outDir: ${outDir}`);

  const metrics = validateMetrics(path.resolve(rootDir, metricsFile));
  const companies = validateCompanies(path.resolve(rootDir, companiesFile));
  const metricIds = new Set(metrics.map((m) => m.id));
  const companyKeys = new Set(companies.map((c) => c.key));

  const modelFiles = scanModels(path.resolve(rootDir, modelsDir));
  console.log(`[build-index] 发现 ${modelFiles.length} 个模型文件`);

  const models: ModelCard[] = modelFiles.map((file) => {
    const raw = loadYaml<Record<string, unknown>>(file);
    return validateModelCard(file, raw, metricIds, companyKeys, rootDir);
  });

  // 按发布日期降序，便于前端默认展示最新模型
  models.sort((a, b) => b.release_date.localeCompare(a.release_date));

  const index: ModelIndex = {
    meta: {
      generated_at: new Date().toISOString(),
      version: '0.1.0',
      model_count: models.length,
      metric_count: metrics.length,
      company_count: companies.length,
    },
    metrics,
    companies,
    models,
  };

  const outPath = path.resolve(rootDir, outDir, 'model-index.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2), 'utf-8');

  console.log(`[build-index] 成功生成 ${outPath}`);
  console.log(`  模型数: ${models.length}`);
  console.log(`  benchmark 数: ${metrics.length}`);
  console.log(`  公司数: ${companies.length}`);
}

main();
