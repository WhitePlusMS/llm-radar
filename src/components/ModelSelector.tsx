import { useEffect, useMemo, useState } from 'react';
import type { Company, ModelCard } from '@/types';
import { ChevronRight, Search, X } from 'lucide-react';

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

/**
 * 模型选择面板：对应 mockup 的 .panel（idx 01）。
 * 搜索框 + 公司/标签筛选 + 按公司分组的可展开模型列表 + 已选汇总。
 * 行内仅显示色点 + 名称 + 日期 + 平均开关，标签与详情留在 ModelInfoPanel。
 */
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

  const hasFilters = !!(companyFilter || tagFilter || search);

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="title"><span className="idx">01</span>Select Models</span>
        <div className="actions">
          <button type="button" className="btn" onClick={selectFiltered}>全选</button>
          <button type="button" className="btn" onClick={onClear}>清空</button>
        </div>
      </div>
      <div className="panel-body">
        {/* 搜索框 */}
        <div className="search">
          <Search className="ico" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索模型 / 公司 / 标签…"
            aria-label="搜索模型"
          />
          {search && (
            <button
              type="button"
              className="clear"
              onClick={() => setSearch('')}
              aria-label="清除搜索"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* 筛选器：公司 + 标签下拉，pill 风格 */}
        <div className="filters">
          <select
            className="select"
            value={companyFilter ?? ''}
            onChange={(e) => setCompanyFilter(e.target.value || null)}
            aria-label="按公司筛选"
          >
            <option value="">所有公司</option>
            {companies
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
          </select>
          <select
            className="select"
            value={tagFilter ?? ''}
            onChange={(e) => setTagFilter(e.target.value || null)}
            aria-label="按标签筛选"
          >
            <option value="">所有标签</option>
            {allTags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {hasFilters && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setSearch('');
                setCompanyFilter(null);
                setTagFilter(null);
              }}
            >
              清除筛选
            </button>
          )}
        </div>

        {/* 模型列表 — 按公司分组 */}
        {grouped.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--dim)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '16px 0' }}>
            没有匹配的模型
          </p>
        )}
        {grouped.map(([companyKey, companyModels]) => {
          const companyName = companyMap.get(companyKey)?.name ?? companyKey;
          const allSelected = companyModels.every((m) => selectedIds.includes(m.id));
          const someSelected = companyModels.some((m) => selectedIds.includes(m.id)) && !allSelected;
          const expanded = expandedCompanies.has(companyKey) || hasFilters;

          return (
            <div key={companyKey} className={`company-group${expanded ? ' open' : ''}`}>
              <div
                className="company-row"
                onClick={() => {
                  const ids = companyModels.map((m) => m.id);
                  if (allSelected) {
                    onSelectAll(selectedIds.filter((id) => !ids.includes(id)));
                  } else {
                    onSelectAll(Array.from(new Set([...selectedIds, ...ids])));
                  }
                }}
                role="checkbox"
                aria-checked={allSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).click();
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="cb"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={() => {}}
                  tabIndex={-1}
                />
                <span className="cname">{companyName}</span>
                <span className="ccount">{companyModels.length}</span>
                {!hasFilters && (
                  <button
                    type="button"
                    className="chev"
                    aria-label={expanded ? '收起' : '展开'}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompanyExpanded(companyKey);
                    }}
                  >
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
              <div className="model-list">
                {companyModels.map((model) => {
                  const isSelected = selectedIds.includes(model.id);
                  const isAverage = averageIds.includes(model.id);
                  return (
                    <div
                      key={model.id}
                      className={`model-row${isSelected ? ' sel' : ''}`}
                      onClick={() => onToggle(model.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          onToggle(model.id);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        className="cb"
                        checked={isSelected}
                        onChange={() => onToggle(model.id)}
                        tabIndex={-1}
                      />
                      <span className="swatch" style={{ background: model.brand_color }} />
                      <span className="mname">{model.name}</span>
                      <span className="mdate">{model.release_date}</span>
                      <button
                        type="button"
                        className={`avg${isAverage ? ' on' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleAverage(model.id);
                        }}
                        title={isAverage ? '不计入平均线' : '计入平均线'}
                      >
                        均
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 已选汇总 */}
        <div className="sel-summary">
          <span>已选 <b>{selectedIds.length}</b> / {models.length}</span>
          <span>平均 <b>{averageIds.length}</b></span>
          {hasFilters && <span>筛选 <b>{filteredModels.length}</b></span>}
        </div>
      </div>
    </div>
  );
}
