# MiniMax 模型来源汇总

## 2026-07-07 补充核验结论

- `MiniMax-M2`
  - `release_date` 已按官方 release notes 从论文日期 / 旧口径收敛为 `2025-09-11`
  - `context_window` 已按官方 docs 收敛为 `204,800`
- `MiniMax-M2.1`
  - 已补入官方主线模型卡
  - 发布日期按官方 release notes 收敛为 `2025-10-29`
  - 官方文本生成文档明确给出 `204,800` context 与 text/tool-call 定位
- `MiniMax-M2.5`
  - 已补入官方主线模型卡
  - 发布日期按官方 release notes 收敛为 `2026-01-23`
  - 官方文本生成文档明确给出 `204,800` context 与 text/tool-call 定位
- `MiniMax-M2.7`
  - 官方 release notes 和文本生成文档都已确认它是正式主线
  - 但当前官方 release notes 只暴露 `Mar. 2026`，没有精确到日；在 `release_date` 必填约束下，本轮先不建卡，不猜日期
- `MiniMax-Text-01 / MiniMax-VL-01`
  - 发布日期已按官方 release notes 从 `2025-01-14` 收敛为 `2025-01-15`

## 已确认的模型

### 1. MiniMax-M1

- **原始技术报告（arXiv）**：
  - 标题：MiniMax-M1: Scaling Test-Time Compute Efficiently with Lightning Attention
  - URL：https://arxiv.org/abs/2506.13585
  - 发布日期：2025-06-16
  - 说明：发布方原始来源。论文 Table 2 给出了 MiniMax-M1-80k 在 MMLU-Pro、GPQA-Diamond、SWE-bench Verified 等 benchmark 上的分数。

- **官方代码仓库 / 权重发布**：
  - URL：https://github.com/MiniMax-AI/MiniMax-M1
  - 说明：发布方原始来源，提供模型权重与部署说明。

- **PDF 已下载**：`docs/papers/minimax/minimax-m1.pdf`

### 2. MiniMax-M2

- **原始技术报告（arXiv）**：
  - 标题：The MiniMax-M2 Series: Mini Activations Unleashing Max Real-World Intelligence
  - URL：https://arxiv.org/abs/2605.26494
  - 发布日期：2026-05-26（论文日期；模型首次发布于 2025-10-27）
  - 说明：发布方原始来源。论文主要描述 M2 系列架构与 M2.7 性能，原始 M2 的 benchmark 表格主要见于 GitHub README。

- **官方代码仓库 / 权重发布**：
  - URL：https://github.com/MiniMax-AI/MiniMax-M2
  - 说明：发布方原始来源，README 中包含 Intelligence Benchmarks 与 Coding & Agentic Benchmarks 表格。

- **官方发布日期来源**：
  - URL：https://platform.minimax.io/docs/release-notes/models
  - 说明：MiniMax API 文档的 Release Notes，确认 MiniMax-M2 发布于 2025-09-11。

- **官方模型说明来源**：
  - URL：https://platform.minimax.io/docs/guides/text-generation
  - 说明：MiniMax 文本生成文档，确认 `MiniMax-M2` 为文本模型，`Context Window = 204,800`。

- **PDF 已下载**：`docs/papers/minimax/minimax-m2.pdf`

### 3. MiniMax-M3

- **原始技术报告（arXiv）**：
  - 标题：MiniMax Sparse Attention
  - URL：https://arxiv.org/abs/2606.13392
  - 发布日期：2026-06-11
  - 说明：发布方原始来源，但论文核心是 MiniMax Sparse Attention（MSA）机制，验证实验基于 109B 参数模型，**未给出完整 428B MiniMax-M3 的常规 benchmark 表格**。

- **官方代码仓库 / 权重发布**：
  - URL：https://github.com/MiniMax-AI/MiniMax-M3
  - 说明：发布方原始来源，确认模型规格（~428B total / ~23B active、1M context、native multimodal），但未列出具体 benchmark 数值。

