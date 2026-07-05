# ByteDance 大模型调研来源

## 已收录模型

### 1. Seed 2.0 Pro
- **发布日期**: 2026-02-14
- **官方来源**:
  - [Seed2.0 Model Card PDF](https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/0214/Seed2.0%20Model%20Card.pdf) — 官方技术报告，包含 Table 3 等完整 benchmark
  - [arXiv:2607.00248](https://arxiv.org/abs/2607.00248) — arXiv 摘要页
  - [Seed2.0 官方产品页](https://seed.bytedance.com/en/seed2) — Volcano Engine 模型广场入口
- **已采用分数** (来自官方 Model Card):
  - MMLU-Pro: 87.0
  - GPQA Diamond: 88.9
  - LiveCodeBench v6: 87.8
  - Inverse IFEval: 78.9
  - AIME 2025: 98.3, HMMT Nov 2025: 98.3, Codeforces Elo: 3020 (因不在项目预定义 benchmark 集合中，未写入 scores)
- **未找到来源的字段**: 参数规模未披露；HumanEval、GSM8K、DROP、HellaSwag、ARC-C、Winogrande 等分数未在官方来源中报告；SWE-Bench Verified 未在官方 Model Card 中出现（官方页面列出的为 SWE-Bench Pro / SWE Multilingual）。

### 2. Seed1.8
- **发布日期**: 2025-12
- **官方来源**:
  - [Seed1.8 Model Card (arXiv HTML)](https://arxiv.org/html/2603.20633v2) — 官方技术报告，包含 Table 1 / Table 4 / Table 5 等
  - [ByteDance-Seed/Seed-1.8 GitHub](https://github.com/ByteDance-Seed/Seed-1.8) — 官方仓库/入口
- **已采用分数** (来自官方 Model Card):
  - MMLU: 92.3
  - MMLU-Pro: 84.9
  - GPQA Diamond: 83.8
  - SWE-Bench Verified: 72.9
  - Inverse IFEval: 80.3
- **未找到来源的字段**: 参数规模未披露；HumanEval、GSM8K、DROP、HellaSwag、ARC-C、Winogrande 等分数未在官方来源中报告；AIME-25 94.3 / HMMT Feb-25 89.7 / BeyondAIME 77.0 因不在项目预定义 benchmark 集合中，未写入 scores。

### 3. Seed-Thinking-v1.5
- **发布日期**: 2025-04-14
- **官方来源**:
  - [Seed-Thinking-v1.5 技术报告 PDF](https://github.com/ByteDance-Seed/Seed-Thinking-v1.5/raw/main/seed-thinking-v1.5.pdf) — GitHub 官方 PDF，包含 Table 2
  - [官方博客披露](https://seed.bytedance.com/en/blog/bytedance-s-latest-thinking-model-seed-thinking-v1-5-technical-details-disclosed)
  - [GitHub 仓库](https://github.com/ByteDance-Seed/Seed-Thinking-v1.5)
- **已采用分数** (来自官方技术报告):
  - MMLU-Pro: 87.0
  - GPQA Diamond: 77.3
  - SWE-Bench Verified: 47.0
  - Inverse IFEval: 87.4
- **未找到来源的字段**: 上下文窗口官方未明确披露，按 Volcano Engine API 常见配置暂记为 32k；HumanEval、GSM8K、DROP、HellaSwag、ARC-C、Winogrande 等分数未在官方来源中报告；AIME 2024 86.7 / AIME 2025 74.0 / Codeforces pass@8 55.0 因不在项目预定义 benchmark 集合中，未写入 scores。

## 未收录模型及原因

- **Doubao-1.5-Pro**: 2025-01-22 发布，是重要的生产级 MoE 多模态模型，但官方未发布独立技术报告/论文；仅 Volcano Engine 文档与新闻稿提及其 benchmark（MMLU-Pro 80.2、GPQA 66.2 等）。因缺少发布方原始 PDF/论文来源，本次未单独建模，相关信息已作为 Seed 系列背景参考。
- **UI-TARS / UI-TARS-1.5**: 属于 GUI Agent 视觉语言模型，并非通用 chat/reasoning 旗舰大语言模型；虽有官方 arXiv 论文与 GitHub，但不在本次 "1-3 个最新最重要大语言模型" 的收录范围内。
- **Seed1.5-VL / Seed1.6 / Seed-OSS / Seed-Coder 等**: 属于多模态、开源、代码专项分支，非当前收录旗舰范围。

## 本地保存的原始 PDF

- `docs/papers/bytedance/seed2.0-model-card.pdf`
- `docs/papers/bytedance/seed1.8-model-card.pdf`
- `docs/papers/bytedance/seed-thinking-v1.5.pdf`
