import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

type ParameterValue = string | undefined;

interface ParameterInfo {
  total?: string;
  active?: string;
}

interface ModelScanRecord {
  company: string;
  fileName: string;
  name: string;
  parameters?: ParameterInfo;
  scoreStats: ScoreStats;
}

interface ScanBuckets {
  noParameters: Map<string, string[]>;
  missingActive: Map<string, string[]>;
  totalPlaceholder: Map<string, string[]>;
  activePlaceholder: Map<string, string[]>;
  emptyScores: Map<string, string[]>;
  noNumericScores: Map<string, string[]>;
  noFeaturedScores: Map<string, string[]>;
  noParametersAndNoNumericScores: Map<string, string[]>;
  smallModelNoNumericScores: Map<string, string[]>;
}

const PLACEHOLDER_VALUES = new Set(['undisclosed', 'uncertain']);
const SMALL_MODEL_SIZE_THRESHOLD_B = 40;

interface ScoreStats {
  totalEntries: number;
  numericEntries: number;
  featuredNumericEntries: number;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    if (args[i]?.startsWith('--') && args[i + 1]) {
      options[args[i].slice(2)] = args[i + 1];
    }
  }

  return {
    modelsDir: options['models-dir'] || 'models',
    metricsFile: options['metrics-file'] || 'metrics.yaml',
    outFile: options['out-file'],
  };
}

