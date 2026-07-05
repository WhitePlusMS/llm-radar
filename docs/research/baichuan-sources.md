# Baichuan 模型调研来源

调研时间：2026-07-05
覆盖周期：2024–2026 年发布的旗舰 / 推理 / 多模态模型

## 已收录模型与原始来源

### 1. Baichuan4（对话/基座旗舰）

- 发布方原始报道：
  - [百川智能发布Baichuan4及首款AI助手百小应 - DoNews](https://www.donews.com/news/detail/1/4245551.html)
  - [百川智能发布最新一代基座大模型Baichuan4 - 北京市海淀区人民政府](https://www.bjhd.gov.cn/ztzx/2024zt/dmxznpt/cjyy/202407/t20240716_4660899.shtml)
- 官方 API 平台（上下文与模型系列信息）：
  - [百川大模型 API 定价页](https://platform.baichuan-ai.com/prices)
- PDF/论文：未找到 Baichuan4 基座模型的官方技术报告 PDF，仅有第三方行业分析报告，故未采用。
- 备注：官方新闻稿仅给出相对 Baichuan3 的能力提升百分比与 SuperCLUE 排名，未报告 MMLU-Pro / GPQA / HumanEval 等国际化标准 benchmark 的具体数值，因此 `scores` 留空。

### 2. Baichuan-M1-preview（深度推理 / 多模态推理）

- 发布方原始报道：
  - [百川智能发布深度思考模型Baichuan-M1-preview - IT之家](https://www.ithome.com/0/826/964.htm)
  - [百川智能首个全场景深度思考模型Baichuan-M1-preview发布 - 环球网](https://tech.huanqiu.com/article/4LCc06490AH)
- PDF/论文：截至调研时未找到 Baichuan-M1-preview 的 arXiv 论文或官方技术报告；其开源小尺寸版本 Baichuan-M1-14B 有独立论文（见下方）。
- 备注：新闻稿仅定性描述其在 AIME / Math / LiveCodeBench / MMMU / MathVista 上超越部分对标模型，未给出可直接录入的百分比/原始分数，因此 `scores` 留空。

### 3. Baichuan-Omni（开源全模态）

- 发布方原始论文：
  - [Baichuan-Omni Technical Report - arXiv:2410.08565](https://arxiv.org/abs/2410.08565)
- 官方代码仓库：
  - [westlake-baichuan-mllm/bc-omni - GitHub](https://github.com/westlake-baichuan-mllm/bc-omni)
- 已下载 PDF：`docs/papers/baichuan/baichuan-omni.pdf`
- 已收录分数：MMLU 65.3（见论文 Table 1）。其余常用 benchmark（MMLU-Pro、GPQA、HumanEval、SWE-Bench 等）未在原始论文中报告。

### 4. Baichuan-M1-14B-Instruct（开源医疗增强）

- 发布方原始论文：
  - [Baichuan-M1: Pushing the Medical Capability of Large Language Models - arXiv:2502.12671](https://arxiv.org/abs/2502.12671)
- 官方代码仓库：
  - [baichuan-inc/Baichuan-M1-14B - GitHub](https://github.com/baichuan-inc/Baichuan-M1-14B)
- 已下载 PDF：`docs/papers/baichuan/baichuan-m1.pdf`
- 备注：该模型是 Baichuan-M1-preview 的开源小尺寸版本，主打医疗增强。论文报告了 HumanEval 60.4、MATH 46.0 等代码/数学能力（Table 4），但本次只选择了 1–3 个最具代表性的模型入库存储，因此未单独生成 YAML；相关来源与 PDF 仍在此记录备查。

## 未找到原始来源/分数的项

| 模型 | 缺失内容 | 原因 |
|------|---------|------|
| Baichuan4 | 官方技术报告 PDF、MMLU-Pro/GPQA/HumanEval 等具体分数 | 官方仅发布新闻稿与 API 平台信息，未公开技术报告及国际化 benchmark 分数 |
| Baichuan-M1-preview | 论文/技术报告、具体 benchmark 分数 | 仅有官方媒体通稿，未找到 arXiv 论文或 leaderboard 原始数据 |

## 已下载 PDF 清单

- `docs/papers/baichuan/baichuan-omni.pdf`（Baichuan-Omni Technical Report）
- `docs/papers/baichuan/baichuan-m1.pdf`（Baichuan-M1 paper）
