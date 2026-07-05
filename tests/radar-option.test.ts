import { describe, it, expect } from 'vitest';
import { buildRadarOption, normalizeScore } from '@/lib/radar-option';
import type { Metric, ModelCard } from '@/types';

const metrics: Metric[] = [
  { id: 'mmlu-pro', name: 'MMLU-Pro', description: '', scale: 'percentage', higher_is_better: true, capability_tags: ['knowledge'] },
  { id: 'gpqa', name: 'GPQA', description: '', scale: 'percentage', higher_is_better: true, capability_tags: ['reasoning'] },
  { id: 'arena-elo', name: 'Arena ELO', description: '', scale: 'raw', higher_is_better: true, max_value: 1400, capability_tags: ['chat'] },
];

const modelA: ModelCard = {
  id: 'test/a',
  name: 'Model A',
  company: 'test',
  brand_color: '#ff0000',
  release_date: '2024-01-01',
  weight_availability_tags: ['closed-weights'],
  sources: [{ key: 'src', title: 'Source', url: 'https://example.com', type: 'paper' }],
  scores: {
    'mmlu-pro': { value: 80 },
    gpqa: { value: null },
    'arena-elo': { value: 1400 },
  },
};

const modelB: ModelCard = {
  id: 'test/b',
  name: 'Model B',
  company: 'test',
  brand_color: '#00ff00',
  release_date: '2024-02-01',
  weight_availability_tags: ['closed-weights'],
  sources: [{ key: 'src', title: 'Source', url: 'https://example.com', type: 'paper' }],
  scores: {
    'mmlu-pro': { value: 60 },
    gpqa: { value: 70 },
    'arena-elo': { value: null },
  },
};

describe('normalizeScore', () => {
  it('percentage 保持不变', () => {
    expect(normalizeScore(85.5, metrics[0])).toBe(85.5);
  });

  it('缺失值返回 0', () => {
    expect(normalizeScore(null, metrics[0])).toBe(0);
  });

  it('raw 值按 max_value 缩放', () => {
    expect(normalizeScore(1400, metrics[2])).toBe(100);
    expect(normalizeScore(700, metrics[2])).toBe(50);
  });
});

describe('buildRadarOption', () => {
  it('indicator 数量等于选中 metric 数量', () => {
    const option = buildRadarOption([modelA, modelB], metrics, ['mmlu-pro', 'gpqa'], false);
    expect(option.radar).toBeDefined();
    const radar = option.radar as { indicator: unknown[] };
    expect(radar.indicator.length).toBe(2);
  });

  it('系列数量等于模型数量（不含平均线）', () => {
    const option = buildRadarOption([modelA, modelB], metrics, ['mmlu-pro', 'gpqa'], false);
    const series = (option.series as Array<{ data: unknown[] }>)[0];
    expect(series.data.length).toBe(2);
  });

  it('开启平均线时系列数量多一个', () => {
    const option = buildRadarOption([modelA, modelB], metrics, ['mmlu-pro', 'gpqa'], true);
    const series = (option.series as Array<{ data: unknown[] }>)[0];
    expect(series.data.length).toBe(3);
  });

  it('缺失值对应的 radar 数据点为 0', () => {
    const option = buildRadarOption([modelA], metrics, ['mmlu-pro', 'gpqa', 'arena-elo'], false);
    const series = (option.series as Array<{ data: Array<{ value: number[] }> }>)[0];
    expect(series.data[0].value[1]).toBe(0); // gpqa null
    expect(series.data[0].value[2]).toBe(100); // arena-elo 1400/1400*100
  });
});
