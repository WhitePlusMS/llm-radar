import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * 选择集原语：管理一组 string id 的选中状态，并拥有"URL 优先，否则默认"的完整决策。
 *
 * 设计动机（深化自原 useComparison）：
 * - "URL 有值就用 URL，否则用默认"本是一句决策，原实现把它劈成两半——
 *   hook 初始化读 URL，App 再用 ref + effect 在默认值就绪后补打一次。
 *   现在该决策收口到本原语内部，调用方无需再写 defaultsAppliedRef dance。
 * - model / metric 两类选择共用同一逻辑，原 useComparison 为此复制了两份；
 *   现以原语复用，调用方各调用一次即可。
 *
 * URL query 约定：`?key=id1,id2`，空集时删除该 key。
 * 不依赖 react-router，直接使用原生 URL 与 popstate 事件。
 */

export interface SelectableSet {
  /** 当前选中的 id 列表 */
  ids: string[];
  /** 切换某个 id 的选中状态 */
  toggle: (id: string) => void;
  /** 直接设置选中列表（同步写回 URL） */
  set: (ids: string[]) => void;
  /** 清空选中 */
  clear: () => void;
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

/**
 * @param key URL query 参数名（如 'models'）
 * @param getDefaults 返回默认 id 列表的函数；在异步数据就绪前可返回 []，
 *                    就绪后返回非空数组时本原语会自动应用一次（仅当 URL 未指定）
 */
export function useSelectableSet(key: string, getDefaults: () => string[]): SelectableSet {
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

  const set = useCallback((nextIds: string[]) => {
    setIdsState(nextIds);
    writeIds(key, nextIds);
  }, [key]);

  const toggle = useCallback((id: string) => {
    setIdsState((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeIds(key, next);
      return next;
    });
  }, [key]);

  const clear = useCallback(() => set([]), [set]);

  return useMemo(
    () => ({ ids, toggle, set, clear }),
    [ids, toggle, set, clear]
  );
}
