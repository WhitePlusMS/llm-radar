import { useState } from 'react';
import type { Company, ModelCard } from '@/types';

interface ModelLogoProps {
  /** 模型卡片，提供 logo / company / brand_color 字段 */
  model: ModelCard;
  /** 可选公司元数据，仅用于首字母回退时的显示名 */
  company?: Company;
}

/**
 * 统一的模型 logo 渲染组件，对应 mockup 的 .ic-logo：30px 品牌色方块，
 * 内嵌 logo 图片（object-contain），图片加载失败时切到 brand_color 首字母回退。
 *
 * 领域约定：logo 路径优先取 model.logo，否则回退到 assets/logos/<company>.svg。
 * 唯一消费方是 ModelInfoPanel；ModelSelector 改用纯色 swatch 点，不再需要 logo 图。
 */
export function ModelLogo({ model, company }: ModelLogoProps) {
  const logoPath = model.logo ?? `assets/logos/${model.company.toLowerCase()}.svg`;
  const displayName = company?.name ?? model.company;
  const [failed, setFailed] = useState(false);

  return (
    <div className="ic-logo" style={{ background: model.brand_color }} title={displayName}>
      {failed ? (
        displayName.slice(0, 1).toUpperCase()
      ) : (
        <img src={logoPath} alt={displayName} onError={() => setFailed(true)} />
      )}
    </div>
  );
}