function fail(message: string): never {
  console.error(`[scan-parameter-gaps] ERROR: ${message}`);
  process.exit(1);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readYaml(filePath: string): unknown {
  try {
    return yaml.load(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    fail(
      `YAML 解析失败 ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

function loadFeaturedMetricIds(metricsFilePath: string): Set<string> {
  const raw = readYaml(metricsFilePath);
  if (!isObject(raw)) {
    fail(`metrics 文件根节点必须是对象: ${metricsFilePath}`);
  }

  const metrics = raw['metrics'];
  if (!Array.isArray(metrics)) {
    fail(`metrics 文件缺少 metrics 数组: ${metricsFilePath}`);
  }

  const featuredMetricIds = new Set<string>();
  for (const metric of metrics) {
    if (!isObject(metric)) {
      fail(`metrics 数组元素必须是对象: ${metricsFilePath}`);
    }

    const id = getStringField(metric, 'id');
    if (!id) {
      fail(`metrics 项缺少 id: ${metricsFilePath}`);
    }

    if (metric['featured'] === true) {
      featuredMetricIds.add(id);
    }
  }

  return featuredMetricIds;
}

function scanModelFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    fail(`模型目录不存在: ${dir}`);
  }

  const files: string[] = [];

  function walk(current: string) {
    for (const entry of fs.readdirSync(current)) {
      const fullPath = path.join(current, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (fullPath.endsWith('.yaml') || fullPath.endsWith('.yml')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files.sort((a, b) => a.localeCompare(b));
}

function getStringField(obj: Record<string, unknown>, key: string): ParameterValue {
  const value = obj[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function normalizePlaceholder(value: ParameterValue): boolean {
  return value !== undefined && PLACEHOLDER_VALUES.has(value.toLowerCase());
}

function readScoreStats(
  rawScores: unknown,
  featuredMetricIds: Set<string>,
  filePath: string
): ScoreStats {
  if (!isObject(rawScores)) {
    fail(`模型文件 scores 必须是对象: ${filePath}`);
  }

  let numericEntries = 0;
  let featuredNumericEntries = 0;
  const entries = Object.entries(rawScores);

  for (const [metricId, rawEntry] of entries) {
    if (!isObject(rawEntry)) {
      continue;
    }

    const value = rawEntry['value'];
    if (typeof value === 'number') {
      numericEntries += 1;
      if (featuredMetricIds.has(metricId)) {
        featuredNumericEntries += 1;
      }
    }
  }

  return {
    totalEntries: entries.length,
    numericEntries,
    featuredNumericEntries,
  };
}

function extractFirstBillionCount(value: string): number | undefined {
  const normalized = value.replace(/,/g, '').trim();
  const matched = normalized.match(/^(\d+(?:\.\d+)?)B$/i);
  if (!matched) {
    return undefined;
  }

  const count = Number(matched[1]);
  return Number.isFinite(count) ? count : undefined;
}

function looksLikeSmallModel(record: ModelScanRecord): boolean {
  const total = record.parameters?.total;
  if (total) {
    const totalB = extractFirstBillionCount(total);
    if (totalB !== undefined) {
      return totalB <= SMALL_MODEL_SIZE_THRESHOLD_B;
    }
  }

  const matched = `${record.name} ${record.fileName}`.match(/(?:^|[\s-])(\d+(?:\.\d+)?)b(?:$|[\s-.])/i);
  if (!matched) {
    return false;
  }

  const count = Number(matched[1]);
  return Number.isFinite(count) && count <= SMALL_MODEL_SIZE_THRESHOLD_B;
}

function loadModelRecord(filePath: string, featuredMetricIds: Set<string>): ModelScanRecord {
  const raw = readYaml(filePath);
  if (!isObject(raw)) {
    fail(`模型文件根节点必须是对象: ${filePath}`);
  }

  const company = getStringField(raw, 'company');
  if (!company) {
    fail(`模型文件缺少 company: ${filePath}`);
  }

  const name = getStringField(raw, 'name');
  if (!name) {
    fail(`模型文件缺少 name: ${filePath}`);
  }

  const rawScores = raw['scores'];

  const record: ModelScanRecord = {
    company,
    fileName: path.basename(filePath),
    name,
    scoreStats: readScoreStats(rawScores, featuredMetricIds, filePath),
  };

  const rawParameters = raw['parameters'];
  if (!isObject(rawParameters)) {
    return record;
  }

  const total = getStringField(rawParameters, 'total');
  const active = getStringField(rawParameters, 'active');

  if (total === undefined && active === undefined) {
    return record;
  }

  record.parameters = {
    ...(total !== undefined ? { total } : {}),
    ...(active !== undefined ? { active } : {}),
  };
  return record;
}

function pushGroup(group: Map<string, string[]>, company: string, item: string) {
  const current = group.get(company) || [];
  current.push(item);
  current.sort((a, b) => a.localeCompare(b));
  group.set(company, current);
}

function createBuckets(records: ModelScanRecord[]): ScanBuckets {
  const buckets: ScanBuckets = {
    noParameters: new Map(),
    missingActive: new Map(),
    totalPlaceholder: new Map(),
    activePlaceholder: new Map(),
    emptyScores: new Map(),
    noNumericScores: new Map(),
    noFeaturedScores: new Map(),
    noParametersAndNoNumericScores: new Map(),
    smallModelNoNumericScores: new Map(),
  };

  for (const record of records) {
    if (record.scoreStats.totalEntries === 0) {
      pushGroup(buckets.emptyScores, record.company, `\`${record.fileName}\``);
    }

    if (record.scoreStats.numericEntries === 0) {
      pushGroup(buckets.noNumericScores, record.company, `\`${record.fileName}\``);
    }

    if (record.scoreStats.featuredNumericEntries === 0) {
      pushGroup(buckets.noFeaturedScores, record.company, `\`${record.fileName}\``);
    }

    if (!record.parameters) {
      pushGroup(buckets.noParameters, record.company, `\`${record.fileName}\``);
      if (record.scoreStats.numericEntries === 0) {
        pushGroup(
          buckets.noParametersAndNoNumericScores,
          record.company,
          `\`${record.fileName}\``
        );
      }
      if (record.scoreStats.numericEntries === 0 && looksLikeSmallModel(record)) {
        pushGroup(
          buckets.smallModelNoNumericScores,
          record.company,
          `\`${record.fileName}\``
        );
      }
      continue;
    }

    if (record.parameters.total && !record.parameters.active) {
      pushGroup(
        buckets.missingActive,
        record.company,
        `\`${record.fileName}\` (\`total: ${record.parameters.total}\` 已有，\`active\` 缺失)`
      );
    }

    if (normalizePlaceholder(record.parameters.total)) {
      pushGroup(
        buckets.totalPlaceholder,
        record.company,
        `\`${record.fileName}\` -> \`total: ${record.parameters.total}\``
      );
    }

    if (normalizePlaceholder(record.parameters.active)) {
      pushGroup(
        buckets.activePlaceholder,
        record.company,
        `\`${record.fileName}\` -> \`active: ${record.parameters.active}\``
      );
    }

    if (record.scoreStats.numericEntries === 0 && looksLikeSmallModel(record)) {
      pushGroup(
        buckets.smallModelNoNumericScores,
        record.company,
        `\`${record.fileName}\`${record.parameters.total ? ` (\`total: ${record.parameters.total}\`)` : ''}`
      );
    }
  }

  return buckets;
}

function countItems(group: Map<string, string[]>): number {
  return [...group.values()].reduce((sum, items) => sum + items.length, 0);
}

function formatDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    fail('无法格式化扫描日期');
  }

  return `${year}-${month}-${day}`;
}

function appendGroupLines(lines: string[], title: string, group: Map<string, string[]>) {
  lines.push(title);
  lines.push('');

  if (group.size === 0) {
    lines.push('- 无');
    lines.push('');
    return;
  }

  for (const company of [...group.keys()].sort((a, b) => a.localeCompare(b))) {
    const items = group.get(company) || [];
    lines.push(`#### ${company} (${items.length})`);
    for (const item of items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }
}

function buildReport(records: ModelScanRecord[], buckets: ScanBuckets, scanDate: string): string {
  const lines: string[] = [];

  lines.push(`# 模型参数缺口扫描（${scanDate}）`);
  lines.push('');
  lines.push(`> 扫描范围：\`models/**/*.yaml\``);
  lines.push(`> 扫描时间：${scanDate}`);
  lines.push(`> 扫描脚本：\`scripts/scan-parameter-gaps.ts\``);
  lines.push(
    '> 扫描方式：脚本解析全部 YAML，统计 `parameters` 缺失、`active` 缺失、`undisclosed/uncertain` 参数占位，以及 `scores` / 数值 benchmark 缺口。'
  );
  lines.push('');
  lines.push('## 总体结果');
  lines.push('');
  lines.push(`- 模型总数：\`${records.length}\``);
  lines.push(`- 完全没有 \`parameters\` 信息：\`${countItems(buckets.noParameters)}\``);
  lines.push(`- 缺少 \`parameters.active\`：\`${countItems(buckets.missingActive)}\``);
  lines.push(
    `- \`parameters.total\` 为 \`undisclosed/uncertain\`：\`${countItems(
      buckets.totalPlaceholder
    )}\``
  );
  lines.push(
    `- \`parameters.active\` 为 \`undisclosed/uncertain\`：\`${countItems(
      buckets.activePlaceholder
    )}\``
  );
  lines.push(`- \`scores\` 完全为空：\`${countItems(buckets.emptyScores)}\``);
  lines.push(`- 完全没有任何数值 benchmark：\`${countItems(buckets.noNumericScores)}\``);
  lines.push(
    `- 一个 featured benchmark 数值都没有：\`${countItems(buckets.noFeaturedScores)}\``
  );
  lines.push(
    `- 同时缺少 \`parameters\` 且没有任何数值 benchmark：\`${countItems(
      buckets.noParametersAndNoNumericScores
    )}\``
  );
  lines.push(
    `- 中小模型且没有任何数值 benchmark（人工复核候选）：\`${countItems(
      buckets.smallModelNoNumericScores
    )}\``
  );
  lines.push('');
  lines.push('## 按公司分组');
  lines.push('');

  appendGroupLines(lines, '### 1. 完全没有 `parameters` 信息', buckets.noParameters);
  appendGroupLines(lines, '### 2. 缺少 `parameters.active`', buckets.missingActive);
  appendGroupLines(
    lines,
    '### 3. `parameters.total` 为 `undisclosed/uncertain`',
    buckets.totalPlaceholder
  );
  appendGroupLines(
    lines,
    '### 4. `parameters.active` 为 `undisclosed/uncertain`',
    buckets.activePlaceholder
  );
  appendGroupLines(lines, '### 5. `scores` 完全为空', buckets.emptyScores);
  appendGroupLines(lines, '### 6. 完全没有任何数值 benchmark', buckets.noNumericScores);
  appendGroupLines(
    lines,
    '### 7. 一个 featured benchmark 数值都没有',
    buckets.noFeaturedScores
  );
  appendGroupLines(
    lines,
    '### 8. 同时缺少 `parameters` 且没有任何数值 benchmark',
    buckets.noParametersAndNoNumericScores
  );
  appendGroupLines(
    lines,
    '### 9. 中小模型且没有任何数值 benchmark（人工复核候选）',
    buckets.smallModelNoNumericScores
  );

  lines.push('## 优先处理建议');
  lines.push('');
  lines.push('### 第一优先级：主线闭源厂商');
  lines.push('');
  lines.push('这些公司大量模型没有 `parameters`，处理策略应以补官方证据和统一表述为主，而不是猜参数：');
  lines.push('');
  lines.push('- `anthropic`');
  lines.push('- `openai`');
  lines.push('- `google`');
  lines.push('- `xai`');
  lines.push('');
  lines.push('### 第二优先级：中文厂商旗舰');
  lines.push('');
  lines.push('这些模型更有机会从官方论文、技术报告或平台文档中补到更完整参数：');
  lines.push('');
  lines.push('- `baidu`');
  lines.push('- `tencent`');
  lines.push('- `bytedance`');
  lines.push('- `zhipu`');
  lines.push('- `baichuan`');
  lines.push('');
  lines.push('### 第三优先级：已部分完成但仍有缺口');
  lines.push('');
  lines.push('- 先人工复核“中小模型且没有任何数值 benchmark”这一组，决定哪些该删、哪些只是 benchmark 不匹配当前 metrics 集。');
  lines.push('- `deepseek/v3.2`：优先继续核验 `active params`');
  lines.push('- `tencent/hunyuanvideo-1.5`：优先核验是否有官方 `active params`');
  lines.push('');
  lines.push('## 结论');
  lines.push('');
  lines.push('当前最需要处理的，不是继续盲目补模型数量，而是把模型缺口按四类收口：');
  lines.push('');
  lines.push('1. 官方完全未公开，因此当前文件没有 `parameters`');
  lines.push('2. 已知 `total`，但仍缺 `active`');
  lines.push('3. 只能暂时保守写成 `undisclosed/uncertain`');
  lines.push('4. 模型存在，但完全没有可落到当前项目的数值 benchmark');
  lines.push('');
  lines.push('其中第 4 类尤其适合配合“官方主线 / 非主线”和“旗舰 / 中小模型”一起判断，避免把该留的多模态主线误删，也避免把信息过薄的小模型继续堆在库里。');

  return `${lines.join('\n')}\n`;
}

function main() {
  const rootDir = process.cwd();
  const { modelsDir, metricsFile, outFile } = parseArgs();
  const modelsPath = path.resolve(rootDir, modelsDir);
  const metricsPath = path.resolve(rootDir, metricsFile);
  const files = scanModelFiles(modelsPath);
  const featuredMetricIds = loadFeaturedMetricIds(metricsPath);
  const records = files.map((filePath) => loadModelRecord(filePath, featuredMetricIds));
  const buckets = createBuckets(records);
  const scanDate = formatDate(new Date());
  const report = buildReport(records, buckets, scanDate);

  console.log('[scan-parameter-gaps] 扫描完成');
  console.log(`  模型总数: ${records.length}`);
  console.log(`  无 parameters: ${countItems(buckets.noParameters)}`);
  console.log(`  缺少 active: ${countItems(buckets.missingActive)}`);
  console.log(`  total 为占位值: ${countItems(buckets.totalPlaceholder)}`);
  console.log(`  active 为占位值: ${countItems(buckets.activePlaceholder)}`);
  console.log(`  空 scores: ${countItems(buckets.emptyScores)}`);
  console.log(`  无数值 benchmark: ${countItems(buckets.noNumericScores)}`);
  console.log(`  无 featured benchmark: ${countItems(buckets.noFeaturedScores)}`);
  console.log(
    `  无 parameters 且无数值 benchmark: ${countItems(buckets.noParametersAndNoNumericScores)}`
  );
  console.log(
    `  中小模型且无数值 benchmark: ${countItems(buckets.smallModelNoNumericScores)}`
  );

  if (outFile) {
    const outPath = path.resolve(rootDir, outFile);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, report, 'utf-8');
    console.log(`  已写出报告: ${outPath}`);
  } else {
    console.log('');
    process.stdout.write(report);
  }
}

main();
