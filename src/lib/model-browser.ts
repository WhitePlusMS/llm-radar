import type { Company, ModelCard } from '../types';

/**
 * Model 浏览投影 module：集中处理搜索、CompanyProfile lookup、标签目录、
 * 分组、选中态、平均态和展开态。
 */

export interface ModelBrowserQuery {
  search: string;
  companyKey: string | null;
  tag: string | null;
}

export interface ModelBrowserRow {
  model: ModelCard;
  selected: boolean;
  averaged: boolean;
}

export interface ModelBrowserGroup {
  companyKey: string;
  companyName: string;
  modelIds: string[];
  rows: ModelBrowserRow[];
  allSelected: boolean;
  someSelected: boolean;
  expanded: boolean;
}

export interface ModelBrowserProjection {
  companyOptions: Company[];
  tagOptions: string[];
  groups: ModelBrowserGroup[];
  filteredModelIds: string[];
  filteredCount: number;
  hasQuery: boolean;
}

function companyNameOf(companyMap: Map<string, Company>, companyKey: string): string {
  return companyMap.get(companyKey)?.name ?? companyKey;
}

function modelTags(model: ModelCard): string[] {
  return [...model.weight_availability_tags, ...(model.tags ?? [])];
}

function matchesQuery(
  model: ModelCard,
  companyMap: Map<string, Company>,
  query: ModelBrowserQuery
): boolean {
  const term = query.search.trim().toLowerCase();
  const tags = modelTags(model);
  const companyName = companyNameOf(companyMap, model.company);

  const matchesSearch =
    !term ||
    model.name.toLowerCase().includes(term) ||
    model.company.toLowerCase().includes(term) ||
    companyName.toLowerCase().includes(term) ||
    tags.some((tag) => tag.toLowerCase().includes(term));
  const matchesCompany = !query.companyKey || model.company === query.companyKey;
  const matchesTag = !query.tag || tags.includes(query.tag);
  return matchesSearch && matchesCompany && matchesTag;
}

export function buildModelBrowserProjection(params: {
  models: ModelCard[];
  companies: Company[];
  selectedIds: string[];
  averageIds: string[];
  expandedCompanyKeys: Set<string>;
  query: ModelBrowserQuery;
}): ModelBrowserProjection {
  const companyMap = new Map(params.companies.map((company) => [company.key, company]));
  const selected = new Set(params.selectedIds);
  const averaged = new Set(params.averageIds);
  const hasQuery = Boolean(params.query.search || params.query.companyKey || params.query.tag);

  const tagSet = new Set<string>();
  params.models.forEach((model) => modelTags(model).forEach((tag) => tagSet.add(tag)));

  const filteredModels = params.models.filter((model) =>
    matchesQuery(model, companyMap, params.query)
  );
  const grouped = new Map<string, ModelCard[]>();
  filteredModels.forEach((model) => {
    const group = grouped.get(model.company) ?? [];
    group.push(model);
    grouped.set(model.company, group);
  });

  const groups = Array.from(grouped.entries())
    .sort((a, b) =>
      companyNameOf(companyMap, a[0]).localeCompare(companyNameOf(companyMap, b[0]))
    )
    .map(([companyKey, models]) => {
      const modelIds = models.map((model) => model.id);
      const allSelected = modelIds.every((id) => selected.has(id));
      const someSelected = modelIds.some((id) => selected.has(id)) && !allSelected;

      return {
        companyKey,
        companyName: companyNameOf(companyMap, companyKey),
        modelIds,
        rows: models.map((model) => ({
          model,
          selected: selected.has(model.id),
          averaged: averaged.has(model.id),
        })),
        allSelected,
        someSelected,
        expanded: params.expandedCompanyKeys.has(companyKey) || hasQuery,
      };
    });

  return {
    companyOptions: params.companies.slice().sort((a, b) => a.name.localeCompare(b.name)),
    tagOptions: Array.from(tagSet).sort(),
    groups,
    filteredModelIds: filteredModels.map((model) => model.id),
    filteredCount: filteredModels.length,
    hasQuery,
  };
}

export function selectedCompanyKeys(
  models: ModelCard[],
  selectedIds: string[]
): Set<string> {
  const activeIds = new Set(selectedIds);
  return new Set(models.filter((model) => activeIds.has(model.id)).map((model) => model.company));
}
