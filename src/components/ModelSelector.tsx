import { useEffect, useMemo, useState } from 'react';
import { Search, X, ChevronDown, ChevronUp, Tag, BarChart3 } from 'lucide-react';
import type { Company, ModelCard } from '@/types';

interface ModelSelectorProps {
  models: ModelCard[];
  companies: Company[];
  selectedIds: string[];
  averageIds: string[];
  onToggle: (id: string) => void;
  onToggleAverage: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClear: () => void;
}

export function ModelSelector({
  models,
  companies,
  selectedIds,
  averageIds,
  onToggle,
  onToggleAverage,
  onSelectAll,
  onClear,
}: ModelSelectorProps) {
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

  // 当选择或平均集合变化时，自动展开包含选中/平均模型的公司
  useEffect(() => {
    setExpandedCompanies((prev) => {
      const next = new Set(prev);
      models.forEach((m) => {
        if (selectedIds.includes(m.id) || averageIds.includes(m.id)) {
          next.add(m.company);
        }
      });
      return next;
    });
  }, [models, selectedIds, averageIds]);

  const companyMap = useMemo(() => {
    const map = new Map<string, Company>();
    companies.forEach((c) => map.set(c.key, c));
    return map;
  }, [companies]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    models.forEach((m) => {
      m.weight_availability_tags.forEach((t) => set.add(t));
      (m.tags ?? []).forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [models]);

  const filteredModels = useMemo(() => {
    const term = search.trim().toLowerCase();
    return models.filter((m) => {
      const companyName = companyMap.get(m.company)?.name ?? m.company;
      const matchesSearch =
        !term ||
        m.name.toLowerCase().includes(term) ||
        m.company.toLowerCase().includes(term) ||
        companyName.toLowerCase().includes(term) ||
        (m.tags ?? []).some((t) => t.toLowerCase().includes(term));
      const matchesCompany = !companyFilter || m.company === companyFilter;
      const matchesTag =
        !tagFilter ||
        m.weight_availability_tags.some((t) => t === tagFilter) ||
        (m.tags ?? []).some((t) => t === tagFilter);
      return matchesSearch && matchesCompany && matchesTag;
    });
  }, [models, search, companyFilter, tagFilter, companyMap]);

  const grouped = useMemo(() => {
    const map = new Map<string, ModelCard[]>();
    filteredModels.forEach((m) => {
      const groupKey = m.company;
      if (!map.has(groupKey)) map.set(groupKey, []);
      map.get(groupKey)!.push(m);
    });
    return Array.from(map.entries()).sort((a, b) => {
      const nameA = companyMap.get(a[0])?.name ?? a[0];
      const nameB = companyMap.get(b[0])?.name ?? b[0];
      return nameA.localeCompare(nameB);
    });
  }, [filteredModels, companyMap]);

  const toggleCompanyExpanded = (key: string) => {
    setExpandedCompanies((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectFiltered = () => {
    onSelectAll(filteredModels.map((m) => m.id));
  };

  const activeFilters = (companyFilter ? 1 : 0) + (tagFilter ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">选择模型</h3>
        <div className="space-x-2 text-xs">
          <button
            type="button"
            onClick={selectFiltered}
            className="text-indigo-600 hover:text-indigo-800"
          >
            全选当前
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-slate-500 hover:text-slate-700"
          >
            清空
          </button>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索模型、公司、标签..."
          className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-7 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 筛选器 */}
      <div className="mb-3 flex flex-wrap gap-2">
        <select
          value={companyFilter ?? ''}
          onChange={(e) => setCompanyFilter(e.target.value || null)}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">所有公司</option>
          {companies
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
        </select>

        <select
          value={tagFilter ?? ''}
          onChange={(e) => setTagFilter(e.target.value || null)}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">所有标签</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {activeFilters > 0 && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCompanyFilter(null);
              setTagFilter(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* 模型列表 — 按公司分组 */}
      <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
        {grouped.length === 0 && (
          <p className="py-4 text-center text-xs text-slate-400">没有匹配的模型</p>
        )}

        {grouped.map(([companyKey, companyModels]) => {
          const companyName = companyMap.get(companyKey)?.name ?? companyKey;
          const allSelected = companyModels.every((m) => selectedIds.includes(m.id));
          const someSelected = companyModels.some((m) => selectedIds.includes(m.id)) && !allSelected;
          const expanded = expandedCompanies.has(companyKey) || companyFilter !== null || search !== '';

          return (
            <div key={companyKey} className="rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between px-2 py-1.5">
                <label className="flex flex-1 cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={() => {
                      const ids = companyModels.map((m) => m.id);
                      if (allSelected) {
                        onSelectAll(selectedIds.filter((id) => !ids.includes(id)));
                      } else {
                        onSelectAll(Array.from(new Set([...selectedIds, ...ids])));
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">{companyName}</span>
                  <span className="text-xs text-slate-400">({companyModels.length})</span>
                </label>
                {!companyFilter && !search && (
                  <button
                    type="button"
                    onClick={() => toggleCompanyExpanded(companyKey)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>

              {(expanded || companyFilter !== null || search !== '') && (
                <div className="space-y-0.5 px-1 pb-1">
                  {companyModels.map((model) => {
                    const isSelected = selectedIds.includes(model.id);
                    const isAverage = averageIds.includes(model.id);
                    const logoPath = model.logo ?? `assets/logos/${model.company.toLowerCase()}.svg`;
                    return (
                      <div
                        key={model.id}
                        className={`flex items-start gap-2 rounded-lg px-2 py-2 transition-colors ${
                          isSelected ? 'bg-indigo-50' : 'hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggle(model.id)}
                          className="mt-1 h-4 w-4 flex-shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <img
                          src={logoPath}
                          alt=""
                          className="mt-0.5 h-5 w-5 flex-shrink-0 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.visibility = 'hidden';
                          }}
                        />
                        <label className="min-w-0 flex-1 cursor-pointer" onClick={() => onToggle(model.id)}>
                          <span className="block text-sm font-medium leading-tight text-slate-700">
                            {model.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-400">{model.release_date}</span>
                          {model.weight_availability_tags.length > 0 && (
                            <span className="mt-1 flex flex-wrap gap-1">
                              {model.weight_availability_tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded bg-slate-200 px-1 py-0.5 text-[10px] text-slate-600"
                                >
                                  <Tag className="mr-0.5 h-2.5 w-2.5" />
                                  {tag}
                                </span>
                              ))}
                            </span>
                          )}
                        </label>
                        <button
                          type="button"
                          onClick={() => onToggleAverage(model.id)}
                          title={isAverage ? '不计入平均线' : '计入平均线'}
                          className={`mt-1 flex flex-shrink-0 items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                            isAverage
                              ? 'bg-slate-500 text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                          }`}
                        >
                          <BarChart3 className="h-3 w-3" />
                          均
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-slate-400">
        已选 {selectedIds.length} / {models.length}
        {filteredModels.length !== models.length && ` · 当前筛选 ${filteredModels.length} 个`}
        {averageIds.length > 0 && ` · ${averageIds.length} 个计入平均`}
      </div>
    </div>
  );
}
