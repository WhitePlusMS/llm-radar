# DeepSeek 模型数据来源

本次为 DeepSeek 收集了 3 个旗舰模型：

- DeepSeek-V3（通用对话 / MoE）
- DeepSeek-R1（推理模型）
- DeepSeek-VL2（多模态视觉-语言模型）

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
| DeepSeek 品牌色 | 第三方品牌库 | DeepSeek Logo & Brand Assets (Brandfetch) | https://brandfetch.com/deep-seek.ai | - |

## 已收集的 benchmark 分数

分数全部取自上述 arXiv 技术报告中的官方表格，原始尺度为百分比（0-100）。

- **DeepSeek-V3**：MMLU-Pro 75.9、MMLU 88.5、GPQA 59.1、IF-Eval 86.1、DROP 91.6、SWE-bench Verified 42.0。
- **DeepSeek-R1**：MMLU-Pro 84.0、MMLU 90.8、GPQA Diamond 71.5、IF-Eval 83.3、DROP 92.2、SWE-bench Verified 49.2。
- **DeepSeek-VL2**：未收录上述通用 benchmark 分数。该论文主要报告视觉-语言 benchmark（MMMU、MMBench、MMStar、MathVista、AI2D、OCRBench、RefCOCO 等），不在当前通用 benchmark 集合中，因此 `scores` 留空。

## 未找到来源或无法收录的字段

- ** humaneval**：V3/R1 技术报告均使用 `HumanEval-Mul` 或未报告 chat/instruct 版本的 HumanEval，未给出标准 `HumanEval` 分数，因此未收录。
- **gsm8k / bbh / hellaswag / arc-c / winogrande / arena-elo**：V3/R1 论文未在 chat/instruct 模型评估中报告这些 benchmark；VL2 论文未报告文本通用 benchmark。
- **math-level-5**：论文报告的是 `MATH-500`，与 `math-level-5` 不是同一 benchmark，未做映射收录。
- **DeepSeek-VL2 context_window**：技术报告未明确说明，通过 HuggingFace 官方 `config.json` 中的 `language_config.max_position_embeddings` 确认为 4096 tokens，记为 `4k`。
