/**
 * LLM Radar 领域类型定义。
 *
 * 设计原则：
 * - Capability 仅用于分组/筛选/着色，不生成复合分数。
 * - 缺失分数用 ScoreEntry.value === null 表示，UI 中显示为 N/A。
 * - 每个分数必须指向 ModelCard.sources 中的 source key。
 */

/** benchmark 分数原始尺度。SCORE_SCALES 是同源运行时数组，供构建期校验复用。 */
export const SCORE_SCALES = ['percentage', 'zero_to_one', 'raw'] as const;
export type ScoreScale = (typeof SCORE_SCALES)[number];

/** 来源类型。SOURCE_TYPES 是同源运行时数组，供构建期校验复用。 */
export const SOURCE_TYPES = [
  'paper',
  'blog',
  'leaderboard',
  'report',
  'model-card',
  'system-card',
  'website',
  'code',
  'codebase',
  'other',
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

/** 权重开放标签。WEIGHT_AVAILABILITY_TAGS 是同源运行时数组，供构建期校验复用。 */
export const WEIGHT_AVAILABILITY_TAGS = [
  'open-weights',
  'closed-weights',
  'reasoning',
  'multimodal',
  'agentic',
] as const;
export type WeightAvailabilityTag = (typeof WEIGHT_AVAILABILITY_TAGS)[number];

/** 模型来源 */
export interface Source {
  key: string;
  title: string;
  url: string;
  type: SourceType;
}

/** 单个 benchmark 分数 */
export interface ScoreEntry {
  value: number | null;
  source?: string;
}

/** 模型参数规模 */
export interface ModelParameters {
  total?: string;
  active?: string;
}

/** 模型支持的模态 */
export interface ModelModalities {
  input: string[];
  output: string[];
}

/** 单模型卡片 */
export interface ModelCard {
  id: string;
  name: string;
  company: string;
  brand_color: string;
  release_date: string;
  parameters?: ModelParameters;
  architecture?: string;
  context_window?: string;
  modalities?: ModelModalities;
  weight_availability_tags: WeightAvailabilityTag[];
  tags?: string[];
  logo?: string;
  sources: Source[];
  scores: Record<string, ScoreEntry>;
}

/** benchmark 定义 */
export interface Metric {
  id: string;
  name: string;
  description: string;
  scale: ScoreScale;
  higher_is_better: boolean;
  max_value?: number;
  capability_tags: string[];
  featured?: boolean;
}

/** 公司元数据 */
export interface Company {
  key: string;
  name: string;
  website: string;
}

/** 构建产物：模型索引 */
export interface ModelIndex {
  meta: {
    generated_at: string;
    version: string;
    model_count: number;
    metric_count: number;
    company_count: number;
  };
  metrics: Metric[];
  companies: Company[];
  models: ModelCard[];
}
