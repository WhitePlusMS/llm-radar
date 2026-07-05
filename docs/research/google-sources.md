# Google 模型来源调研

调研时间：2026-07-05

## 已纳入 ModelCard 的模型

### Gemini 2.5 Pro

- 发布方原始来源（论文/技术报告）：[Gemini 2.5: Pushing the Frontier with Advanced Reasoning, Multimodality, Long Context, and Next Generation Agentic Capabilities](https://arxiv.org/abs/2507.06261)
  - 发布日期：2025-07-07（arXiv 提交），首次公开预览为 2025-03-25
  - 对应 PDF 已下载：`docs/papers/google/gemini_v2_5_report.pdf`
  - 已提取分数：GPQA (diamond) 86.4%、SWE-bench Verified（multiple attempts）67.2%。
  - 原始来源中未报告（因此 scores 留空）：MMLU-Pro、MMLU、HumanEval、GSM8K、MATH-level-5、Arena-Elo、IFEval、BBH、DROP、HellaSwag、ARC-C、WinoGrande。
  - 未披露项：参数规模（total/active 均留空）。

- 发布方原始来源（博客）：[Gemini 2.5: Our most intelligent AI model](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-model-thinking-updates-march-2025/)
  - 发布日期：2025-03-25
  - 用于确认首次公开预览日期、1M 上下文、多模态输入与 reasoning 定位。

### Gemini 2.5 Flash

- 发布方原始来源（论文/技术报告）：[Gemini 2.5: Pushing the Frontier with Advanced Reasoning, Multimodality, Long Context, and Next Generation Agentic Capabilities](https://arxiv.org/abs/2507.06261)
  - 与 Gemini 2.5 Pro 共享同一份技术报告；Gemini 2.5 Flash 的成绩在 Table 3 中单独列出。
  - 已提取分数：GPQA (diamond) 82.8%、SWE-bench Verified（multiple attempts）60.3%。
  - 原始来源中未报告（因此 scores 留空）：MMLU-Pro、MMLU、HumanEval、GSM8K、MATH-level-5、Arena-Elo、IFEval、BBH、DROP、HellaSwag、ARC-C、WinoGrande。
  - 未披露项：参数规模（total/active 均留空）。

### Gemini 2.0 Flash

- 发布方原始来源（论文/技术报告）：[Gemini 2.5: Pushing the Frontier with Advanced Reasoning, Multimodality, Long Context, and Next Generation Agentic Capabilities](https://arxiv.org/abs/2507.06261)
  - 该报告在 Table 3 中同时给出了 Gemini 2.0 Flash 的评测结果。
  - 已提取分数：GPQA (diamond) 65.2%、SWE-bench Verified（multiple attempts）34.2%。
  - 原始来源中未报告（因此 scores 留空）：MMLU-Pro、MMLU、HumanEval、GSM8K、MATH-level-5、Arena-Elo、IFEval、BBH、DROP、HellaSwag、ARC-C、WinoGrande。
  - 未披露项：参数规模（total/active 均留空）。

- 发布方原始来源（博客）：[Introducing Gemini 2.0: our new AI model for the agentic era](https://blog.google/intl/en-nz/company-news/2024_12_introducing-gemini-20-our-new-ai-mode/)
  - 发布日期：2024-12-12
  - 用于确认发布日期、原生多模态输出（text/image/audio）、1M 上下文。

## 未纳入 ModelCard 的模型

### Gemini 2.0 Pro / Gemini 2.0 Flash-Lite

- 未纳入原因：本次任务要求 1-3 个旗舰模型，优先覆盖 2025 年的 reasoning 旗舰（Gemini 2.5 Pro）、2025 年的高效旗舰（Gemini 2.5 Flash）以及 2024 年的多模态输出旗舰（Gemini 2.0 Flash）。2.0 Pro 与 Flash-Lite 可作为后续补充。

## 说明

- 所有来源均为 Google / Google DeepMind 官方论文、技术报告或官方博客，未使用第三方复测/匿名来源。
- 原始技术报告 PDF 已下载到 `docs/papers/google/gemini_v2_5_report.pdf`。
- Google 未公开 Gemini 2.X 系列的具体参数量，因此 `parameters.total` 与 `parameters.active` 均置为 `null`。
