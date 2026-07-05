# xAI 模型来源调研

调研时间：2026-07-05

## 已纳入 ModelCard 的模型

### Grok-2

- 发布方原始来源（博客）：[Grok-2 Beta Release](https://x.ai/news/grok-2)
  - 发布日期：2024-08-13
  - 获取方式：直接访问 `x.ai` 返回 403，通过 `https://r.jina.ai/http://x.ai/news/grok-2` 提取正文。
  - 已提取分数：MMLU-Pro 75.5、MMLU 87.5、GPQA 56.0、HumanEval 88.4、MATH 76.1。
  - 未披露项：参数规模、架构、上下文窗口（按 Grok-3 描述推断为 128k）。

### Grok-3

- 发布方原始来源（博客）：[Grok 3 Beta — The Age of Reasoning Agents](https://x.ai/news/grok-3)
  - 发布日期：2025-02-19
  - 获取方式：直接访问 `x.ai` 返回 403，通过 `https://r.jina.ai/http://x.ai/news/grok-3` 提取正文。
  - 已提取分数：MMLU-Pro 79.9、GPQA 75.4、Chatbot Arena Elo 1402。
  - 未披露项：参数规模、架构。

### Grok-4

- 发布方原始来源（博客）：[Grok 4](https://x.ai/news/grok-4)
  - 发布日期：2025-07-09
  - 获取方式：直接访问 `x.ai` 返回 403，通过 `https://r.jina.ai/http://x.ai/news/grok-4` 提取正文。
  - 官方给出的数字（如 ARC-AGI V2 15.9%、USAMO'25 61.9%、Humanity's Last Exam 50.7%）不在允许的 benchmark 集合内；GPQA / LiveCodeBench / AIME 等仅有图表标题，未在正文中给出具体数值，因此 scores 留空。
  - 未披露项：参数规模、架构。

## 未纳入 ModelCard 的模型

### Grok-4.1

- 发布方原始来源（博客）：[Grok 4.1](https://x.ai/news/grok-4-1)
  - 发布日期：2025-11-17
  - 未纳入原因：本次任务限制为 1-3 个旗舰模型，优先覆盖 2024、2025 两个年度的关键节点（Grok-2、Grok-3、Grok-4）。Grok-4.1 属于 Grok-4 的迭代优化版本，可作为后续补充。
  - 可参考的模型卡 PDF：[2025-11-17-grok-4-1-model-card.pdf](https://data.x.ai/2025-11-17-grok-4-1-model-card.pdf)

## 说明

- 所有来源均为 xAI 官方博客或官方 PDF，未使用第三方复测/匿名来源。
- `x.ai` 主站对直接抓取返回 403，因此借助 jina.ai 的文本提取服务读取原始页面内容；引用 URL 仍指向官方原始页面。
