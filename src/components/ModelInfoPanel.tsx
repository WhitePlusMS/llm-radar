import type { Company, ModelCard } from '@/types';
import { ModelLogo } from './ModelLogo';

interface ModelInfoPanelProps {
  model: ModelCard;
  company?: Company;
}

/**
 * 单个模型信息卡：对应 mockup 的 .info-card。
 * 左边框品牌色 + ic-logo + 名称/公司 + info-grid(k/v) + tags + 来源。
 * 由 App 包裹在 "Model Info" panel shell 内，一个模型一张卡。
 */
export function ModelInfoPanel({ model, company }: ModelInfoPanelProps) {
  const allTags = [...model.weight_availability_tags, ...(model.tags ?? [])];

  const parameterText = [model.parameters?.total, model.parameters?.active]
    .filter(Boolean)
    .join(model.parameters?.active ? ' / ' : '');

  const modalityText = model.modalities
    ? `in: ${model.modalities.input.join(', ')} · out: ${model.modalities.output.join(', ')}`
    : undefined;

  const rows: Array<[string, string | undefined]> = [
    ['params', parameterText || undefined],
    ['arch', model.architecture],
    ['ctx', model.context_window],
    ['modal', modalityText],
  ];

  return (
    <div className="info-card" style={{ borderLeftColor: model.brand_color }}>
      <div className="ic-head">
        <ModelLogo model={model} company={company} />
        <div>
          <div className="ic-name">{model.name}</div>
          <div className="ic-co">
            {company?.name ?? model.company} · {model.release_date}
          </div>
        </div>
      </div>

      <div className="info-grid">
        {rows
          .filter(([, v]) => v !== undefined)
          .flatMap(([k, v]) => [
            <span className="k" key={`k-${k}`}>{k}</span>,
            <span className="v" key={`v-${k}`}>{v}</span>,
          ])}
      </div>

      {allTags.length > 0 && (
        <div className="info-tags">
          {allTags.map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
      )}

      {model.sources.length > 0 && (
        <div className="info-src">
          <div className="src-title">Sources</div>
          {model.sources.map((source) => (
            <a
              key={source.key}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              title={source.title}
            >
              {source.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
