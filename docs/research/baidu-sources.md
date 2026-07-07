# Baidu 大模型数据来源调研

调研日期：2026-07-06

## 2026-07-07 补充核验结论

- `ERNIE 4.5` 家族
  - 百度官方开源公告 `2025-06-30` 明确写到：家族包含 `47B` / `3B` active 参数的 MoE 变体，最大模型为 `424B total`
  - `ERNIE-4.5-300B-A47B` 与 `ERNIE-4.5-VL-424B-A47B` 均能从官方技术报告 / 官方博客名称层面得到支撑
  - 但当前公开页没有把 `ERNIE 4.5-300B-A47B` 与 `ERNIE 4.5-VL` 的精确首发日期稳定锚定到 `2025-03-16 / 2025-03-18`，因此仓库已回退这些具体日期
- `ERNIE 5.0`
  - 百度官方博客页 `article:published_time` 为 `2026-02-06`
  - 官方博客标题与正文明确给出 `2.4 trillion-parameter`、统一 `text/image/video/audio` 多模态自回归框架、以及图像/视频/音频生成能力
- `ERNIE 5.1`
  - 官方博客页面日期应按正文收敛为 `2026-05-09`
  - 官方正文明确给出的是：
    - 总参数约为 ERNIE 5.0 的三分之一
    - 激活参数约为 ERNIE 5.0 的二分之一
    - Arena Search 为 `1223`
  - 但正文没有稳定给出与本仓库 `metrics.yaml` 一一对应的精确 `mmlu-pro` / `gpqa` / `arena-elo` 数值，因此这些分数不应继续硬写
- `ERNIE 5.1`
- `ERNIE X1`
  - 当前仍未找到百度官方博客、官方论文、官方 API / 文档页作为一手来源
  - 仓库已删除 `models/baidu/ernie-x1.yaml`，避免继续沿用第三方新闻稿作为主证据

## 已确认模型与原始来源

### 1. ERNIE 5.0-Base
- **原始来源**：ERNIE 5.0 官方博客 + ERNIE 5.0 Technical Report（arXiv）
- **URL**：https://arxiv.org/abs/2602.04705
- **博客**：https://ernie.baidu.com/blog/posts/ernie5.0/
- **类型**：官方技术报告（论文）
- **发布日期**：2026-02-06（按官方博客页发布时间）
- **说明**：官方博客直接支撑 `2.4T` 总参数、约 `<3%` 激活率、统一 `text/image/video/audio` 多模态框架与图像/视频/音频生成能力；技术报告提供了 ERNIE 5.0-Base 在 MMLU-Pro、MMLU、GPQA-Diamond、HumanEval+、MATH (CoT)、BBH、WinoGrande 等 benchmark 上的原始分数。

### 2. ERNIE 4.5-300B-A47B
- **原始来源**：ERNIE 4.5 家族开源公告 + ERNIE 4.5 Technical Report
- **URL**：https://ernie.baidu.com/blog/publication/ERNIE_Technical_Report.pdf
- **博客**：https://ernie.baidu.com/blog/posts/ernie4.5/
- **类型**：官方技术报告（论文）
- **发布日期**：2025-06-30（按官方开源公告页发布时间）
- **说明**：官方开源公告明确家族包含 `47B` / `3B` active 参数的 MoE 变体、最大模型为 `424B total`，并给出 `ERNIE-4.5-300B-A47B` / `ERNIE-4.5-VL-424B-A47B` 的官方命名；技术报告提供了 ERNIE 4.5-300B-A47B post-trained 模型在 MMLU-Pro、MMLU、HumanEval+、MATH-500、GSM8K、IFEval、BBH、DROP 等 benchmark 上的原始分数。

## 未找到原始来源的模型

### ERNIE X1
- **当前状态**：已从仓库模型库中移除
- **缺少来源原因**：未找到 Baidu 官方发布的 ERNIE X1 技术报告、官方博客文章、官方 API / 模型文档或官方 benchmark 表格；仅有第三方新闻稿和概述性报道，不符合本轮只采信官方一手来源的标准

## 调研备注
- 所有分数均来自发布方原始技术报告；未采用第三方复测或匿名来源。
- Baidu 品牌主色采用官方 Logo 蓝色 `#2529D8`（Palatinate Blue），备用红色为 `#DE0F17`。
- `ERNIE 5.0` 的 `2.4T`、`<3% activation rate`、统一 `text/image/video/audio` 自回归框架，可由官方博客直接支撑。
- `ERNIE 4.5-VL` 当前只保守保留 `text + image -> text` 模态口径；音频/视频 I/O 未继续硬写。
