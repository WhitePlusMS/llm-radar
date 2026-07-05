# Anthropic 模型数据来源记录

本次为 `llm-radar` 收集 Anthropic 公司在 2024–2026 年间发布的重要旗舰大语言模型。所有信息均优先采用发布方原始来源（官方博客、官方 system card / model card PDF），未使用第三方复测或匿名来源。

## 已收录模型

1. **Claude 3.5 Sonnet（2024-10-22 升级版）**
2. **Claude 4 Opus（2025-05-22）**
3. **Claude Fable 5（2026-06-09）**

## 来源 URL

### Claude 3.5 Sonnet（2024-10-22 升级版）

- **Model Card Addendum PDF（主要分数来源）**  
  https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf  
  类型：`model-card`  
  包含内容：MMLU、MMLU-Pro、GPQA-Diamond、HumanEval、SWE-bench Verified、MATH、DROP、BIG-Bench-Hard、IFEval 等评测分数。

### Claude 4 Opus

- **Introducing Claude 4（发布方博客，主要分数与发布信息来源）**  
  https://www.anthropic.com/news/claude-4  
  类型：`blog`

- **System Card: Claude Opus 4 & Claude Sonnet 4（PDF）**  
  https://www-cdn.anthropic.com/4263b940cabb546aa0e3283f35b686f4f3b2ff47/claude-opus-4-and-claude-sonnet-4-system-card.pdf  
  类型：`system-card`  
  包含内容：安全评估、ASL 等级、SWE-bench Verified hard subset 方法论等。

### Claude Fable 5

- **Claude Fable 5 & Claude Mythos 5 System Card（PDF，主要分数来源）**  
  https://www-cdn.anthropic.com/d00db56fa754a1b115b6dd7cb2e3c342ee809620.pdf  
  类型：`system-card`  
  包含内容：SWE-bench Verified / Pro / Multilingual / Multimodal、GPQA Diamond、FrontierCode、OSWorld-Verified、BrowseComp 等。

- **Claude Fable 5 and Claude Mythos 5（发布方博客）**  
  https://www.anthropic.com/news/claude-fable-5-mythos-5  
  类型：`blog`  
  包含内容：产品定位、安全保障、定价、上线信息。

## 已下载 PDF

以下 PDF 已保存到 `docs/papers/anthropic/`：

- `claude-3-5-sonnet-oct-addendum.pdf` — Claude 3.5 Sonnet 十月升级版 Model Card Addendum。
- `claude-4-system-card.pdf` — Claude Opus 4 & Sonnet 4 System Card。
- `claude-fable-5-mythos-5-system-card.pdf` — Claude Fable 5 & Mythos 5 System Card。

## 未找到来源 / 未报告的字段说明

- **参数规模（`parameters.total` / `parameters.active`）**：Anthropic 官方未公开 Claude 3.5 Sonnet、Claude 4 Opus、Claude Fable 5 的具体参数总量与激活参数，因此 YAML 中未填写该字段。
- **Claude 4 Opus 的 MMLU / MMLU-Pro**：官方发布博客与 system card 未报告标准 MMLU 或 MMLU-Pro 分数（仅报告了 MMMLU、MMMU、AIME、TAU-bench 等），故未填充。
- **Claude Fable 5 的 MMLU / MMLU-Pro / MATH**：Fable 5 system card 未报告这些传统 benchmark 分数，仅在多语言能力评估中报告了 GMMLU / MILU / INCLUDE，因此未填充。
- **arena-elo**：三个模型均未在官方来源中报告 LMSYS Chatbot Arena Elo 分数，未填充。

## 备注

- Claude Fable 5 的 GPQA Diamond 分数（94.1%）在 system card 中明确标注为 **Mythos 5** 的结果；Fable 5 与 Mythos 5 是同一底层模型的两种配置（Fable 5 面向普通用户并带安全兜底，Mythos 5 面向授权用户），因此在 YAML 中做了注释说明。
- 所有分数均按发布方原始表格中的 percentage 尺度原样记录（0–100）。
