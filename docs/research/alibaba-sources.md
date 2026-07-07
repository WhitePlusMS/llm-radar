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

### 4. Qwen3.5-397B-A17B
- **发布日期**：2026-02-16（Hugging Face model card 公布口径）
- **原始来源**：
  - Hugging Face model card：Qwen3.5-397B-A17B
  - URL：https://huggingface.co/Qwen/Qwen3.5-397B-A17B
  - 类型：官方 model card（发布方原始来源）
- **说明**：官方 model card 直接给出了 `397B total / 17B activated`、`262,144 natively and extensible up to 1,010,000 tokens`，并明确该开源权重对应托管版 `Qwen3.5-Plus`。同一来源的文本 benchmark 表可直接支撑 `MMLU-Pro 87.8`、`GPQA 88.4`、`IFEval 92.6`。

### 5. Qwen2.5-Omni-7B
- **发布日期**：2025-03-27（官方博客发布日期）
- **原始来源**：
  - 官方博客：Qwen2.5 Omni: See, Hear, Talk, Write, Do It All!
  - URL：https://qwenlm.github.io/blog/qwen2.5-omni/
  - 类型：官方博客（发布方原始来源）
  - Hugging Face model card：Qwen2.5-Omni-7B
  - URL：https://huggingface.co/Qwen/Qwen2.5-Omni-7B
  - 类型：官方 model card（发布方原始来源）
- **说明**：官方 model card 的文本评测表可直接支撑 `MMLU-Pro 47.0`、`GPQA 30.8`、`GSM8K 88.7`、`HumanEval 78.7`。README 同时明确它是端到端 `text/image/audio/video -> text/audio` 的 Omni 主线开源模型；但当前没有把 `architecture` 与单一 `context_window` 再继续写死，因为官方公开表述没有给出足够稳定的单值口径。

### 6. Qwen3.6-35B-A3B
- **发布日期**：2026-04-15（Hugging Face metadata API `createdAt`）
- **原始来源**：
  - 官方博客：Qwen3.6-35B-A3B: Agentic Coding Power, Now Open to All
  - URL：https://qwen.ai/blog?id=qwen3.6-35b-a3b
  - 类型：官方博客（发布方原始来源）
  - Hugging Face model card：Qwen3.6-35B-A3B
  - URL：https://huggingface.co/Qwen/Qwen3.6-35B-A3B
  - 类型：官方 model card（发布方原始来源）
  - Hugging Face metadata API：Qwen3.6-35B-A3B
  - URL：https://huggingface.co/api/models/Qwen/Qwen3.6-35B-A3B
  - 类型：官方 metadata API（发布时间口径）
- **说明**：官方 model card 直接给出了 `35B in total and 3B activated`、`262,144 natively and extensible up to 1,010,000 tokens`，并明确它是 `text/image/video -> text` 的 MoE 主线模型。当前已把能稳定从官方表格直接读到的 `MMLU-Pro 85.2`、`GPQA 85.5`、`SWE-bench Verified 73.4` 写回模型卡；没有再硬写 README 中当前不够稳定的其它指标列。

### 7. Qwen3.5-122B-A10B
- **发布日期**：2026-02-24（Hugging Face metadata API `createdAt`）
- **原始来源**：
  - Hugging Face model card：Qwen3.5-122B-A10B
  - URL：https://huggingface.co/Qwen/Qwen3.5-122B-A10B
  - 类型：官方 model card（发布方原始来源）
  - Hugging Face metadata API：Qwen3.5-122B-A10B
  - URL：https://huggingface.co/api/models/Qwen/Qwen3.5-122B-A10B
  - 类型：官方 metadata API（发布时间口径）
- **说明**：官方 model card 直接给出了 `122B total / 10B activated`、`262,144 natively and extensible up to 1,010,000 tokens`，并且文本 benchmark 表可直接支撑 `MMLU-Pro 86.7`、`GPQA Diamond 86.6`、`IFEval 93.4`、`SWE-bench Verified 72.0`。这是一条可以稳妥写回的官方主线开源模型。

