import type { ModelIndex } from '@/types';

/**
 * 运行时从 /model-index.json 加载模型索引。
 * 该文件由 scripts/build-index.ts 在构建前生成。
 */
export async function loadModelIndex(): Promise<ModelIndex> {
  const response = await fetch('/model-index.json');
  if (!response.ok) {
    throw new Error(`加载 model-index.json 失败: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<ModelIndex>;
}
