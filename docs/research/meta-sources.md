# Meta 大模型数据来源记录

> 收集时间：2026-07-05
> 收集原则：仅采用发布方原始来源（Meta 官方 GitHub Model Card、官方博客、arXiv 技术报告），不收录第三方复测或匿名来源。

## 已确认模型

### 1. Llama 4 Maverick / Scout

- **发布日期**：2025-04-05
- **官方模型卡（Model Card）**：
  - https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md
  - 来源类型：model_card
  - 包含信息：模型架构（MoE）、参数规模（Scout 109B total / 17B active；Maverick 400B total / 17B active）、上下文长度（Scout 10M / Maverick 1M）、输入/输出模态、多语言支持、评测分数（MMLU-Pro、GPQA Diamond 等）。
- **官方发布博客**：
  - https://ai.meta.com/blog/llama-4-multimodal-intelligence/
  - 来源类型：blog
  - 说明：页面为 Meta 官方博客，但因前端渲染限制未做全文抓取；仅作为辅助来源引用。

### 2. Llama 3.1 405B Instruct

- **发布日期**：2024-07-23
- **官方模型卡（Model Card）**：
  - https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md
  - 来源类型：model_card
  - 包含信息：Dense 架构、405B 参数、128k 上下文、Instruct 变体评测分数（MMLU、MMLU-Pro、IFEval、GPQA、HumanEval、GSM8K、ARC-C 等）。
- **arXiv 技术报告**：
  - https://arxiv.org/abs/2407.21783
  - 论文标题：*The Llama 3 Herd of Models*
  - 来源类型：paper
  - 已下载 PDF：`docs/papers/meta/llama-3-herd-of-models.pdf`
- **官方发布博客**：
  - https://ai.meta.com/blog/meta-llama-3-1/
  - 来源类型：blog

## 未收录/未找到来源的模型

本次任务仅选取 Meta 在 2024–2026 年间最重要的 3 个旗舰模型：

- Llama 4 Maverick（2025，多模态旗舰）
- Llama 4 Scout（2025，长上下文旗舰）
- Llama 3.1 405B Instruct（2024，Dense 文本旗舰）

**Llama 3.3 70B Instruct** 虽于 2024-12-06 发布且性能接近 405B，但为避免超过“1-3 个模型”的任务上限，未单独建卡。其官方模型卡地址为：
https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/MODEL_CARD.md

其余如 Llama 4 Behemoth 仅处于训练/预览阶段，未开放权重，因此不收录。
