# ByteDance 大模型调研来源

## 2026-07-07 补充核验结论

- `Seed1.8`
  - 官方 model card 可支撑 `MMLU 92.3`、`MMLU-Pro 84.9`、`GPQA Diamond 83.8`、`SWE-Bench Verified 72.9`
  - GitHub source type 已统一为 `codebase`
  - 官方发布博客已给出 `2025-12-18`；上下文窗口仍未直接披露，因此仓库只回退了 `context_window`
- `Seed 2.0 Pro`
  - 官方 model card 可直接支撑 `MMLU-Pro 87.0`、`GPQA Diamond 88.9`、`SWE Bench Verified 76.5`
  - 参数规模仍未披露，因此继续保留 `undisclosed`
  - 精确 `context_window` 与输入/输出模态数组未在当前核验中稳定落锤，仓库已回退这些字段
- `Seed 2.0 Lite`
  - 官方 model card 可直接支撑 `MMLU-Pro 87.7`、`GPQA Diamond 85.1`、`SWE Bench Verified 73.5`
  - 但精确 `context_window` 与输入/输出模态数组未在当前核验中稳定落锤，仓库已回退这些字段
- `Seed-Thinking-v1.5`
  - 官方博客与技术报告可直接支撑 `release_date: 2025-04-14`、`architecture: MoE`、`200B / 20B`
  - 技术报告 Table 2 直接给出 `MMLU-Pro 87.0`、`GPQA Diamond 77.3`、`SWE-Bench Verified 47.0`、`IFEval 87.4`
  - 当前仅移除了未被官方直接披露支撑的 `context_window`
- `Doubao-1.5-Pro`
  - Seed 官方专题页可直接支撑 `release_date: 2025-01-22` 与 `architecture: MoE`
  - 但 benchmark 数值仍主要出现在图片中，未完成稳定文本抽取；上下文长度与模态数组也未继续硬写，因此模型卡回退为只保留核心事实字段

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
  - SWE Bench Verified: 76.5
  - LiveCodeBench v6: 87.8
  - Inverse IFEval: 78.9
  - AIME 2025: 98.3, HMMT Nov 2025: 98.3, Codeforces Elo: 3020 (因不在项目预定义 benchmark 集合中，未写入 scores)
- **未找到来源的字段**: 参数规模未披露；HumanEval、GSM8K、DROP、HellaSwag、ARC-C、Winogrande 等分数未在官方来源中报告；当前未把精确 `context_window` 与输入/输出模态数组写回仓库。

### 2. Seed1.8
- **发布日期**: 2025-12-18
- **官方来源**:
  - [Seed1.8 Model Card (arXiv HTML)](https://arxiv.org/html/2603.20633v2) — 官方技术报告，包含 Table 1 / Table 4 / Table 5 等
  - [ByteDance-Seed/Seed-1.8 GitHub](https://github.com/ByteDance-Seed/Seed-1.8) — 官方仓库/入口
- **已采用分数** (来自官方 Model Card):
  - MMLU: 92.3
  - MMLU-Pro: 84.9
  - GPQA Diamond: 83.8
  - SWE-Bench Verified: 72.9
  - Inverse IFEval: 80.3
- **未找到来源的字段**: 参数规模未披露；上下文窗口未在当前核验中稳定落锤；HumanEval、GSM8K、DROP、HellaSwag、ARC-C、Winogrande 等分数未在官方来源中报告；AIME-25 94.3 / HMMT Feb-25 89.7 / BeyondAIME 77.0 因不在项目预定义 benchmark 集合中，未写入 scores。

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
  - IFEval: 87.4
- **未找到来源的字段**: 上下文窗口官方未明确披露，已不再暂记为 32k；HumanEval、GSM8K、DROP、HellaSwag、ARC-C、Winogrande 等分数未在官方来源中报告；AIME 2024 86.7 / AIME 2025 74.0 / Codeforces pass@8 55.0 因不在项目预定义 benchmark 集合中，未写入 scores。

## 未收录模型及原因

- **Doubao-1.5-Pro**：这条说明已过期。仓库当前已经存在 `models/bytedance/doubao-1.5-pro.yaml`，当前保留 `2025-01-22` 与 `MoE` 这两个能由 Seed 官方专题页直接支撑的字段；benchmark、上下文长度与模态数组继续等待稳定文本证据。
- **UI-TARS / UI-TARS-1.5**: 属于 GUI Agent 视觉语言模型，并非通用 chat/reasoning 旗舰大语言模型；虽有官方 arXiv 论文与 GitHub，但不在本次 "1-3 个最新最重要大语言模型" 的收录范围内。
- **Seed1.5-VL / Seed1.6 / Seed-OSS / Seed-Coder 等**: 属于多模态、开源、代码专项分支，非当前收录旗舰范围。
