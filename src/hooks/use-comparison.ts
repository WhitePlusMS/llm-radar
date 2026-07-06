import { useMemo } from 'react';
import { useSelectableSet } from '@/hooks/use-selectable-set';

/**
 * 对比状态薄壳：组合两个选择集（模型 / benchmark）。
 *
 * 真正的"URL or 默认"决策与 URL 同步逻辑下沉到 useSelectableSet，
 * 本 hook 仅负责把两份选择集以稳定的命名对外暴露，便于 App 解构使用。
 */
export function useComparison(defaultModelIds: string[], defaultMetricIds: string[]): {
  selectedModelIds: string[];
  selectedMetricIds: string[];
  toggleModel: (id: string) => void;
  toggleMetric: (id: string) => void;
  setModelIds: (ids: string[]) => void;
  setMetricIds: (ids: string[]) => void;
} {
  const models = useSelectableSet('models', () => defaultModelIds);
  const metrics = useSelectableSet('metrics', () => defaultMetricIds);

  return useMemo(
    () => ({
      selectedModelIds: models.ids,
      selectedMetricIds: metrics.ids,
      toggleModel: models.toggle,
      toggleMetric: metrics.toggle,
      setModelIds: models.set,
      setMetricIds: metrics.set,
    }),
    [models, metrics]
  );
}
