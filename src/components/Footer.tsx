interface FooterProps {
  generatedAt?: string;
  modelCount?: number;
  metricCount?: number;
  companyCount?: number;
}

/**
 * 站点页脚：套用 mockup 的 footer.site 结构。
 * 左：品牌标语；右：数据更新时间与计数。
 */
export function Footer({ generatedAt, modelCount, metricCount, companyCount }: FooterProps) {
  const d = generatedAt ? new Date(generatedAt) : null;
  const timeText = d
    ? `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`
    : '未知';

  return (
    <footer className="site">
      <div className="inner">
        <span>
          <b className="red">LLM·RADAR</b> · 仅采用发布方原始来源，不做二次拟合
        </span>
        <span>
          数据更新于 <b>{timeText}</b>
          {modelCount !== undefined && metricCount !== undefined && companyCount !== undefined && (
            <> · <b>{modelCount}</b> 模型 · <b>{metricCount}</b> benchmark · <b>{companyCount}</b> labs</>
          )}
        </span>
      </div>
    </footer>
  );
}
