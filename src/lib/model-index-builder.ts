import {
  SCORE_SCALES,
  SOURCE_TYPES,
  WEIGHT_AVAILABILITY_TAGS,
} from '../types';
import type {
  Company,
  Metric,
  ModelCard,
  ModelIndex,
  ScoreEntry,
  Source,
} from '../types';

/**
 * ModelIndex 构建 module：把 ModelCard、CompanyProfile、Metric、
 * SourcePolicy 与 BuildValidation 收口到一个 interface。
 */

export interface RawModelFile {
  filePath: string;
  data: unknown;
}

export interface BuildModelIndexInput {
  metricsFilePath: string;
  metricsData: unknown;
  companiesFilePath: string;
  companiesData: unknown;
  modelFiles: RawModelFile[];
  generatedAt: string;
  version: string;
  logoExists: (relativePath: string) => boolean;
}

export interface BuildModelIndexResult {
  index: ModelIndex;
  warnings: string[];
}

export class BuildIndexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BuildIndexError';
  }
}

type Obj = Record<string, unknown>;

function fail(message: string): never {
  throw new BuildIndexError(message);
}

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

function validateMetrics(filePath: string, rawData: unknown): Metric[] {
  const data = asObj(rawData, filePath);
  const rawMetrics = reqArr(data, filePath, 'metrics');

  const ids = new Set<string>();
  return rawMetrics.map((m, idx) => {
    const p = `${filePath}[metrics][${idx}]`;
    const obj = asObj(m, p);
    const id = reqStr(obj, p, 'id');
    if (ids.has(id)) fail(`${filePath}: 重复的 metric id "${id}"`);
    ids.add(id);

    const scale = reqEnum(obj, p, 'scale', SCORE_SCALES);
    if (scale === 'raw' && typeof obj.max_value !== 'number') {
      fail(`${p}: raw 尺度的 metric 必须设置 max_value`);
    }
    if (typeof obj.description !== 'string') fail(`${p}.description: 必填且为字符串`);
    const capability_tags = reqArr(obj, p, 'capability_tags');
    if (!capability_tags.every((x) => typeof x === 'string')) {
      fail(`${p}.capability_tags: 必须是字符串数组`);
    }
    const max_value = typeof obj.max_value === 'number' ? obj.max_value : undefined;

    return {
      id,
      name: reqStr(obj, p, 'name'),
      description: obj.description,
      scale,
      higher_is_better: reqBool(obj, p, 'higher_is_better'),
      ...(max_value !== undefined ? { max_value } : {}),
      capability_tags: capability_tags as string[],
      featured: obj.featured === true ? true : undefined,
    };
  });
}

function validateCompanies(filePath: string, rawData: unknown): Company[] {
  const data = asObj(rawData, filePath);
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
    };
  });
}

function validateModelCard(
  filePath: string,
  rawData: unknown,
  validMetricIds: Set<string>,
  validCompanyKeys: Set<string>,
  logoExists: (relativePath: string) => boolean,
  warnings: string[]
): ModelCard {
  const model = asObj(rawData, filePath);
  const p = filePath;

  const company = reqStr(model, p, 'company');
  if (!validCompanyKeys.has(company)) {
    fail(`${p}: company "${company}" 未在 companies.yaml 中定义`);
  }
  const weight_availability_tags = reqArr(model, p, 'weight_availability_tags').map(
    (t, i) => {
      if (typeof t !== 'string' || !(WEIGHT_AVAILABILITY_TAGS as readonly string[]).includes(t)) {
        fail(`${p}.weight_availability_tags[${i}]: 必须是 ${WEIGHT_AVAILABILITY_TAGS.join('/')} 之一`);
      }
      return t as ModelCard['weight_availability_tags'][number];
    }
  );

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

  const scoresObj = reqObj(model, p, 'scores');
  const scores: Record<string, ScoreEntry> = {};
  for (const [key, rawEntry] of Object.entries(scoresObj)) {
    if (!validMetricIds.has(key)) {
      fail(`${p}.scores: benchmark key "${key}" 未在 metrics.yaml 中定义`);
    }
    const eo = rawEntry === null ? ({} as Obj) : asObj(rawEntry, `${p}.scores.${key}`);
    if (eo.value !== undefined && eo.value !== null && typeof eo.value !== 'number') {
      fail(`${p}.scores.${key}: value 必须是 number 或 null`);
    }
    const value: number | null = eo.value === undefined ? null : (eo.value as number | null);
    const source = optStr(eo, `${p}.scores.${key}`, 'source');
    if (source !== undefined && !sourceKeys.has(source)) {
      fail(`${p}.scores.${key}: source "${source}" 不存在于 sources 列表`);
    }
    scores[key] = source !== undefined ? { value, source } : { value };
  }

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
  if (logo !== undefined && !logoExists(logo)) {
    warnings.push(`${p}: logo 文件不存在 ${logo}，UI 将降级为文字 fallback`);
  }

  return {
    id: reqStr(model, p, 'id'),
    name: reqStr(model, p, 'name'),
    company,
    brand_color: reqStr(model, p, 'brand_color'),
    release_date: reqStr(model, p, 'release_date'),
    weight_availability_tags,
    sources,
    scores,
    ...(parameters !== undefined && { parameters }),
    ...(optStr(model, p, 'architecture') !== undefined && { architecture: optStr(model, p, 'architecture') }),
    ...(optStr(model, p, 'context_window') !== undefined && { context_window: optStr(model, p, 'context_window') }),
    ...(modalities !== undefined && { modalities }),
    ...(logo !== undefined && { logo }),
  };
}

export function buildModelIndex(input: BuildModelIndexInput): BuildModelIndexResult {
  const warnings: string[] = [];
  const metrics = validateMetrics(input.metricsFilePath, input.metricsData);
  const companies = validateCompanies(input.companiesFilePath, input.companiesData);
  const metricIds = new Set(metrics.map((m) => m.id));
  const companyKeys = new Set(companies.map((c) => c.key));

  const models = input.modelFiles.map((file) =>
    validateModelCard(
      file.filePath,
      file.data,
      metricIds,
      companyKeys,
      input.logoExists,
      warnings
    )
  );
  models.sort((a, b) => b.release_date.localeCompare(a.release_date));

  return {
    index: {
      meta: {
        generated_at: input.generatedAt,
        version: input.version,
        model_count: models.length,
        metric_count: metrics.length,
        company_count: companies.length,
      },
      metrics,
      companies,
      models,
    },
    warnings,
  };
}
