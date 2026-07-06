import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {
  SCORE_SCALES,
  SOURCE_TYPES,
  WEIGHT_AVAILABILITY_TAGS,
} from '../src/types';
import type {
  Metric,
  Company,
  Source,
  ScoreEntry,
  ModelCard,
  ModelIndex,
} from '../src/types';

/**
 * 构建脚本：读取 models/*.yaml + metrics.yaml + companies.yaml，
 * 用一套小型字段校验工具集（reqStr/reqBool/reqEnum/reqArr/reqObj）做表驱动式校验，
 * 输出 public/model-index.json 供前端运行时加载。
 *
 * 设计原则：
 * - 类型单一来源：Metric/Company/Source/ScoreEntry/ModelCard/ModelIndex 一律从 src/types.ts 引入，
 *   字面量联合（ScoreScale/SourceType/WeightAvailabilityTag）由同源 const 数组派生，
 *   本脚本不再重定义宽松副本，避免加枚举值时"缝在漏"。
 * - 不做向后兼容：曾存在的 `model_card`（下划线）来源类型别名已删除，YAML 统一用 `model-card`。
 */

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

// ---------------------------------------------------------------------------
// 字段校验工具集：把重复的 `if (typeof x !== ...) fail(...)` 收敛为深模块。
// 删除测试：移除这些 helper 后，每条字段校验都要在调用点重新展开 if + fail 路径，
// 复杂度会散落到所有 validate 函数——集中而非搬家，故为真模块。
// ---------------------------------------------------------------------------

type Obj = Record<string, unknown>;

function asObj(value: unknown, p: string): Obj {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(`${p}: 必须是对象`);
  }
  return value as Obj;
}

function reqStr(obj: Obj, p: string, field: string): string {
  const v = obj[field];
  if (typeof v !== 'string' || !v) fail(`${p}.${field}: 必填且为非空字符串`);
  return v;
}

function reqBool(obj: Obj, p: string, field: string): boolean {
  const v = obj[field];
  if (typeof v !== 'boolean') fail(`${p}.${field}: 必须是布尔值`);
  return v;
}

function reqArr(obj: Obj, p: string, field: string): unknown[] {
  const v = obj[field];
  if (!Array.isArray(v)) fail(`${p}.${field}: 必须是数组`);
  return v;
}

function reqObj(obj: Obj, p: string, field: string): Obj {
  const v = obj[field];
  if (typeof v !== 'object' || v === null || Array.isArray(v)) {
    fail(`${p}.${field}: 必须是对象`);
  }
  return v as Obj;
}

function optStr(obj: Obj, p: string, field: string): string | undefined {
  const v = obj[field];
  if (v === undefined) return undefined;
  if (typeof v !== 'string' || !v) fail(`${p}.${field}: 必须是非空字符串`);
  return v;
}

function reqEnum<T extends string>(
  obj: Obj,
  p: string,
  field: string,
  values: readonly T[]
): T {
  const v = obj[field];
  if (typeof v !== 'string' || !values.includes(v as T)) {
    fail(`${p}.${field}: 必须是 ${values.join('/')} 之一`);
  }
  return v as T;
}

// ---------------------------------------------------------------------------
// 结构校验
// ---------------------------------------------------------------------------

function validateMetrics(filePath: string): Metric[] {
  const data = asObj(loadYaml<unknown>(filePath), filePath);
  const rawMetrics = reqArr(data, filePath, 'metrics');

  const ids = new Set<string>();
  return rawMetrics.map((m, idx) => {
    const p = `${filePath}[metrics][${idx}]`;
    const obj = asObj(m, p);

    const id = reqStr(obj, p, 'id');
    if (ids.has(id)) fail(`${filePath}: 重复的 metric id "${id}"`);
    ids.add(id);

    const name = reqStr(obj, p, 'name');
    if (typeof obj.description !== 'string') fail(`${p}.description: 必填且为字符串`);
    const scale = reqEnum(obj, p, 'scale', SCORE_SCALES);
    const higher_is_better = reqBool(obj, p, 'higher_is_better');
    if (scale === 'raw' && typeof obj.max_value !== 'number') {
      fail(`${p}: raw 尺度的 metric 必须设置 max_value`);
    }
    const max_value = typeof obj.max_value === 'number' ? obj.max_value : undefined;
    const capability_tags = reqArr(obj, p, 'capability_tags');
    const featured = obj.featured === true ? true : undefined;

    return {
      id,
      name,
      description: obj.description,
      scale,
      higher_is_better,
      ...(max_value !== undefined ? { max_value } : {}),
      capability_tags,
      featured,
    } as Metric;
  });
}

function validateCompanies(filePath: string): Company[] {
  const data = asObj(loadYaml<unknown>(filePath), filePath);
  const rawCompanies = reqArr(data, filePath, 'companies');

  const keys = new Set<string>();
  return rawCompanies.map((c, idx) => {
    const p = `${filePath}[companies][${idx}]`;
    const obj = asObj(c, p);

    const key = reqStr(obj, p, 'key');
    if (keys.has(key)) fail(`${filePath}: 重复的 company key "${key}"`);
    keys.add(key);

    return {
      key,
      name: reqStr(obj, p, 'name'),
      website: reqStr(obj, p, 'website'),
    } as Company;
  });
}