### 8. Qwen3.5-35B-A3B
- **发布日期**：2026-02-24（Hugging Face metadata API `createdAt`）
- **原始来源**：
  - Hugging Face model card：Qwen3.5-35B-A3B
  - URL：https://huggingface.co/Qwen/Qwen3.5-35B-A3B
  - 类型：官方 model card（发布方原始来源）
  - Hugging Face metadata API：Qwen3.5-35B-A3B
  - URL：https://huggingface.co/api/models/Qwen/Qwen3.5-35B-A3B
  - 类型：官方 metadata API（发布时间口径）
- **说明**：官方 model card 直接给出了 `35B total / 3B activated`、`262,144 natively and extensible up to 1,010,000 tokens`，并可直接支撑 `MMLU-Pro 85.3`、`GPQA Diamond 84.2`、`IFEval 91.9`、`SWE-bench Verified 69.2`。同一来源还明确指出托管版 `Qwen3.5-Flash` 对应这条开源主线。

### 9. Qwen3-Omni-30B-A3B
- **发布日期**：2025-09-22（Qwen3-Omni GitHub README 发布记录）
- **原始来源**：
  - GitHub 仓库：Qwen3-Omni
  - URL：https://github.com/QwenLM/Qwen3-Omni
  - 类型：官方代码仓库（发布方原始来源）
  - Hugging Face model card：Qwen3-Omni-30B-A3B-Instruct
  - URL：https://huggingface.co/Qwen/Qwen3-Omni-30B-A3B-Instruct
  - 类型：官方 model card（发布方原始来源）
  - Hugging Face metadata API：Qwen3-Omni-30B-A3B-Instruct
  - URL：https://huggingface.co/api/models/Qwen/Qwen3-Omni-30B-A3B-Instruct
  - 类型：官方 metadata API（补充公开时间）
- **说明**：官方 README 明确这条主线是 `MoE-based Thinker-Talker` 架构，并给出了 `Qwen3-Omni-30B-A3B-Instruct / Thinking / Captioner` 三条官方变体，其中 Instruct 为 `audio, video, and text input -> audio and text output`。它是官方主线模型，不是 distill 或派生版；但官方 benchmark 主要覆盖音频、视频和音视频交互，不属于当前 `metrics.yaml` 的文本指标集合，因此继续保留空 `scores` 更稳妥。

### 10. Qwen2-VL-72B
- **发布日期**：2024-09-17（Hugging Face metadata API `createdAt`）
- **原始来源**：
  - Hugging Face model card：Qwen2-VL-72B-Instruct
  - URL：https://huggingface.co/Qwen/Qwen2-VL-72B-Instruct
  - 类型：官方 model card（发布方原始来源）
  - Hugging Face metadata API：Qwen2-VL-72B-Instruct
  - URL：https://huggingface.co/api/models/Qwen/Qwen2-VL-72B-Instruct
  - 类型：官方 metadata API（发布时间口径）
- **说明**：官方 model card 明确该仓库就是 `72B` 指令版，支持 `text/image/video -> text`，并且在 limitation 中直接写明“当前不理解视频中的 audio”。同一来源还能直接支撑 `MMMU 64.5`、`DocVQA 96.5`、`RealWorldQA 77.8`、`MMStar 68.3`、`MathVista 70.5`、`MVBench 73.6` 等视觉/视频 benchmark；但这些分数不在当前项目 `metrics.yaml` 的文本指标集合内，因此 `scores` 继续留空。

## 未找到来源的模型/分数

