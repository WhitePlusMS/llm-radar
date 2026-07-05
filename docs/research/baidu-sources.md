# Baidu 大模型数据来源调研

调研日期：2026-07-06

## 已确认模型与原始来源

### 1. ERNIE 5.0-Base
- **原始来源**：ERNIE 5.0 Technical Report（arXiv）
- **URL**：https://arxiv.org/abs/2602.04705
- **PDF 本地备份**：`docs/papers/baidu/ernie-5.0-technical-report.pdf`
- **类型**：官方技术报告（论文）
- **发布日期**：2026-02-04
- **说明**：报告提供了 ERNIE 5.0-Base 在 MMLU-Pro、MMLU、GPQA-Diamond、HumanEval+、MATH (CoT)、BBH、WinoGrande 等 benchmark 上的原始分数。ERNIE 5.0 是统一的文本/图像/音频/视频自回归多模态模型，采用超稀疏 MoE 架构。

### 2. ERNIE 4.5-300B-A47B
- **原始来源**：ERNIE 4.5 Technical Report（Baidu ERNIE 官方博客）
- **URL**：https://ernie.baidu.com/blog/publication/ERNIE_Technical_Report.pdf
- **PDF 本地备份**：`docs/papers/baidu/ernie-4.5-technical-report.pdf`
- **类型**：官方技术报告（论文）
- **发布日期**：2025-06-29（模型首次发布于 2025-03-18）
- **说明**：报告提供了 ERNIE 4.5-300B-A47B post-trained 模型在 MMLU-Pro、MMLU、HumanEval+、MATH-500、GSM8K、IFEval、BBH、DROP 等 benchmark 上的原始分数。模型采用 MoE 架构，总参数 300B，激活参数 47B，以 Apache 2.0 开源。

## 未找到原始来源的模型

### ERNIE X1
- **发布日期**：2025-03-18（与 ERNIE 4.5 同时发布）
- **已知信息**：Baidu 官方新闻稿将其定位为深度思考推理模型，具备多模态能力，强调复杂推理、工具使用、文档问答、代码执行等能力。
- **缺少来源原因**：未找到 Baidu 官方发布的 ERNIE X1 技术报告、arXiv 论文或官方 benchmark 表格。仅有第三方新闻稿和概述性报道，未包含可采信的原始 benchmark 分数。
- **参考链接**：
  - https://www.wicinternet.org/2025-03/24/c_1080639.htm（China Daily / WIC 报道）

## 调研备注
- 所有分数均来自发布方原始技术报告；未采用第三方复测或匿名来源。
- Baidu 品牌主色采用官方 Logo 蓝色 `#2529D8`（Palatinate Blue），备用红色为 `#DE0F17`。
- ERNIE 5.0 总参数规模论文描述为 trillion-parameter 级别，未披露精确数值，故 YAML 中记录为 `1T+`。
