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
  parameters?: ParameterInfo;
}

interface ScanBuckets {
  noParameters: Map<string, string[]>;
  missingActive: Map<string, string[]>;
  totalPlaceholder: Map<string, string[]>;
  activePlaceholder: Map<string, string[]>;
}

const PLACEHOLDER_VALUES = new Set(['undisclosed', 'uncertain']);

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

function loadModelRecord(filePath: string): ModelScanRecord {
  const raw = readYaml(filePath);
  if (!isObject(raw)) {
    fail(`模型文件根节点必须是对象: ${filePath}`);
  }

  const company = getStringField(raw, 'company');
  if (!company) {
    fail(`模型文件缺少 company: ${filePath}`);
  }

  const record: ModelScanRecord = {
    company,
    fileName: path.basename(filePath),
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
  };

  for (const record of records) {
    if (!record.parameters) {
      pushGroup(buckets.noParameters, record.company, `\`${record.fileName}\``);
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
    '> 扫描方式：脚本解析全部 YAML，统计 `parameters` 缺失、`active` 缺失、以及 `undisclosed/uncertain` 参数占位。'
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
  lines.push('- `deepseek/v3.2`：优先继续核验 `active params`');
  lines.push('- `tencent/hunyuanvideo-1.5`：优先核验是否有官方 `active params`');
  lines.push('');
  lines.push('## 结论');
  lines.push('');
  lines.push('当前最需要处理的，不是继续盲目补模型数量，而是把参数信息的缺口按三类收口：');
  lines.push('');
  lines.push('1. 官方完全未公开，因此当前文件没有 `parameters`');
  lines.push('2. 已知 `total`，但仍缺 `active`');
  lines.push('3. 只能暂时保守写成 `undisclosed/uncertain`');
  lines.push('');
  lines.push('后续最有效的推进方式，是按这三类分别清理，而不是混在一起逐个碰运气。');

  return `${lines.join('\n')}\n`;
}

function main() {
  const rootDir = process.cwd();
  const { modelsDir, outFile } = parseArgs();
  const modelsPath = path.resolve(rootDir, modelsDir);
  const files = scanModelFiles(modelsPath);
  const records = files.map(loadModelRecord);
  const buckets = createBuckets(records);
  const scanDate = formatDate(new Date());
  const report = buildReport(records, buckets, scanDate);

  console.log('[scan-parameter-gaps] 扫描完成');
  console.log(`  模型总数: ${records.length}`);
  console.log(`  无 parameters: ${countItems(buckets.noParameters)}`);
  console.log(`  缺少 active: ${countItems(buckets.missingActive)}`);
  console.log(`  total 为占位值: ${countItems(buckets.totalPlaceholder)}`);
  console.log(`  active 为占位值: ${countItems(buckets.activePlaceholder)}`);

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
