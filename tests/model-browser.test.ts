import { describe, expect, it } from 'vitest';
import { buildModelBrowserProjection } from '@/lib/model-browser';
import type { Company, ModelCard } from '@/types';

const companies: Company[] = [
  { key: 'openai', name: 'OpenAI', website: 'https://openai.com' },
  { key: 'anthropic', name: 'Anthropic', website: 'https://anthropic.com' },
];

const models: ModelCard[] = [
  {
    id: 'openai/gpt',
    name: 'GPT',
    company: 'openai',
    brand_color: '#000000',
    release_date: '2025-01-01',
    weight_availability_tags: ['closed-weights'],
    tags: ['reasoning'],
    sources: [{ key: 'paper', title: 'Paper', url: 'https://example.com', type: 'paper' }],
    scores: {},
  },
  {
    id: 'anthropic/claude',
    name: 'Claude',
    company: 'anthropic',
    brand_color: '#111111',
    release_date: '2025-02-01',
    weight_availability_tags: ['closed-weights'],
    tags: ['multimodal'],
    sources: [{ key: 'paper', title: 'Paper', url: 'https://example.com', type: 'paper' }],
    scores: {},
  },
];

describe('buildModelBrowserProjection', () => {
  it('集中生成标签、公司分组、选中态和平均态', () => {
    const projection = buildModelBrowserProjection({
      models,
      companies,
      selectedIds: ['openai/gpt'],
      averageIds: ['anthropic/claude'],
      expandedCompanyKeys: new Set(['openai']),
      query: { search: '', companyKey: null, tag: null },
    });

    expect(projection.companyOptions.map((company) => company.name)).toEqual(['Anthropic', 'OpenAI']);
    expect(projection.tagOptions).toEqual(['closed-weights', 'multimodal', 'reasoning']);
    expect(projection.groups.map((group) => group.companyName)).toEqual(['Anthropic', 'OpenAI']);
    expect(projection.groups[1]).toMatchObject({
      companyKey: 'openai',
      allSelected: true,
      someSelected: false,
      expanded: true,
    });
    expect(projection.groups[0].rows[0]).toMatchObject({
      selected: false,
      averaged: true,
    });
  });

  it('按搜索词过滤模型并自动展开结果分组', () => {
    const projection = buildModelBrowserProjection({
      models,
      companies,
      selectedIds: [],
      averageIds: [],
      expandedCompanyKeys: new Set(),
      query: { search: 'multi', companyKey: null, tag: null },
    });

    expect(projection.hasQuery).toBe(true);
    expect(projection.filteredModelIds).toEqual(['anthropic/claude']);
    expect(projection.groups).toHaveLength(1);
    expect(projection.groups[0].expanded).toBe(true);
  });
});
