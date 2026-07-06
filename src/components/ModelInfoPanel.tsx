import type { Company, ModelCard } from '@/types';
import { Calendar, Cpu, Globe, Layers, MessageSquare, Tag, Database, ExternalLink } from 'lucide-react';
import { ModelLogo } from './ModelLogo';

interface ModelInfoPanelProps {
  model: ModelCard;
  company?: Company;
}

function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: color ? `${color}20` : '#e2e8f0',
        color: color || '#475569',
      }}
    >
      {children}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start gap-2 py-1">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
      <div className="min-w-0 flex-1">
        <span className="text-xs text-slate-500">{label}</span>
        <div className="text-sm font-medium text-slate-700">{value}</div>
      </div>
    </div>
  );
}

export function ModelInfoPanel({ model, company }: ModelInfoPanelProps) {
  const allTags = [
    ...model.weight_availability_tags,
    ...(model.tags ?? []),
  ];

  const parameterText = [model.parameters?.total, model.parameters?.active]
    .filter(Boolean)
    .join(model.parameters?.active ? ' / ' : '');

  const modalityText = model.modalities
    ? `输入: ${model.modalities.input.join(', ')} / 输出: ${model.modalities.output.join(', ')}`
    : undefined;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <ModelLogo model={model} company={company} size="lg" />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-base font-bold text-slate-900">{model.name}</h4>
          <p className="text-xs text-slate-500">{company?.name ?? model.company}</p>
        </div>
      </div>

      <div className="space-y-0.5">
        <InfoRow icon={Calendar} label="发布日期" value={model.release_date} />
        <InfoRow icon={Database} label="参数量" value={parameterText || undefined} />
        <InfoRow icon={Cpu} label="架构" value={model.architecture} />
        <InfoRow icon={Layers} label="上下文窗口" value={model.context_window} />
        <InfoRow icon={MessageSquare} label="模态" value={modalityText} />
      </div>

      {allTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <Badge key={tag} color={model.brand_color}>
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {model.sources.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            来源
          </div>
          <ul className="space-y-1">
            {model.sources.map((source) => (
              <li key={source.key}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  {source.title}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