function validateModelCard(
  filePath: string,
  model: Obj,
  validMetricIds: Set<string>,
  validCompanyKeys: Set<string>,
  rootDir: string
): ModelCard {
  const p = filePath;

  const id = reqStr(model, p, 'id');
  const name = reqStr(model, p, 'name');
  const company = reqStr(model, p, 'company');
  if (!validCompanyKeys.has(company)) {
    fail(`${p}: company "${company}" 未在 companies.yaml 中定义`);
  }
  const brand_color = reqStr(model, p, 'brand_color');
  const release_date = reqStr(model, p, 'release_date');
  const weight_availability_tags = reqArr(model, p, 'weight_availability_tags').map(
    (t, i) => {
      if (typeof t !== 'string' || !(WEIGHT_AVAILABILITY_TAGS as readonly string[]).includes(t)) {
        fail(`${p}.weight_availability_tags[${i}]: 必须是 ${WEIGHT_AVAILABILITY_TAGS.join('/')} 之一`);
      }
      return t as ModelCard['weight_availability_tags'][number];
    }
  );

  // sources 校验：非空数组、key 唯一、type 枚举合法
  const rawSources = reqArr(model, p, 'sources');
  if (rawSources.length === 0) fail(`${p}: sources 必须是非空数组`);
  const sourceKeys = new Set<string>();
  const sources: Source[] = rawSources.map((s, idx) => {
    const sp = `${p}.sources[${idx}]`;
    const obj = asObj(s, sp);
    const key = reqStr(obj, sp, 'key');
    if (sourceKeys.has(key)) fail(`${p}.sources: 重复的 source key "${key}"`);
    sourceKeys.add(key);
    return {
      key,
      title: reqStr(obj, sp, 'title'),
      url: reqStr(obj, sp, 'url'),
      type: reqEnum(obj, sp, 'type', SOURCE_TYPES),
    };
  });

  // scores 校验：key 必须是已定义 metric；value 为 number|null；source 必须存在于 sources
  const scoresObj = reqObj(model, p, 'scores');
  const scores: Record<string, ScoreEntry> = {};
  for (const [key, rawEntry] of Object.entries(scoresObj)) {
    if (!validMetricIds.has(key)) {
      fail(`${p}.scores: benchmark key "${key}" 未在 metrics.yaml 中定义`);
    }
    // 允许 `mmlu-pro:` 空值简写，视为缺失分数
    const eo = rawEntry === null ? ({} as Obj) : asObj(rawEntry, `${p}.scores.${key}`);
    if (eo.value !== undefined && eo.value !== null && typeof eo.value !== 'number') {
      fail(`${p}.scores.${key}: value 必须是 number 或 null`);
    }
    const value: number | null =
      eo.value === undefined ? null : (eo.value as number | null);
    const source = optStr(eo, `${p}.scores.${key}`, 'source');
    if (source !== undefined && !sourceKeys.has(source)) {
      fail(`${p}.scores.${key}: source "${source}" 不存在于 sources 列表`);
    }
    scores[key] = source !== undefined ? { value, source } : { value };
  }

  // 可选字段
  let parameters: ModelCard['parameters'] | undefined = undefined;
  if (model.parameters !== undefined) {
    const po = asObj(model.parameters, `${p}.parameters`);
    const total = optStr(po, `${p}.parameters`, 'total');
    const active = optStr(po, `${p}.parameters`, 'active');
    if (total !== undefined || active !== undefined) {
      parameters = {
        ...(total !== undefined && { total }),
        ...(active !== undefined && { active }),
      };
    }
  }
  const architecture = optStr(model, p, 'architecture');
  const context_window = optStr(model, p, 'context_window');
  let modalities: ModelCard['modalities'] | undefined = undefined;
  if (model.modalities !== undefined) {
    const mo = asObj(model.modalities, `${p}.modalities`);
    const input = reqArr(mo, `${p}.modalities`, 'input');
    const output = reqArr(mo, `${p}.modalities`, 'output');
    if (!input.every((x) => typeof x === 'string') || !output.every((x) => typeof x === 'string')) {
      fail(`${p}.modalities: input/output 必须是字符串数组`);
    }
    modalities = { input: input as string[], output: output as string[] };
  }
  const logo = optStr(model, p, 'logo');

  // logo 存在性校验：警告但不阻断
  if (logo !== undefined) {
    const logoPath = path.resolve(rootDir, logo);
    if (!fs.existsSync(logoPath)) {
      warn(`${p}: logo 文件不存在 ${logo}，UI 将降级为文字 fallback`);
    }
  }

  const card: ModelCard = {
    id,
    name,
    company,
    brand_color,
    release_date,
    weight_availability_tags,
    sources,
    scores,
    ...(parameters !== undefined && { parameters }),
    ...(architecture !== undefined && { architecture }),
    ...(context_window !== undefined && { context_window }),
    ...(modalities !== undefined && { modalities }),
    ...(logo !== undefined && { logo }),
  };
  return card;
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
    const raw = loadYaml<unknown>(file);
    return validateModelCard(file, asObj(raw, file), metricIds, companyKeys, rootDir);
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
