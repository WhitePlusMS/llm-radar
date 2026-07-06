import { useEffect, useMemo, useState } from 'react';
import type { Company, ModelCard } from '@/types';
import {
  buildModelBrowserProjection,
  selectedCompanyKeys,
  type ModelBrowserQuery,
} from '@/lib/model-browser';
import { Activity, ChevronRight, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { Tooltip } from '@/components/ui/Tooltip';

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
 * 模型选择面板：搜索、筛选并按公司分组选择模型。
 * “显示模型”和“计入平均基线”是两套独立选择，避免用户把参照线误解成图中模型。
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

  const autoExpandedCompanies = useMemo(
    () => selectedCompanyKeys(models, selectedIds),
    [models, selectedIds]
  );

  // 平均基线默认包含全部模型；自动展开只看“显示模型”，否则侧栏会被默认基线撑开。
  useEffect(() => {
    setExpandedCompanies((prev) => {
      const next = new Set(prev);
      autoExpandedCompanies.forEach((companyKey) => next.add(companyKey));
      return next;
    });
  }, [autoExpandedCompanies]);

  const query: ModelBrowserQuery = useMemo(
    () => ({ search, companyKey: companyFilter, tag: tagFilter }),
    [search, companyFilter, tagFilter]
  );

  const projection = useMemo(
    () =>
      buildModelBrowserProjection({
        models,
        companies,
        selectedIds,
        averageIds,
        expandedCompanyKeys: expandedCompanies,
        query,
      }),
    [models, companies, selectedIds, averageIds, expandedCompanies, query]
  );

  const toggleCompanyExpanded = (key: string) => {
    setExpandedCompanies((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectFiltered = () => {
    onSelectAll(projection.filteredModelIds);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="title"><span className="idx">01</span>Select Models</span>
        <div className="actions">
          <Button variant="secondary" onClick={selectFiltered}>全选筛选</Button>
          <Button variant="ghost" onClick={onClear}>清空</Button>
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

        <div className="filters">
          <Select
            value={companyFilter ?? 'all'}
            onValueChange={(value) => setCompanyFilter(value === 'all' ? null : value)}
            options={[
              { value: 'all', label: '所有公司' },
              ...projection.companyOptions.map((c) => ({ value: c.key, label: c.name })),
            ]}
            ariaLabel="按公司筛选"
          />
          <Select
            value={tagFilter ?? 'all'}
            onValueChange={(value) => setTagFilter(value === 'all' ? null : value)}
            options={[
              { value: 'all', label: '所有标签' },
              ...projection.tagOptions.map((tag) => ({ value: tag, label: tag })),
            ]}
            ariaLabel="按标签筛选"
          />
          {projection.hasQuery && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearch('');
                setCompanyFilter(null);
                setTagFilter(null);
              }}
            >
              清除筛选
            </Button>
          )}
        </div>

        {/* 模型列表 — 按公司分组 */}
        {projection.groups.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--dim)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '16px 0' }}>
            没有匹配的模型
          </p>
        )}
        {projection.groups.map((group) => {
          const toggleCompanySelection = () => {
            if (group.allSelected) {
              onSelectAll(selectedIds.filter((id) => !group.modelIds.includes(id)));
            } else {
              onSelectAll(Array.from(new Set([...selectedIds, ...group.modelIds])));
            }
          };

          return (
            <div key={group.companyKey} className={`company-group${group.expanded ? ' open' : ''}`}>
              <div
                className="company-row"
                onClick={toggleCompanySelection}
                role="checkbox"
                aria-checked={group.allSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).click();
                  }
                }}
              >
                <Checkbox
                  checked={group.someSelected ? 'indeterminate' : group.allSelected}
                  onCheckedChange={toggleCompanySelection}
                  ariaLabel={`${group.companyName} 显示模型`}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="cname">{group.companyName}</span>
                <Badge>{group.rows.length}</Badge>
                {!projection.hasQuery && (
                  <button
                    type="button"
                    className="chev"
                    aria-label={group.expanded ? '收起' : '展开'}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompanyExpanded(group.companyKey);
                    }}
                  >
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
              <div className="model-list">
                {group.rows.map(({ model, selected, averaged }) => {
                  return (
                    <div
                      key={model.id}
                      className={`model-row${selected ? ' sel' : ''}`}
                      onClick={() => onToggle(model.id)}
                      role="checkbox"
                      aria-checked={selected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          onToggle(model.id);
                        }
                      }}
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => onToggle(model.id)}
                        ariaLabel={`${model.name} 显示在雷达图`}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="swatch" style={{ background: model.brand_color }} />
                      <span className="mname">{model.name}</span>
                      <span className="mdate">{model.release_date}</span>
                      <Tooltip content={averaged ? '当前计入平均基线，点击移除' : '点击后计入平均基线'}>
                        <button
                          type="button"
                          className={`baseline-toggle${averaged ? ' on' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleAverage(model.id);
                          }}
                          aria-pressed={averaged}
                          aria-label={averaged ? `${model.name} 不计入平均基线` : `${model.name} 计入平均基线`}
                        >
                          <Activity size={12} />
                          <span>基线</span>
                        </button>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 已选汇总 */}
        <div className="sel-summary">
          <span>显示 <b>{selectedIds.length}</b> / {models.length}</span>
          <span>基线 <b>{averageIds.length}</b></span>
          {projection.hasQuery && <span>筛选 <b>{projection.filteredCount}</b></span>}
        </div>
      </div>
    </div>
  );
}
