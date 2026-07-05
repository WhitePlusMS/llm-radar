import type { ModelCard, Source } from '@/types';

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
  // 收集所有来源并按模型分组
  const sourcesByModel = models
    .filter((m) => m.sources && m.sources.length > 0)
    .map((model) => ({
      model,
      sources: model.sources as Source[],
    }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">数据来源</h3>
      <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
        {sourcesByModel.map(({ model, sources }) => (
          <div key={model.id}>
            <div className="mb-1 text-sm font-medium" style={{ color: model.brand_color }}>
              {model.name}
            </div>
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              {sources.map((source) => (
                <li key={source.key}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                    dangerouslySetInnerHTML={{
                      __html: `${escapeHtml(source.title)} (${escapeHtml(source.type)})`,
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
