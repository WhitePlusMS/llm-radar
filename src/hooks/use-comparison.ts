import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * 管理对比状态：选中的模型 id 列表、参与平均的模型 id 列表与选中的 metric id 列表。
 * 状态同步到 URL query string，支持刷新后恢复。
 *
 * 不依赖 react-router，直接使用原生 URL 与 popstate 事件。
 *
 * URL query 约定：`?key=id1,id2`，空集时删除该 key。
 * 默认值来自异步加载的 index，未就绪时为 []；就绪后由 useIdSet 内部自动应用一次。
 */

/** 从 URL 读取 key 对应的 id 列表；URL 无该 key 时回落到默认值 */
function readIds(key: string, getFallback: () => string[]): string[] {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(key);
  if (!raw) return getFallback();
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 将 id 列表写回 URL（空集删 key） */
function writeIds(key: string, ids: string[]): void {
  const url = new URL(window.location.href);
  if (ids.length === 0) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, ids.join(','));
  }
  window.history.replaceState(null, '', url.toString());
}

interface IdSet {
  /** 当前选中的 id 列表 */
  ids: string[];
  /** 切换某个 id 的选中状态 */
  toggle: (id: string) => void;
  /** 直接设置选中列表（同步写回 URL） */
  set: (ids: string[]) => void;
  /** 清空选中 */
  clear: () => void;
}

/**
 * 文件内本地原语：管理一组 string id 的选中状态，并拥有"URL 优先，否则默认"的完整决策。
 *
 * 设计动机：原 useComparison 把"URL 有值就用 URL，否则用默认"这一句决策劈成两半——
 * hook 初始化读 URL，App 再用 ref + effect 在默认值就绪后补打一次。
 * 现收口到本原语内部，调用方无需再写 defaultsAppliedRef dance。
 *
 * @param key URL query 参数名（如 'models'）
 * @param getDefaults 返回默认 id 列表的惰性函数；异步数据就绪前可返回 []，
 *                    就绪后返回非空数组时本原语会自动应用一次（仅当 URL 未指定）
 */
function useIdSet(key: string, getDefaults: () => string[]): IdSet {
  const [ids, setIdsState] = useState(() => readIds(key, getDefaults));
  const defaultsAppliedRef = useRef(false);

  // 监听浏览器前进/后退，同步 URL 状态
  useEffect(() => {
    const handlePopState = () => setIdsState(readIds(key, getDefaults));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [key, getDefaults]);

  // 默认值就绪后补打一次（仅当 URL 未指定）：把"URL or 默认"收口在此处
  useEffect(() => {
    if (defaultsAppliedRef.current) return;
    const defaults = getDefaults();
    if (defaults.length === 0) return; // 默认值尚未就绪，等下次
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

  const clear = useCallback(() => set([]), [set]);

  return useMemo(() => ({ ids, toggle, set, clear }), [ids, toggle, set, clear]);
}

/**
 * 对比状态聚合 hook：三次 useIdSet + 薄映射，对外保持稳定的 9 值 API。
 *
 * 默认值参数为惰性 getter（() => string[]），因为默认值依赖异步加载的 index，
 * 在 index 就绪前为空数组；useIdSet 内部会在默认值就绪后自动应用一次。
 */
export function useComparison(
  getdefaultModelIds: () => string[],
  getdefaultMetricIds: () => string[],
  getdefaultAverageModelIds: () => string[]
): {
  selectedModelIds: string[];
  selectedMetricIds: string[];
  averageModelIds: string[];
  toggleModel: (id: string) => void;
  toggleMetric: (id: string) => void;
  toggleAverage: (id: string) => void;
  setAverageModelIds: (ids: string[]) => void;
  setModelIds: (ids: string[]) => void;
  setMetricIds: (ids: string[]) => void;
} {
  const models = useIdSet('models', getdefaultModelIds);
  const metrics = useIdSet('metrics', getdefaultMetricIds);
  const averages = useIdSet('avg', getdefaultAverageModelIds);

  return useMemo(
    () => ({
      selectedModelIds: models.ids,
      selectedMetricIds: metrics.ids,
      averageModelIds: averages.ids,
      toggleModel: models.toggle,
      toggleMetric: metrics.toggle,
      toggleAverage: averages.toggle,
      setModelIds: models.set,
      setMetricIds: metrics.set,
      setAverageModelIds: averages.set,
    }),
    [models, metrics, averages]
  );
}
