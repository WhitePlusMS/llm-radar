# Tencent 大模型来源追溯

## 已收录模型

### 1. Hunyuan-Large
- **发布日期**：2024-11-04
- **原始来源**：
  - 论文：Hunyuan-Large: An Open-Source MoE Model with 52 Billion Activated Parameters by Tencent
  - URL：https://arxiv.org/abs/2411.02265
  - 类型：arXiv 论文（发布方原始来源）
- **说明**：该论文为 Tencent Hunyuan 团队官方发布，论文中 Table 3 提供了预训练模型（pre-trained）的完整 benchmark 数据，包括 MMLU、MMLU-Pro、BBH、DROP、HellaSwag、ARC-C、WinoGrande、MATH、GSM8K、HumanEval 等。论文同时发布了代码与 checkpoint，因此标记为 open-weights。

### 2. Hunyuan-TurboS
- **发布日期**：2025-05-21（技术报告公开日期）
- **原始来源**：
  - 论文：Hunyuan-TurboS: Advancing Large Language Models through Mamba-Transformer Synergy and Adaptive Chain-of-Thought
  - URL：https://arxiv.org/abs/2505.15431
  - 类型：arXiv 论文（发布方原始来源）
- **说明**：该论文为 Tencent Hunyuan 团队官方发布，论文中 Table 2 提供了预训练模型（pre-trained）的 benchmark 数据，包括 MMLU、MMLU-Pro、BBH、DROP、HellaSwag、ARC-C、WinoGrande、MATH、GSM8K 等；摘要中给出了 LMSYS Chatbot Arena 分数 1356。模型采用 Hybrid Transformer-Mamba MoE 架构，总参数量 560B、激活参数量 56B，上下文窗口 256K。目前未找到公开的权重下载入口，标记为 closed-weights。

### 3. Hunyuan-T1
- **发布日期**：2025-03-24（官方正式版发布日期，来源为新闻与 GitHub README 时间推断）
- **原始来源**：
  - 官方博客/README：混元-T1：强化学习驱动，业内首个超大规模混合Mamba推理模型正式发布
  - URL：https://github.com/Tencent/llm.hunyuan.T1/blob/main/README.md
  - 类型：官方 GitHub README / 博客（发布方原始来源）
- **说明**：Hunyuan-T1 是基于 Hunyuan-TurboS 基座训练的大型推理模型，官方 README 中给出了 MMLU-Pro 87.2、GPQA-diamond 69.3、MATH-500 96.2 等分数。目前未找到 arXiv 论文或 Hugging Face 权重仓库，标记为 closed-weights、reasoning。

## 未找到来源的模型/分数

- **Hunyuan 3.0**：2026 年 3 月腾讯财报会上提到将于 2026 年 4 月发布，目前尚未正式发布，无原始技术报告或论文，因此未收录。
- **swe-bench 分数**：三个模型均未在原始来源中报告 SWE-bench 分数，故未填写。
- **Hunyuan-TurboS / Hunyuan-T1 的 HumanEval 分数**：TurboS 论文 Table 2 未包含 HumanEval；T1 官方 README 未报告 HumanEval，故未填写。
- **Hunyuan-T1 的 ifeval、bbh、drop、hellaswag、arc-c、winogrande、gsm8k 等分数**：官方 README 未报告这些 benchmark 分数，故未填写。

## 参考来源列表

1. https://arxiv.org/abs/2411.02265
2. https://arxiv.org/pdf/2411.02265.pdf
3. https://arxiv.org/abs/2505.15431
4. https://arxiv.org/pdf/2505.15431.pdf
5. https://github.com/Tencent/llm.hunyuan.T1/blob/main/README.md
6. https://news.qq.com/rain/a/20250523A012CP00
7. https://cloud.tencent.com/developer/article/2524579
