import type { ModelCard } from '@/types';

interface SourceListProps {
  models: ModelCard[];
}

/**
 * 来源列表：套用 mockup 的 src-card / src-item 语义。
 * 每条来源一行：模型色点 + 来源标题 + 来源类型。
 */
export function SourceList({ models }: SourceListProps) {
  const items = models
    .filter((m) => m.sources && m.sources.length > 0)
    .flatMap((m) => m.sources.map((s) => ({ model: m, source: s })));

  return (
    <section>
      <div className="section-label">
        <span><span className="num">03</span>Sources</span>
        <span className="right">100% primary</span>
      </div>
      <div className="src-card">
        {items.length === 0 ? (
          <div className="src-item">
            <span className="swatch" style={{ background: 'var(--rule-2)' }} />
            <span className="stitle">选择模型后显示来源</span>
            <span className="stype">—</span>
          </div>
        ) : (
          <ul className="src-list">
            {items.map(({ model, source }) => (
              <li key={`${model.id}:${source.key}`} className="src-item">
                <span className="swatch" style={{ background: model.brand_color }} />
                <a
                  className="stitle"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  title={source.title}
                >
                  <span className="sname">{model.name}</span>
                  {source.title} ↗
                </a>
                <span className="stype">{source.type}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
