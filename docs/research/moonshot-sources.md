# Moonshot AI 模型数据来源

## 已收录模型

## 2026-07-07 补充核验结论

- `Kimi K2`
  - 参数已按官方 GitHub README 收敛为 `1T total / 32B active / 128K context`。
  - 不再保留此前偏大的 `1.04T / 32.6B` 写法。
- `Kimi K2.5`
  - `parameters.total` 已按官方 Hugging Face / 官方资料口径收敛为 `1T`，不再保留 `1.04T`。
- `Kimi API` 当前平台主线
  - 官方平台模型总览与快速开始页已经明确：
    - `kimi-k2.6` 是当前通用主线
    - `kimi-k2.7-code` 是当前代码主线
  - 但本轮尚未从官方页面稳定定位到可直接落库的发布日期，因此先不新建模型卡，避免为满足 `release_date` 强校验而硬猜日期。

### 1. Kimi K1.5

- **原始论文**：Kimi K1.5: Scaling Reinforcement Learning with LLMs
  - URL: https://arxiv.org/abs/2501.12599
  - 类型：arXiv 技术报告
  - 包含信息：模型训练方法、长上下文 RL、多模态数据配方、short-CoT / long-CoT 评测分数（MMLU、IF-Eval、MATH-500、HumanEval-Mul、LiveCodeBench、MMMU、MathVista 等）。
  - PDF 本地副本：`docs/papers/moonshot/kimi-k1.5.pdf`

### 2. Kimi K2

- **原始论文**：Kimi K2: Open Agentic Intelligence
  - URL: https://arxiv.org/abs/2507.20534
  - 类型：arXiv 技术报告
  - 包含信息：MoE 架构（1T total / 32B active）、MuonClip 优化器、128k 上下文、Agentic 数据合成与 RL、评测分数（MMLU/MMLU-Pro、GPQA-Diamond、SWE-Bench、MATH-500、IFEval、DROP、LiveCodeBench 等）。
  - PDF 本地副本：`docs/papers/moonshot/kimi-k2.pdf`
- **官方 GitHub 仓库**：MoonshotAI/Kimi-K2
  - URL: https://github.com/moonshotai/kimi-k2
  - 类型：官方代码/模型仓库
  - 包含信息：模型架构概览、`1T total / 32B active / 128K context`、部署示例、Hugging Face 下载链接。

### 3. Kimi K2.5

- **原始论文**：Kimi K2.5: Visual Agentic Intelligence
  - URL: https://arxiv.org/abs/2602.02276
  - 类型：arXiv 技术报告
  - 包含信息：基于 Kimi K2 的多模态联合训练、MoonViT-3D、Agent Swarm、256k 上下文、评测分数（MMLU-Pro、GPQA-Diamond、SWE-Bench Verified、AIME 2025、AdvancedIF、LongBench v2 等）。
  - PDF 本地副本：`docs/papers/moonshot/kimi-k2.5.pdf`
- **Hugging Face 模型卡**：moonshotai/Kimi-K2.5
  - URL: https://huggingface.co/moonshotai/Kimi-K2.5
  - 类型：官方模型卡
  - 包含信息：模型权重下载、许可证、使用说明，以及 `1T` 级主线模型定位。

### 4. Kimi-VL-A3B-Thinking-2506

- **官方 GitHub 仓库**：MoonshotAI/Kimi-VL
  - URL: https://github.com/MoonshotAI/Kimi-VL
  - 类型：官方代码/模型仓库
  - 包含信息：`Kimi-VL-A3B-Thinking-2506` 权重入口、`16B total / 3B active`、`128K` 上下文、多模态推理与视频理解定位。
- **Hugging Face 模型卡**：moonshotai/Kimi-VL-A3B-Thinking-2506
  - URL: https://huggingface.co/moonshotai/Kimi-VL-A3B-Thinking-2506
  - 类型：官方模型卡
  - 包含信息：模型名称、权重托管与使用入口。

## 未找到原始来源的字段/模型

- **Kimi K1.5 参数规模与架构**：Moonshot AI 官方技术报告未公开 Kimi K1.5 的总参数量、激活参数量与具体架构（Dense / MoE），因此模型卡片中未填写 `parameters` 与 `architecture`。
- **Kimi K1.5 GPQA、SWE-Bench、GSM8K 等**：官方技术报告未报告这些 benchmark 分数，已在 YAML 中留空并标注原因。
- **Kimi K2 / K2.5 的 HumanEval、GSM8K、Arena-Elo 等**：官方技术报告未直接报告这些分数，已在 YAML 中留空。
- **Kimi-VL-A3B-Thinking-2506 的当前 featured text benchmark**：官方 GitHub / 模型卡未直接给出本项目 `metrics.yaml` 同口径分数，因此保持 `scores: {}`。
- **Kimi K2.6 / K2.7 Code 的发布日期**：官方平台已经明确这两者是当前最新主线，但当前页面未稳定暴露可直接引用的发布日期字段；在 `release_date` 必填约束下，本轮先不创建卡片。

## 品牌素材

- **Moonshot / Kimi Logo**：从 Moonshot AI 官方品牌指南（https://moonshotai.github.io/Branding-Guide/）下载的 Kimi "K Only" SVG，保存为 `assets/logos/moonshot.svg`。
- **品牌主色**：取自官方 SVG 中的 `#1783FF`。
