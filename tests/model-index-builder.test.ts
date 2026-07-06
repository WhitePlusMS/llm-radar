import { describe, expect, it } from 'vitest';
import { BuildIndexError, buildModelIndex } from '@/lib/model-index-builder';

const metricsData = {
  metrics: [
    {
      id: 'mmlu-pro',
      name: 'MMLU-Pro',
      description: 'Knowledge benchmark',
      scale: 'percentage',
      higher_is_better: true,
      capability_tags: ['knowledge'],
      featured: true,
    },
  ],
};

const companiesData = {
  companies: [
    {
      key: 'openai',
      name: 'OpenAI',
      website: 'https://openai.com',
    },
  ],
};

function buildWithModel(model: unknown) {
  return buildModelIndex({
    metricsFilePath: 'metrics.yaml',
    metricsData,
    companiesFilePath: 'companies.yaml',
    companiesData,
    modelFiles: [{ filePath: 'models/openai/test.yaml', data: model }],
    generatedAt: '2026-07-06T00:00:00.000Z',
    version: '0.1.0',
    logoExists: () => true,
  });
}

describe('buildModelIndex', () => {
  it('通过一个 interface 生成 ModelIndex 并排序', () => {
    const result = buildModelIndex({
      metricsFilePath: 'metrics.yaml',
      metricsData,
      companiesFilePath: 'companies.yaml',
      companiesData,
      modelFiles: [
        {
          filePath: 'models/openai/old.yaml',
          data: {
            id: 'openai/old',
            name: 'Old',
            company: 'openai',
            brand_color: '#000000',
            release_date: '2024-01-01',
            weight_availability_tags: ['closed-weights'],
            sources: [{ key: 'paper', title: 'Paper', url: 'https://example.com', type: 'paper' }],
            scores: { 'mmlu-pro': { value: 80, source: 'paper' } },
          },
        },
        {
          filePath: 'models/openai/new.yaml',
          data: {
            id: 'openai/new',
            name: 'New',
            company: 'openai',
            brand_color: '#111111',
            release_date: '2025-01-01',
            weight_availability_tags: ['closed-weights'],
            sources: [{ key: 'paper', title: 'Paper', url: 'https://example.com', type: 'paper' }],
            scores: { 'mmlu-pro': { value: null } },
          },
        },
      ],
      generatedAt: '2026-07-06T00:00:00.000Z',
      version: '0.1.0',
      logoExists: () => true,
    });

    expect(result.warnings).toEqual([]);
    expect(result.index.meta).toMatchObject({
      generated_at: '2026-07-06T00:00:00.000Z',
      model_count: 2,
      metric_count: 1,
      company_count: 1,
    });
    expect(result.index.models.map((model) => model.id)).toEqual(['openai/new', 'openai/old']);
  });

  it('source 越界时在 BuildValidation interface 抛错', () => {
    expect(() =>
      buildWithModel({
        id: 'openai/bad',
        name: 'Bad',
        company: 'openai',
        brand_color: '#000000',
        release_date: '2024-01-01',
        weight_availability_tags: ['closed-weights'],
        sources: [{ key: 'paper', title: 'Paper', url: 'https://example.com', type: 'paper' }],
        scores: { 'mmlu-pro': { value: 80, source: 'missing' } },
      })
    ).toThrow(BuildIndexError);
  });
});
