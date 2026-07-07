# DeepSeek 模型数据来源

本次为 DeepSeek 收集了 3 个旗舰模型：

- DeepSeek-V3（通用对话 / MoE）
- DeepSeek-R1（推理模型）
- DeepSeek-VL2（多模态视觉-语言模型）

后续补充了 DeepSeek 主线更新版本：

- DeepSeek-V3-0324
- DeepSeek-V3.2

本轮按用户最新口径进一步收紧：

- 删除 `DeepSeek-R1-Zero`
  - 原因：这是官方论文中的中间研究版本，不是当前对外主推的正式主线型号；
  - 且官方来源没有给出可稳定映射到本项目 `metrics.yaml` 的 featured benchmark 集合，继续保留会放大“官方存在但数据不可落”的噪音。

所有信息均来自发布方原始来源（arXiv 技术报告、官方 GitHub、官方新闻页）。

## 原始来源 URL

| 模型 | 来源类型 | 标题 | URL | 本地 PDF |
|------|----------|------|-----|----------|
| DeepSeek-V3 | arXiv 论文 | DeepSeek-V3 Technical Report | https://arxiv.org/abs/2412.19437 | `docs/papers/deepseek/deepseek-v3.pdf` |
| DeepSeek-R1 | arXiv 论文 | DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning | https://arxiv.org/abs/2501.12948 | `docs/papers/deepseek/deepseek-r1.pdf` |
| DeepSeek-VL2 | arXiv 论文 | DeepSeek-VL2: Mixture-of-Experts Vision-Language Models for Advanced Multimodal Understanding | https://arxiv.org/abs/2412.10302 | `docs/papers/deepseek/deepseek-vl2.pdf` |
| DeepSeek-V3 发布页 | 官方新闻 | Introducing DeepSeek-V3 | https://api-docs.deepseek.com/news/news1226 | - |
| DeepSeek-R1 发布页 | 官方新闻 | DeepSeek-R1 Release | https://api-docs.deepseek.com/news/news250120 | - |
| DeepSeek-V3 GitHub | 官方代码/权重 | deepseek-ai/DeepSeek-V3 | https://github.com/deepseek-ai/DeepSeek-V3 | - |
| DeepSeek-R1 GitHub | 官方代码/权重 | deepseek-ai/DeepSeek-R1 | https://github.com/deepseek-ai/DeepSeek-R1 | - |
| DeepSeek-VL2 GitHub | 官方代码/权重 | deepseek-ai/DeepSeek-VL2 | https://github.com/deepseek-ai/DeepSeek-VL2 | - |
| DeepSeek-V3-0324 | 官方模型卡 | DeepSeek-V3-0324 | https://huggingface.co/deepseek-ai/DeepSeek-V3-0324 | - |
| DeepSeek-V3.2 | 官方模型卡 | DeepSeek-V3.2 | https://huggingface.co/deepseek-ai/DeepSeek-V3.2 | - |
| DeepSeek-V3.2 论文 | 官方论文 | DeepSeek-V3.2 Technical Paper | https://huggingface.co/deepseek-ai/DeepSeek-V3.2/resolve/main/assets/paper.pdf | - |

## 已收集的 benchmark 分数

分数全部取自上述 arXiv 技术报告中的官方表格，原始尺度为百分比（0-100）。

- **DeepSeek-V3**：MMLU-Pro 75.9、MMLU 88.5、GPQA 59.1、IF-Eval 86.1、DROP 91.6、SWE-bench Verified 42.0。
- **DeepSeek-R1**：MMLU-Pro 84.0、MMLU 90.8、GPQA Diamond 71.5、IF-Eval 83.3、DROP 92.2、SWE-bench Verified 49.2。
- **DeepSeek-VL2**：未收录上述通用 benchmark 分数。该论文主要报告视觉-语言 benchmark（MMMU、MMBench、MMStar、MathVista、AI2D、OCRBench、RefCOCO 等），不在当前通用 benchmark 集合中，因此 `scores` 留空。
- **DeepSeek-R1-Zero**：官方论文虽明确给出了 `671B / 37B / 128K`，但它是 R1 训练流程中的研究中间版；按用户当前“只保留正式官方主线、且优先保留有可落地评测参数的型号”口径，本轮已从仓库移除。
- **DeepSeek-V3-0324 / DeepSeek-V3.2**：本轮只先落地主线版本元数据；若后续官方论文或新闻页给出可直接映射到 `metrics.yaml` 的 benchmark，再补 scores。
- **DeepSeek-V2**：官方 GitHub README 的 `Base Model Standard Benchmark` 表可直接确认 `MMLU 78.5`、`HumanEval 48.8`、`GSM8K 79.2`、`BBH 78.9`。
- **DeepSeek-V2.5**：官方 Hugging Face 模型卡可直接确认 `MMLU 80.6 (5-shot)`、`HumanEval 89.0 (HumanEval python)`、`SWE-verified 16.8`。
- **DeepSeek-V3.1**：官方 Hugging Face 页面可直接确认 `MMLU-Pro 84.4`、`GPQA Diamond 74.9`、`SWE Verified 57.0`。
- **DeepSeek-V3.2**：官方 Hugging Face 页面与官方论文可直接确认 `MMLU-Pro 85.0`、`GPQA Diamond 82.4`、`SWE Verified 70.0`。
- **DeepSeek-V3-0324**：官方 Hugging Face 页面可直接确认 `MMLU-Pro 81.2`、`GPQA Diamond 68.4`、`MATH-500 92.4`、`SWE-bench Verified 49.2`。
- **DeepSeek-R1-0528**：官方 Hugging Face 页面可直接确认 `MMLU-Pro 85.0`、`GPQA Diamond 73.3`。

## 未找到来源或无法收录的字段

- ** humaneval**：V3/R1 技术报告均使用 `HumanEval-Mul` 或未报告 chat/instruct 版本的 HumanEval，未给出标准 `HumanEval` 分数，因此未收录。
- **gsm8k / bbh / hellaswag / arc-c / winogrande / arena-elo**：V3/R1 论文未在 chat/instruct 模型评估中报告这些 benchmark；VL2 论文未报告文本通用 benchmark。
- **math-level-5**：论文报告的是 `MATH-500`，与 `math-level-5` 不是同一 benchmark，未做映射收录。
- **DeepSeek-VL2 context_window**：官方 GitHub README 已明确给出 `4096 sequence length`，因此收敛为 `4k`。
- **收录策略调整**：按用户新口径，不再保留无官方评测参数支撑的小模型/Distill 型号；优先保留主线正式官方模型。
- **DeepSeek-R1-Zero 收录策略**：虽然它不是 distill，也不是第三方模型，但它属于论文里的中间研究版本，不是正式对外主推的稳定主线型号；在当前口径下不再继续保留。
- **Qwen3 小中模型分数结论**：虽然已找到官方技术报告中的 `base / thinking / non-thinking` 表格，但当前模型卡命名尚未与这三种模式一一对应，因此本轮未直接写回，避免把不同口径混填进同一模型卡。
- **DeepSeek-Coder-V2 分数结论**：官方 README 的表格主要按 `Instruct / Base / Lite` 等具体变体给分，当前无后缀 `DeepSeek-Coder-V2` 模型卡尚不适合直接混填这些分数，因此继续保持空分数。
