import { useState } from 'react';
import type { Company, ModelCard } from '@/types';

interface ModelLogoProps {
  /** 模型卡片，提供 logo / company / brand_color 字段 */
  model: ModelCard;
  /** 可选公司元数据，仅用于首字母回退时的显示名 */
  company?: Company;
  /** 尺寸预设：sm=列表项小图标，lg=信息面板大图标 */
  size?: 'sm' | 'lg';
}

// 尺寸 → Tailwind class 映射，集中管理避免分叉
const SIZE_CLASS: Record<'sm' | 'lg', { wrapper: string; img: string; fallback: string }> = {
  sm: {
    wrapper: 'flex h-5 w-5 flex-shrink-0 items-center justify-center',
    img: 'h-full w-full object-contain',
    fallback: 'h-full w-full rounded text-[10px] font-bold text-white',
  },
  lg: {
    wrapper: 'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white p-1',
    img: 'h-full w-full object-contain',
    fallback: 'hidden h-full w-full items-center justify-center rounded-lg text-xs font-bold text-white',
  },
};

/**
 * 统一的模型 logo 渲染组件。
 * 领域约定：logo 路径优先取 model.logo，否则回退到 assets/logos/<company>.svg。
 * 图片加载失败时切到 brand_color 首字母回退（采用信息面板的较丰富版本作为统一行为）。
 */
export function ModelLogo({ model, company, size = 'sm' }: ModelLogoProps) {
  const cls = SIZE_CLASS[size];
  // 路径约定收口到此，调用方不再自行计算
  const logoPath = model.logo ?? `assets/logos/${model.company.toLowerCase()}.svg`;
  const displayName = company?.name ?? model.company;
  const [failed, setFailed] = useState(false);

  return (
    <div className={cls.wrapper} title={displayName}>
      {failed ? (
        <div
          className={cls.fallback}
          style={{ backgroundColor: model.brand_color, display: 'flex' }}
        >
          {displayName.slice(0, 1).toUpperCase()}
        </div>
      ) : (
        <img
          src={logoPath}
          alt={displayName}
          className={cls.img}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
