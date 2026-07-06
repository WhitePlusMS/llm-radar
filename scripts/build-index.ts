import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {
  BuildIndexError,
  buildModelIndex,
  type RawModelFile,
} from '../src/lib/model-index-builder';

/**
 * 构建脚本 adapter：读取 YAML、扫描文件、写出 public/model-index.json。
 * BuildValidation 规则只存在于 model-index-builder module。
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
  try {
    const rootDir = process.cwd();
    const { modelsDir, metricsFile, companiesFile, outDir } = parseArgs();
    const metricsPath = path.resolve(rootDir, metricsFile);
    const companiesPath = path.resolve(rootDir, companiesFile);

    console.log('[build-index] 开始构建模型索引...');
    console.log(`  modelsDir: ${modelsDir}`);
    console.log(`  metricsFile: ${metricsFile}`);
    console.log(`  companiesFile: ${companiesFile}`);
    console.log(`  outDir: ${outDir}`);

    const modelPaths = scanModels(path.resolve(rootDir, modelsDir));
    console.log(`[build-index] 发现 ${modelPaths.length} 个模型文件`);

    const modelFiles: RawModelFile[] = modelPaths.map((filePath) => ({
      filePath,
      data: loadYaml<unknown>(filePath),
    }));

    const { index, warnings } = buildModelIndex({
      metricsFilePath: metricsPath,
      metricsData: loadYaml<unknown>(metricsPath),
      companiesFilePath: companiesPath,
      companiesData: loadYaml<unknown>(companiesPath),
      modelFiles,
      generatedAt: new Date().toISOString(),
      version: '0.1.0',
      logoExists: (relativePath) => fs.existsSync(path.resolve(rootDir, relativePath)),
    });
    warnings.forEach(warn);

    const outPath = path.resolve(rootDir, outDir, 'model-index.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(index, null, 2), 'utf-8');

    console.log(`[build-index] 成功生成 ${outPath}`);
    console.log(`  模型数: ${index.models.length}`);
    console.log(`  benchmark 数: ${index.metrics.length}`);
    console.log(`  公司数: ${index.companies.length}`);
  } catch (e) {
    if (e instanceof BuildIndexError) {
      fail(e.message);
    }
    throw e;
  }
}

main();
