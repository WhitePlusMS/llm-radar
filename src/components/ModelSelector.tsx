import type { ModelCard } from '@/types';

interface ModelSelectorProps {
  models: ModelCard[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClear: () => void;
}

export function ModelSelector({
  models,
  selectedIds,
  onToggle,
  onSelectAll,
  onClear,
}: ModelSelectorProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">选择模型</h3>
        <div className="space-x-2 text-xs">
          <button
            type="button"
            onClick={() => onSelectAll(models.map((m) => m.id))}
            className="text-indigo-600 hover:text-indigo-800"
          >
            全选
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-slate-500 hover:text-slate-700"
          >
            清空
          </button>
        </div>
      </div>
      <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
        {models.map((model) => {
          const isSelected = selectedIds.includes(model.id);
          return (
            <label
              key={model.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors ${
                isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(model.id)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span
                className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: model.brand_color }}
              />
              <span className="flex-1 truncate text-sm text-slate-700">{model.name}</span>
              <span className="text-xs text-slate-400">{model.release_date}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-slate-400">已选 {selectedIds.length} / {models.length}</div>
    </div>
  );
}
