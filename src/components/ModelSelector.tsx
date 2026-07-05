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
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">选择模型</h3>
        <div className="space-x-2 text-xs">
          <button
            type="button"
            onClick={() => onSelectAll(models.map((m) => m.id))}
            className="text-blue-600 hover:text-blue-800"
          >
            全选
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-gray-500 hover:text-gray-700"
          >
            清空
          </button>
        </div>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {models.map((model) => {
          const isSelected = selectedIds.includes(model.id);
          return (
            <label
              key={model.id}
              className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(model.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: model.brand_color }}
              />
              <span className="flex-1 text-sm text-gray-800">{model.name}</span>
              <span className="text-xs text-gray-400">{model.release_date}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
