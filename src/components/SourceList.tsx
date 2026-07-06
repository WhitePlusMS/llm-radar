import type { ModelCard } from '@/types';

interface SourceListProps {
  models: ModelCard[];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function SourceList({ models }: SourceListProps) {
  const modelsWithSources = models.filter((m) => m.sources && m.sources.length > 0);

  if (modelsWithSources.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">数据来源</h3>
        <p className="text-xs text-slate-400">选择模型后显示来源</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="h-2 w-2 rounded-full bg-indigo-500" />
        数据来源
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modelsWithSources.map((model) => (
          <div
            key={model.id}
            className="rounded-lg border border-slate-100 bg-slate-50 p-3"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: model.brand_color }}
              />
              <span className="text-slate-800">{model.name}</span>
            </div>
            <ul className="space-y-1.5">
              {model.sources.map((source) => (
                <li key={source.key} className="text-xs leading-relaxed">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    dangerouslySetInnerHTML={{
                      __html: `${escapeHtml(source.title)} <span class="text-slate-400">(${escapeHtml(source.type)})</span>`,
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
