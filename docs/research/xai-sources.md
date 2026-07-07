# xAI 模型来源调研

调研时间：2026-07-05

## 2026-07-07 补充核验结论

- `Grok-2` / `Grok-2 mini`
  - 已去掉通过 `Grok-3` “8x context window” 反推出来的 `128k` context。
  - 模态已经收敛为 `text/image -> text`，不再把视觉理解能力写成图像输出。
- `Grok-3` / `Grok-3 mini`
  - `architecture: unknown` 已删除；官方没有披露就不保留占位值。
- `Grok 4.3`
  - 现有 YAML 已改为直接采用 `https://docs.x.ai/developers/models/grok-4.3` 作为官方来源。
  - 官方 docs 明确是 `text/image -> text`，因此不再保留纯文本输入写法。
  - 当前 `release_date` 收敛为 `2026-06-17`：这是目前能稳定定位到的最硬 dated 官方公开可用公告（Amazon Bedrock GA）；它不一定等同于更早的内测或灰度时间。
- `Grok Build 0.1`
  - 现有 YAML 已改为直接采用 `https://docs.x.ai/developers/models/grok-build-0.1` 作为官方来源。
  - 官方 docs 明确是 `text/image -> text`，因此补回 `multimodal`。
  - 发布日期收敛为 `2026-05-19`：优先采用官方 release notes 中 `grok-build-0.1` 这个具体 model slug 的上架时间，而不是更泛的产品博客发布时间。
- `Grok-4.1`
  - 官方确实已有发布页和 model card，但当前仓库的 xAI 研究文档仍未把它记入“待评估新模型”；后续可以继续核它是否符合用户当前“只保留官方主线模型”的口径。

## 已纳入 ModelCard 的模型

### Grok-2

- 发布方原始来源（博客）：[Grok-2 Beta Release](https://x.ai/news/grok-2)
  - 发布日期：2024-08-13
  - 获取方式：直接访问 `x.ai` 返回 403，通过 `https://r.jina.ai/http://x.ai/news/grok-2` 提取正文。
  - 已提取分数：MMLU-Pro 75.5、MMLU 87.5、GPQA 56.0、HumanEval 88.4、MATH 76.1。
  - 模态收敛：官方发布页强调的是 text/vision understanding，没有明确给出图像输出能力，因此 YAML 收敛为 `text/image -> text`。
  - 未披露项：参数规模、架构、上下文窗口。

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
  - 已修正：模态按官方发布页收敛为 `text/image -> text`，不再写入音频输入输出。
  - 未披露项：参数规模、架构。

### Grok Build 0.1

- 发布方原始来源（官方模型文档）：[Grok Build 0.1](https://docs.x.ai/developers/models/grok-build-0.1)
  - 用于确认 `text/image -> text`、`256k context` 与 agentic/coding 定位。
- 发布方原始来源（官方 release notes）：[Release Notes](https://docs.x.ai/developers/release-notes)
  - 用于确认 `grok-build-0.1` 这个具体 model slug 的上线时间为 `2026-05-19`。
- 发布方原始来源（博客）：[Introducing Grok Build](https://x.ai/news/grok-build-cli)
  - 用于确认产品发布背景与定位。

## 未纳入 ModelCard 的模型

### Grok-4.1

- 发布方原始来源（博客）：[Grok 4.1](https://x.ai/news/grok-4-1)
  - 发布日期：2025-11-17
  - 当前状态：已确认为官方存在的主线迭代型号，但仍待进一步核定 API 侧稳定字段（如 context、模态、可安全映射的 benchmark）后再决定是否入库。
  - 可参考的模型卡 PDF：[2025-11-17-grok-4-1-model-card.pdf](https://data.x.ai/2025-11-17-grok-4-1-model-card.pdf)

## 说明

- 所有来源均为 xAI 官方博客或官方 PDF，未使用第三方复测/匿名来源。
- `x.ai` 主站对直接抓取返回 403，因此借助 jina.ai 的文本提取服务读取原始页面内容；引用 URL 仍指向官方原始页面。
- 先前仓库里对 `Grok-2` / `Grok-2 mini` 的 `128k` context 是根据 `Grok-3` “8x context window” 的说法反推出来的；这不属于官方直接披露，因此已移除，不再保留推断值。
