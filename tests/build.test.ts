import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

describe('Data-to-Deploy seam', () => {
  it('构建脚本成功退出并生成 model-index.json', () => {
    const result = execSync('npx tsx scripts/build-index.ts', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    expect(result).toContain('成功生成');

    const indexPath = path.resolve(process.cwd(), 'public', 'model-index.json');
    expect(fs.existsSync(indexPath)).toBe(true);

    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    expect(index.models.length).toBeGreaterThanOrEqual(15);
    expect(index.metrics.length).toBeGreaterThan(0);
    expect(index.companies.length).toBeGreaterThan(0);
  });

  it('所有模型 YAML 可通过 js-yaml 解析', () => {
    const modelsDir = path.resolve(process.cwd(), 'models');
    function walk(dir: string): string[] {
      const files: string[] = [];
      for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          walk(full).forEach((f) => files.push(f));
        } else if (full.endsWith('.yaml') || full.endsWith('.yml')) {
          files.push(full);
        }
      }
      return files;
    }
    const files = walk(modelsDir);
    expect(files.length).toBeGreaterThanOrEqual(15);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = yaml.load(content);
      expect(parsed).toBeTruthy();
      expect(typeof parsed).toBe('object');
    }
  });

  it('metrics.yaml 与 companies.yaml 结构合法', () => {
    const metrics = yaml.load(fs.readFileSync(path.resolve(process.cwd(), 'metrics.yaml'), 'utf-8')) as {
      metrics: unknown[];
    };
    expect(Array.isArray(metrics.metrics)).toBe(true);

    const companies = yaml.load(fs.readFileSync(path.resolve(process.cwd(), 'companies.yaml'), 'utf-8')) as {
      companies: unknown[];
    };
    expect(Array.isArray(companies.companies)).toBe(true);
  });
});
