# Alibaba (Qwen) 大模型来源追溯

## 已收录模型

### 1. Qwen3
- **发布日期**：2025-04-29（官方博客发布日期）
- **原始来源**：
  - 论文：Qwen3 Technical Report
  - URL：https://arxiv.org/abs/2505.09388
  - 类型：arXiv 论文（发布方原始来源）
  - PDF 已下载：`docs/papers/alibaba/qwen3.pdf`
  - 官方博客：Qwen3: Think Deeper, Act Faster
  - URL：https://qwenlm.github.io/blog/qwen3/
  - 类型：官方博客（发布方原始来源）
- **说明**：论文 Table 3 报告了 Qwen3-235B-A22B-Base 的 benchmark 数据，包括 MMLU、MMLU-Pro、BBH、GPQA、GSM8K、MATH 等；Table 11/12 报告了指令微调后 thinking / non-thinking 双模式下的 IFEval、Arena-Hard、GPQA-Diamond 等分数。Qwen3 是 Qwen 系列首个统一整合 thinking 与 non-thinking 模式的模型，旗舰版为 MoE 架构（235B total / 22B active），上下文窗口 128K，权重以 Apache 2.0 开源。

### 2. Qwen2.5
- **发布日期**：2024-09-19（2024 云栖大会发布）
- **原始来源**：
  - 论文：Qwen2.5 Technical Report
  - URL：https://arxiv.org/abs/2412.15115
  - 类型：arXiv 论文（发布方原始来源）
  - PDF 已下载：`docs/papers/alibaba/qwen2.5.pdf`
  - 官方博客：Qwen2.5 Release Blog
  - URL：https://qwenlm.github.io/blog/qwen2.5/
  - 类型：官方博客（发布方原始来源）
- **说明**：论文 Table 2 报告了 Qwen2.5-72B-Base 的预训练基准数据，Table 6 报告了 Qwen2.5-72B-Instruct 的指令微调后数据，包括 MMLU-Pro、GPQA、MATH、GSM8K、HumanEval、IFEval、Arena-Hard 等。旗舰开源版为 Dense 架构 72B 参数，上下文窗口 128K，权重以 Apache 2.0 开源。

### 3. Qwen3.5-Omni
- **发布日期**：2026-03-30（Model Studio 上线日期，技术报告公开于 2026-04-17）
- **原始来源**：
  - 论文：Qwen3.5-Omni Technical Report
  - URL：https://arxiv.org/abs/2604.15804
  - 类型：arXiv 论文（发布方原始来源）
  - PDF 已下载：`docs/papers/alibaba/qwen3.5-omni.pdf`
- **说明**：论文摘要与 Table 4 报告了 Qwen3.5-Omni-Plus 的文本/多模态 benchmark 数据，包括 MMLU-Pro、GPQA、IFEval 等。模型采用 Thinker-Talker + Hybrid Attention MoE 架构，支持 256K 上下文，可理解文本/图像/音频/视频并生成文本与语音。论文仅披露“数百亿参数”，未给出精确总参数量与激活参数量，YAML 中标记为 `undisclosed`；目前仅通过阿里云 Model Studio API 提供，权重未开源，标记为 closed-weights、multimodal。

## 未找到来源的模型/分数

- **Qwen2.5-VL / Qwen2.5-Coder / Qwen2.5-Math**：本次任务聚焦 2024–2026 年旗舰 chat / reasoning / multimodal 模型，已用 Qwen2.5（chat）、Qwen3（reasoning）、Qwen3.5-Omni（multimodal）覆盖，未单独收录这些专用模型。
- **QwQ / QwQ-32B**：虽为 Alibaba 官方发布的推理模型，但本次选择以 Qwen3（已内置 thinking 模式）作为 reasoning 代表；QwQ 原始博客未报告完整学术 benchmark 表格，未单独收录。
- **swe-bench 分数**：三个模型的原始来源均未报告 SWE-bench 分数，未填写。
- **arena-elo 分数**：三个模型的原始来源均未报告 LMSYS Chatbot Arena ELO，未填写（Qwen3/Qwen2.5 仅报告 Arena-Hard，Qwen3.5-Omni 未报告）。
- **Qwen3.5-Omni 精确参数量**：官方技术报告仅描述为“scales to hundreds of billions of parameters”，未披露精确 total/active 参数，标记为 `undisclosed`。
- **Qwen3 的 ifeval 说明**：Table 11（thinking）为 83.4，Table 12（non-thinking）为 83.2；YAML 中采用 thinking 模式数值。
- **部分通用 benchmark（如 Qwen3 的 humaneval、drop、hellaswag、arc-c、winogrande；Qwen3.5-Omni 的 gsm8k、math-level-5、humaneval、bbh 等）**：原始来源未报告，未填写。

## 参考来源列表

1. https://arxiv.org/abs/2505.09388
2. https://arxiv.org/pdf/2505.09388.pdf
3. https://qwenlm.github.io/blog/qwen3/
4. https://arxiv.org/abs/2412.15115
5. https://arxiv.org/pdf/2412.15115.pdf
6. https://qwenlm.github.io/blog/qwen2.5/
7. https://arxiv.org/abs/2604.15804
8. https://arxiv.org/pdf/2604.15804.pdf
