import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ModelCard, ModelIndex, Metric } from '@/types';

/**
 * ModelSelectorState module：URL query、异步默认值、id 集合与
 * ModelCard/Metric 投影集中在一个 interface。
 */

interface IdSet {
  ids: string[];
  toggle: (id: string) => void;
  set: (ids: string[]) => void;
}

export interface ModelSelectorState {
  selectedModelIds: string[];
  selectedMetricIds: string[];
  averageModelIds: string[];
  selectedModels: ModelCard[];
  averageModels: ModelCard[];
  featuredMetricCount: number;
  toggleModel: (id: string) => void;
  toggleMetric: (id: string) => void;
  toggleAverage: (id: string) => void;
  setModelIds: (ids: string[]) => void;
  setMetricIds: (ids: string[]) => void;
  clearModelsAndAverage: () => void;
}

function readIds(key: string, getFallback: () => string[]): string[] {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(key);
  if (!raw) return getFallback();
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function writeIds(key: string, ids: string[]): void {
  const url = new URL(window.location.href);
  if (ids.length === 0) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, ids.join(','));
  }
  window.history.replaceState(null, '', url.toString());
}

function useIdSet(key: string, getDefaults: () => string[]): IdSet {
  const [ids, setIdsState] = useState(() => readIds(key, getDefaults));
  const defaultsAppliedRef = useRef(false);

  useEffect(() => {
    const handlePopState = () => setIdsState(readIds(key, getDefaults));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [key, getDefaults]);

  useEffect(() => {
    if (defaultsAppliedRef.current) return;
    const defaults = getDefaults();
    if (defaults.length === 0) return;
    defaultsAppliedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    if (!params.has(key)) {
      setIdsState(defaults);
    }
  }, [key, getDefaults]);

  const set = useCallback(
    (nextIds: string[]) => {
      setIdsState(nextIds);
      writeIds(key, nextIds);
    },
    [key]
  );

  const toggle = useCallback(
    (id: string) => {
      setIdsState((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        writeIds(key, next);
        return next;
      });
    },
    [key]
  );

  return useMemo(() => ({ ids, toggle, set }), [ids, toggle, set]);
}

function resolveModelsByIds(ids: string[], models: ModelCard[]): ModelCard[] {
  const modelMap = new Map(models.map((model) => [model.id, model]));
  return ids.map((id) => modelMap.get(id)).filter((model): model is ModelCard => model !== undefined);
}

function defaultModelIds(index: ModelIndex | null): string[] {
  return index ? index.models.slice(0, 4).map((model) => model.id) : [];
}

function defaultMetricIds(index: ModelIndex | null): string[] {
  return index ? index.metrics.filter((metric) => metric.featured).map((metric) => metric.id) : [];
}

function defaultAverageModelIds(index: ModelIndex | null): string[] {
  return index ? index.models.map((model) => model.id) : [];
}

function featuredMetricCount(metrics: Metric[]): number {
  return metrics.filter((metric) => metric.featured).length;
}

export function useModelSelectorState(index: ModelIndex | null): ModelSelectorState {
  const getDefaultModelIds = useCallback(() => defaultModelIds(index), [index]);
  const getDefaultMetricIds = useCallback(() => defaultMetricIds(index), [index]);
  const getDefaultAverageModelIds = useCallback(() => defaultAverageModelIds(index), [index]);

  const models = useIdSet('models', getDefaultModelIds);
  const metrics = useIdSet('metrics', getDefaultMetricIds);
  const averages = useIdSet('avg', getDefaultAverageModelIds);

  const selectedModels = useMemo(
    () => resolveModelsByIds(models.ids, index?.models ?? []),
    [models.ids, index]
  );
  const averageModels = useMemo(
    () => resolveModelsByIds(averages.ids, index?.models ?? []),
    [averages.ids, index]
  );

  const clearModelsAndAverage = useCallback(() => {
    models.set([]);
    averages.set([]);
  }, [models, averages]);

  return useMemo(
    () => ({
      selectedModelIds: models.ids,
      selectedMetricIds: metrics.ids,
      averageModelIds: averages.ids,
      selectedModels,
      averageModels,
      featuredMetricCount: featuredMetricCount(index?.metrics ?? []),
      toggleModel: models.toggle,
      toggleMetric: metrics.toggle,
      toggleAverage: averages.toggle,
      setModelIds: models.set,
      setMetricIds: metrics.set,
      clearModelsAndAverage,
    }),
    [models, metrics, averages, selectedModels, averageModels, index, clearModelsAndAverage]
  );
}