- **官方发布日期来源**：
  - URL：https://platform.minimax.io/docs/release-notes/models
  - 说明：MiniMax API 文档的 Release Notes，确认 MiniMax-M3 发布于 2026-06-01。

### 4. MiniMax-M2.1

- **官方发布日期来源**：
  - URL：https://platform.minimax.io/docs/release-notes/models
  - 说明：MiniMax API 文档的 Release Notes，确认 MiniMax-M2.1 发布于 2025-10-29。

- **官方模型说明来源**：
  - URL：https://platform.minimax.io/docs/guides/text-generation
  - 说明：官方文本生成文档确认 `MiniMax-M2.1` 的 `Context Window = 204,800`，并说明其为文本/工具调用模型。

### 5. MiniMax-M2.5

- **官方发布日期来源**：
  - URL：https://platform.minimax.io/docs/release-notes/models
  - 说明：MiniMax API 文档的 Release Notes，确认 MiniMax-M2.5 发布于 2026-01-23。

- **官方模型说明来源**：
  - URL：https://platform.minimax.io/docs/guides/text-generation
  - 说明：官方文本生成文档确认 `MiniMax-M2.5` 的 `Context Window = 204,800`，并说明其为文本/工具调用模型。

- **第三方报道（引用 MiniMax 官方数据）**：
  - 标题：MiniMax M3 debuts, eclipsing GPT-5.5 and Gemini 3.1 Pro on key benchmark performance
  - URL：https://venturebeat.com/technology/minimax-m3-debuts-eclipsing-gpt-5-5-and-gemini-3-1-pro-on-key-benchmark-performance-for-just-5-10-of-the-cost
  - 发布日期：2026-06-01
  - 说明：VentureBeat 新闻稿，图注标注 "Credit: MiniMax"，引用了 MiniMax 官方 benchmark 图表中的数值（SWE-Bench Pro 59.0%、Terminal Bench 2.1 66.0%、BrowseComp 83.5、OSWorld-Verified 70.0%）。**这些数字为 vendor-reported，尚未经独立第三方复现验证**。

- **PDF 已下载**：`docs/papers/minimax/minimax-m3.pdf`

## 未找到原始来源的模型 / 信息

| 模型 / 信息 | 原因 |
|-------------|------|
| MiniMax-M3 的 MMLU-Pro / GPQA / HumanEval / MATH / GSM8K 等常规学术 benchmark | MiniMax-M3 的原始技术报告（MSA 论文）只验证稀疏注意力机制，未发布完整 428B 模型的常规 benchmark 表格；官方 GitHub README 也未列出这些分数。 |
| MiniMax-M2.1 / M2.5 的参数规模与 benchmark | 官方 docs 已确认模型存在、发布日期和 context window，但当前未稳定公开参数规模或本项目 metrics.yaml 同口径 benchmark，因此模型卡先只保留最小事实集。 |
| MiniMax-M2.7 的精确发布日期 | 官方 release notes 当前只给出 `Mar. 2026`，未精确到日；在 release_date 必填约束下，本轮不建卡。 |
| MiniMax-M3 的 SWE-Bench Pro 官方 leaderboard 链接 | 该分数仅在 VentureBeat 等第三方报道中出现，Scale AI 官方 SWE-Bench Pro leaderboard 未在搜索时找到对应条目。 |
| MiniMax 官方品牌色十六进制 | 未找到官方品牌指南；当前使用 LobeHub 维护的 MiniMax 彩色 SVG logo 中的橙色端点 `#FE603C` 作为近似品牌色。 |

## 备注

- 所有 YAML 文件中的 `scores` 仅包含原始来源明确报告且符合项目常见 benchmark key 集合的条目；其余报告分数在注释中说明。
- MiniMax-M3 的 benchmark 来源置信度低于 M1/M2，因其数值仅通过第三方新闻稿引用，建议待官方技术报告或独立 leaderboard 更新后再补充/修正。
