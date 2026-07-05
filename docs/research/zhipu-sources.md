# Zhipu (智谱 AI / Z.ai) 模型数据来源

## 已收集模型

### 1. GLM-4
- 原始论文（arXiv）：[ChatGLM: A Family of Large Language Models from GLM-130B to GLM-4 All Tools](https://arxiv.org/abs/2406.12793)
  - PDF 已下载：`docs/papers/zhipu/glm-4.pdf`
  - 报告发布日期：2024-06-18
  - 模型版本：GLM-4 (0520)
  - 关键表格：Table 2 — GLM-4 performance on academic benchmarks
  - 收录分数：MMLU 83.3、GSM8K 93.3、MATH 61.3、BBH 84.7、GPQA 39.9、HumanEval 78.5

### 2. GLM-4.5
- 原始论文（arXiv）：[GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models](https://arxiv.org/abs/2508.06471)
  - PDF 已下载：`docs/papers/zhipu/glm-4.5.pdf`
  - 报告发布日期：2025-08-08
- 官方博客：[GLM-4.5: Reasoning, Coding, and Agentic Abilities](https://z.ai/blog/glm-4.5)
  - 博客发布日期：2025-07-28
  - 关键信息：355B total / 32B active、MoE、128K context、hybrid reasoning、open-weights
  - 收录分数：MMLU-Pro 84.6、GPQA 79.1、SWE-bench Verified 64.2

### 3. GLM-5
- 原始论文（arXiv）：[GLM-5: from Vibe Coding to Agentic Engineering](https://arxiv.org/abs/2602.15763)
  - PDF 已下载：`docs/papers/zhipu/glm-5.pdf`
  - 报告发布日期：2026-02-17
  - 关键信息：744B total / 40B active、MoE、200K context
  - 收录分数：GPQA-Diamond 82.5、SWE-bench Verified 77.8
  - 备注：GLM-5 主结果表未报告 MMLU / GSM8K / MATH / HumanEval 等常见学术基准，因此这些字段留空。

## 未找到原始来源的基准/字段

- GLM-4 总参数量：官方技术报告未公开 GLM-4 旗舰版的总参数量与激活参数量，YAML 中标记为 `undisclosed`。
- GLM-4.5 / GLM-5 的 `arena-elo`：未在原始论文或官方博客中找到 LMSYS Arena ELO 分数，留空。
- GLM-5 的 `mmlu`、`mmlu-pro`、`gsm8k`、`math-level-5`、`humaneval`、`bbh` 等：原始论文主结果聚焦 ARC / agentic / coding 基准，未报告上述常见学术基准，留空。

## 研究说明

- 所有分数均来自 Zhipu 官方发布的论文或博客，未采用第三方复测或匿名来源。
- 论文 PDF 已缓存到 `docs/papers/zhipu/`，便于后续核对与离线查阅。
