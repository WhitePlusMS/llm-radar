import { useCallback, useMemo, useState, useEffect } from 'react';

/**
 * 管理对比状态：选中的模型 id 列表与选中的 metric id 列表。
 * 状态同步到 URL query string，支持刷新后恢复。
 *
 * 不依赖 react-router，直接使用原生 URL 与 popstate 事件。
 */
function readIds(key: string, fallback: string[]): string[] {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(key);
  if (!raw) return fallback;
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function writeIds(key: string, ids: string[]) {
  const url = new URL(window.location.href);
  if (ids.length === 0) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, ids.join(','));
  }
  window.history.replaceState(null, '', url.toString());
}

export function useComparison(
  defaultModelIds: string[],
  defaultMetricIds: string[]
): {
  selectedModelIds: string[];
  selectedMetricIds: string[];
  toggleModel: (id: string) => void;
  toggleMetric: (id: string) => void;
  setModelIds: (ids: string[]) => void;
  setMetricIds: (ids: string[]) => void;
} {
  const [selectedModelIds, setSelectedModelIdsState] = useState(() =>
    readIds('models', defaultModelIds)
  );
  const [selectedMetricIds, setSelectedMetricIdsState] = useState(() =>
    readIds('metrics', defaultMetricIds)
  );

  // 监听浏览器前进/后退，同步 URL 状态
  useEffect(() => {
    const handlePopState = () => {
      setSelectedModelIdsState(readIds('models', defaultModelIds));
      setSelectedMetricIdsState(readIds('metrics', defaultMetricIds));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [defaultModelIds, defaultMetricIds]);

  const setModelIds = useCallback((ids: string[]) => {
    setSelectedModelIdsState(ids);
    writeIds('models', ids);
  }, []);

  const setMetricIds = useCallback((ids: string[]) => {
    setSelectedMetricIdsState(ids);
    writeIds('metrics', ids);
  }, []);

  const toggleModel = useCallback(
    (id: string) => {
      const next = selectedModelIds.includes(id)
        ? selectedModelIds.filter((m) => m !== id)
        : [...selectedModelIds, id];
      setModelIds(next);
    },
    [selectedModelIds, setModelIds]
  );

  const toggleMetric = useCallback(
    (id: string) => {
      const next = selectedMetricIds.includes(id)
        ? selectedMetricIds.filter((m) => m !== id)
        : [...selectedMetricIds, id];
      setMetricIds(next);
    },
    [selectedMetricIds, setMetricIds]
  );

  return useMemo(
    () => ({
      selectedModelIds,
      selectedMetricIds,
      toggleModel,
      toggleMetric,
      setModelIds,
      setMetricIds,
    }),
    [selectedModelIds, selectedMetricIds, toggleModel, toggleMetric, setModelIds, setMetricIds]
  );
}
