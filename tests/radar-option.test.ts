import { describe, it, expect } from 'vitest';
import { buildRadarOption, projectScore, buildAveragePoints } from '@/lib/radar-option';
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

describe('projectScore', () => {
  it('percentage 保持不变且不缺失', () => {
    expect(projectScore({ value: 85.5 }, metrics[0])).toEqual({ value: 85.5, missing: false });
  });

  it('缺失值（null/undefined）标记为 missing', () => {
    expect(projectScore({ value: null }, metrics[0])).toEqual({ value: 0, missing: true });
    expect(projectScore(undefined, metrics[0])).toEqual({ value: 0, missing: true });
  });

  // 回归断言：真实 0 分不能被误判为缺失（旧 normalizeScore 实现下的 bug）
  it('真实 0 分不缺失', () => {
    expect(projectScore({ value: 0 }, metrics[0])).toEqual({ value: 0, missing: false });
    expect(projectScore({ value: 0 }, metrics[1])).toEqual({ value: 0, missing: false });
  });

  it('raw 值按 max_value 缩放', () => {
    expect(projectScore({ value: 1400 }, metrics[2])).toEqual({ value: 100, missing: false });
    expect(projectScore({ value: 700 }, metrics[2])).toEqual({ value: 50, missing: false });
  });
});

describe('buildAveragePoints', () => {
  it('缺失分数不计入均值', () => {
    // mmlu-pro: A=80, B=60 → 均值 70
    // gpqa: A=null, B=70 → 仅 B 计入 → 70
    // arena-elo: A=1400, B=null → 仅 A 计入 → 归一化 100
    const points = buildAveragePoints([modelA, modelB], metrics);
    expect(points[0]).toEqual({ value: 70, missing: false });
    expect(points[1]).toEqual({ value: 70, missing: false });
    expect(points[2]).toEqual({ value: 100, missing: false });
  });

  it('所有模型都缺失时该点 missing=true', () => {
    const points = buildAveragePoints([modelA], [
      { ...metrics[0], id: 'no-such-metric' },
    ]);
    expect(points[0]).toEqual({ value: 0, missing: true });
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

  it('缺失值对应的 radar 数据点 value 为 0，真实分数保留归一化值', () => {
    const option = buildRadarOption([modelA], metrics, ['mmlu-pro', 'gpqa', 'arena-elo'], false);
    const series = (option.series as Array<{ data: Array<{ value: number[] }> }>)[0];
    expect(series.data[0].value[0]).toBe(80); // mmlu-pro 80
    expect(series.data[0].value[1]).toBe(0); // gpqa null → 0
    expect(series.data[0].value[2]).toBe(100); // arena-elo 1400/1400*100
  });

  it('tooltip formatter 对缺失值显示 N/A，对真实 0 分显示 0.0', () => {
    const modelWithZero: ModelCard = {
      ...modelA,
      id: 'test/zero',
      name: 'Zero Model',
      scores: {
        'mmlu-pro': { value: 0 }, // 真实 0 分
        gpqa: { value: null }, // 缺失
        'arena-elo': { value: 1400 },
      },
    };
    const option = buildRadarOption(
      [modelWithZero],
      metrics,
      ['mmlu-pro', 'gpqa'],
      false
    );
    const tooltip = (option.tooltip as { formatter: (p: unknown) => string }).formatter;
    const html = tooltip({ seriesName: 'Zero Model' });

    // 真实 0 分 → "0.0"，缺失 → "N/A"
    expect(html).toContain('>0.0<');
    expect(html).toContain('>N/A<');
    expect(html).toContain('MMLU-Pro');
    expect(html).toContain('GPQA');
  });
});
