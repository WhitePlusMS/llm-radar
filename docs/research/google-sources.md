# Google 模型来源调研

调研时间：2026-07-05

## 2026-07-07 补充核验结论

- `Gemini 3 Pro Preview`
  - 已补入官方主线预览模型卡。
  - 发布日期按官方 lifecycle 页收敛为 `2025-11-18`。
  - 官方模型页明确给出 `1M` context、`text/image/audio/video/pdf -> text`。
- `Gemini 2.0 Flash`
  - `modalities.output` 已收敛为 `[text]`，不再沿用早期更宽的原生多模态输出表述。
  - `architecture: MoE` 已删除，因为 Google 官方模型页 / 生命周期页没有直接披露这一字段。
  - 补入 `Gemini deprecations` 作为发布日期和生命周期来源。
- `Gemini 2.5 Pro`
  - 若模型卡表示稳定 API 模型 `gemini-2.5-pro`，发布日期应按 lifecycle 页收敛为 `2025-06-17`，而不是首次公开预览 `2025-03-25`。
  - `architecture: MoE` 已删除，因为缺少官方直接披露。
- `Gemini 2.5 Flash`
  - 发布日期按稳定 API 模型口径收敛为 `2025-06-17`。
  - `architecture: MoE` 已删除，因为缺少官方直接披露。
- `Gemini 2.5 Flash-Lite`
  - 发布日期收敛为 `2025-07-22`，与 lifecycle 页中的稳定模型口径一致。
- `Gemini 3.1 Pro Preview`
  - 补入 `Gemini deprecations` 与 Google DeepMind 模型页来源。
  - 新增官方分数：`gpqa=94.3`、`swe-bench=80.6`。
- `Gemini 3.5 Flash`
  - 补入 `Gemini deprecations` 与 Google DeepMind 模型页来源。
- `Gemini 2.5 Pro`、`Gemini 2.5 Flash-Lite`、`Gemini 3 Flash Preview`、`Gemini 3.1 Pro Preview`、`Gemini 3.5 Flash`
  - 已把官方模型页明确披露的 `PDF` 输入能力补回 `modalities.input`。
- `Gemini 2.5 Flash`
  - 官方模型页当前列的是 `text/images/video/audio -> text`，没有把 `PDF` 列入 Inputs；因此本轮不补 `pdf`，避免把邻近型号的能力借填过来。
- 研究文档中的“技术报告 PDF 已下载到本地”表述已经过期，不能再当成当前仓库事实使用；现阶段应以官方页面与 arXiv 链接为准。

## 已纳入 ModelCard 的模型

### Gemini 2.5 Pro

- 发布方原始来源（论文/技术报告）：[Gemini 2.5: Pushing the Frontier with Advanced Reasoning, Multimodality, Long Context, and Next Generation Agentic Capabilities](https://arxiv.org/abs/2507.06261)
  - 发布日期：2025-07-07（arXiv 提交），首次公开预览为 2025-03-25
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

### Gemini 3.1 Flash-Lite

- 发布方原始来源（官方模型文档）：[Gemini 3.1 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite)
  - 用于确认 `1M` context、multimodal input / text output。
- 发布方原始来源（官方弃用/生命周期页）：[Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations)
  - 用于确认 `Release date = 2026-05-07`。

### Gemini 3 Pro Preview

- 发布方原始来源（官方模型文档）：[Gemini 3 Pro Preview](https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-preview)
  - 用于确认 `1M` context、`text/image/audio/video/pdf -> text`。
- 发布方原始来源（官方弃用/生命周期页）：[Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations)
  - 用于确认 `Release date = 2025-11-18`。

### Gemini 3 Flash Preview

- 发布方原始来源（官方模型文档）：[Gemini 3 Flash Preview](https://ai.google.dev/gemini-api/docs/models/gemini-3-flash-preview)
  - 用于确认 `1M` context、multimodal input / text output。
- 发布方原始来源（官方弃用/生命周期页）：[Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations)
  - 用于确认 `Release date = 2025-12-17`。

## 未纳入 ModelCard 的模型

### Gemini 2.0 Flash / Gemini 2.0 Flash-Lite 生命周期

- Google 官方弃用页：
  - https://ai.google.dev/gemini-api/docs/deprecations
- 说明：
  - 应在研究文档中明确区分“当前主线模型”和“已 deprecated / shut down 模型”。
  - `Gemini 2.0 Flash`、`Gemini 2.0 Flash-Lite` 不应再被理解为 Google 当前主线。
  - 该页还可用于确认生命周期时间点：
    - `Gemini 2.0 Flash`：Release `2025-02-05`，Deprecated `2026-02-18`，Shut down `2026-06-01`
    - `Gemini 2.0 Flash-Lite`：Release `2025-02-25`，Deprecated `2026-02-18`，Shut down `2026-06-01`

## 说明

- 所有来源均为 Google / Google DeepMind 官方论文、技术报告或官方博客，未使用第三方复测/匿名来源。
- Google 未公开 Gemini 2.X 系列的具体参数量，因此 `parameters.total` 与 `parameters.active` 均置为 `null`。
- 研究文档当前与仓库状态的已知不一致：本文旧版曾写 `Gemini 2.0 Flash-Lite` “未纳入”，但仓库现已存在该模型文件；后续应继续按仓库现状清理文档口径。
- 本轮研究确认 `Gemini 3.1 Flash-Lite` 与 `Gemini 3 Flash Preview` 都有足够硬的官方发布日期证据；其中 `Gemini 3 Flash Preview` 已收录，`Gemini 3.1 Flash-Lite` 因缺少官方评测参数且属于轻量分支，按用户最新口径不再保留在模型库中。
- 本轮进一步确认 `Gemini 3 Pro Preview` 也属于官方主线预览模型，虽然暂未落官方 benchmark 到当前 `metrics.yaml`，但作为同代主线预览已补入。
- `gemini-3.5-flash` 是 Google 官方正名型号，不应误删；但其发布日期应按官方生命周期页收敛为 `2026-05-19`。