- **Qwen2.5-Coder / Qwen2.5-Math / Qwen2.5-1M 系列**：按用户当前口径，不再优先保留那些没有官方评测参数支撑、只是补数量的小模型/专用分支；当前仍以主线通用模型为主。
- **Qwen2.5-VL**：官方 Hugging Face model card 已能直接支撑 `72B` 旗舰变体、`32,768` 默认上下文以及大量视觉/视频/Agent benchmark；但这些分数大多不在当前项目 `metrics.yaml` 的通用文本集合内，所以继续保留空 `scores`。
- **Qwen2-VL-72B**：官方确实给了 `MMMU / DocVQA / RealWorldQA / MMStar / MathVista / MVBench` 等 benchmark，但它们是视觉/视频能力分数，不适合强行映射到当前通用文本指标集合，因此新增模型卡后仍保留空 `scores`。
- **Qwen3-Omni-30B-A3B**：官方 benchmark 主要覆盖音频、视频和音视频理解/交互能力，不属于当前 `metrics.yaml` 的 featured 文本 benchmark；因此保留空 `scores`，并在模型卡直接写明原因。
- **Qwen2.5-1M 系列 benchmark**：官方博客强调长上下文能力与部署方法，未给出本项目 `metrics.yaml` 同口径 benchmark 分数。
- **QwQ-32B**：官方 Hugging Face model card 已直接支撑 `32.5B` 参数和 `131,072` context；但官方可见 benchmark 主要仍以图片或博客展示为主，本轮没有继续把图像表 OCR 成项目的 `metrics.yaml` 结构，因此 `scores` 继续留空。
- **Qwen3.6-35B-A3B 的 IFEval**：当前保留的一手来源里，已经稳定写回了 `MMLU-Pro / GPQA / SWE-bench`；但 `IFEval` 在当前采信页面上的口径不如前几项直接，所以没有继续硬写。
- **Qwen2.5 / Qwen3 通用家族的 swe-bench 分数**：`Qwen2.5` 与 `Qwen3` 技术报告本身仍没有给出可以直接落到当前 generic family 卡片的 SWE-bench 值；不过 `Qwen3.5-122B-A10B`、`Qwen3.5-35B-A3B`、`Qwen3.6-35B-A3B` 的官方 model card 已经给出各自的 `SWE-bench Verified`，因此这些具体官方变体已经单独补入。
- **arena-elo 分数**：当前保留来源未报告 LMSYS Chatbot Arena ELO；Qwen3 / Qwen2.5 仅报告 Arena-Hard，Qwen3.5-Omni 未报告。
- **Qwen3.5-Omni 精确参数量**：官方技术报告仅描述为“scales to hundreds of billions of parameters”，未披露精确 total/active 参数，标记为 `undisclosed`。
- **Qwen3 的 ifeval 说明**：Table 11（thinking）为 83.4，Table 12（non-thinking）为 83.2；YAML 中采用 thinking 模式数值。
- **Qwen3 小中模型分数落地策略**：`Qwen3-8B / 14B / 32B / 30B-A3B` 本轮仅写入不易混淆的 `mmlu-pro / gpqa / bbh / gsm8k`（来自 Base 表）与 `ifeval`（来自 thinking 表，并通过 `note` 标明口径）。未把 `MATH` 或 `MATH-500` 强行映射到 `math-level-5`。
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
9. https://qwenlm.github.io/blog/qwen2.5-1m/
10. https://huggingface.co/Qwen/Qwen3.5-397B-A17B
11. https://qwenlm.github.io/blog/qwen2.5-omni/
12. https://huggingface.co/Qwen/Qwen2.5-Omni-7B
13. https://huggingface.co/Qwen/QwQ-32B
14. https://huggingface.co/Qwen/Qwen2.5-VL-72B-Instruct
15. https://qwen.ai/blog?id=qwen3.6-35b-a3b
16. https://huggingface.co/Qwen/Qwen3.6-35B-A3B
17. https://huggingface.co/api/models/Qwen/Qwen3.6-35B-A3B
18. https://huggingface.co/Qwen/Qwen3.5-122B-A10B
19. https://huggingface.co/api/models/Qwen/Qwen3.5-122B-A10B
20. https://huggingface.co/Qwen/Qwen3.5-35B-A3B
21. https://huggingface.co/api/models/Qwen/Qwen3.5-35B-A3B
22. https://github.com/QwenLM/Qwen3-Omni
23. https://huggingface.co/Qwen/Qwen3-Omni-30B-A3B-Instruct
24. https://huggingface.co/api/models/Qwen/Qwen3-Omni-30B-A3B-Instruct
25. https://huggingface.co/Qwen/Qwen2-VL-72B-Instruct
26. https://huggingface.co/api/models/Qwen/Qwen2-VL-72B-Instruct
