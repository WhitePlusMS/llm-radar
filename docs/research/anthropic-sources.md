# Anthropic 模型数据来源记录

本次为 `llm-radar` 收集 Anthropic 公司在 2024–2026 年间发布的重要旗舰大语言模型。所有信息均优先采用发布方原始来源（官方博客、官方 system card / model card PDF），未使用第三方复测或匿名来源。

## 2026-07-07 补充核验结论

- `Claude Sonnet 4.5 / 4.6`、`Claude Opus 4.5 / 4.6 / 4.7`：
  - 已补入官方主线模型卡。
  - 型号存在性以 Anthropic 官方发布博客与官方 `Model deprecations` 页面交叉确认。
  - `Claude Sonnet 4.5` 发布时间收敛为 `2025-09-29`，`context_window` 收敛为 `200k`。
  - `Claude Sonnet 4.6` 发布时间收敛为 `2026-02-17`，`context_window` 收敛为 `1M`。
  - `Claude Opus 4.5` 发布时间收敛为 `2025-11-24`；本轮不猜尚未在官方原文中稳定落锤的 benchmark。
  - `Claude Opus 4.6` 发布时间收敛为 `2026-02-05`，`context_window` 收敛为 `1M`。
  - `Claude Opus 4.7` 发布时间收敛为 `2026-04-16`，`context_window` 收敛为 `1M`。
- Anthropic 官方 docs 里确实还存在带日期的 API model name（如 `claude-sonnet-4-6-20260217`）；
  本仓库这一轮先沿用既有的简化命名风格补卡，不做整批重命名，避免无必要 churn。
- `Claude 3.5 Sonnet`、`Claude 3.7 Sonnet`：
  - 已删除 `Dense` 这类官方未确认的架构推测。
- `Claude Opus 4`、`Claude Sonnet 4`：
  - 名称顺序已按 Anthropic 官方写法收敛。
- `Claude Haiku 4.5`：
  - 发布日期收敛为 `2025-10-15`，并补入官方发布博客来源。
- `Claude Opus 4.8`、`Claude Sonnet 5`：
  - 已补入官方发布博客来源，不再只依赖 overview / docs 页面。
- `Claude Fable 5`、`Claude Mythos 5`：
  - 由于当前已核验的官方博客 / system card 中，尚未稳定定位到与本仓库 `gpqa` / `swe-bench` 指标完全同口径、且能直接归属到对应模型的精确值，已先清空这些分数，避免把 Mythos 的值借填到 Fable，或把不同 benchmark 口径混写进来。

## 已收录模型

1. **Claude 3.5 Sonnet（2024-10-22 升级版）**
2. **Claude 3.7 Sonnet（2025-02-24）**
3. **Claude Opus 4（2025-05-22）**
4. **Claude Sonnet 4（2025-05-22）**
5. **Claude Sonnet 4.5（2025-09-29）**
6. **Claude Haiku 4.5（2025-10-15）**
7. **Claude Opus 4.5（2025-11-24）**
8. **Claude Opus 4.6（2026-02-05）**
9. **Claude Sonnet 4.6（2026-02-17）**
10. **Claude Opus 4.7（2026-04-16）**
11. **Claude Opus 4.8（2026-05-28）**
12. **Claude Fable 5（2026-06-09）**
13. **Claude Mythos 5（2026-06-09）**
14. **Claude Sonnet 5（2026-06-30）**

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

### Claude Sonnet 4.5

- **Introducing Claude Sonnet 4.5（发布方博客）**  
  https://www.anthropic.com/news/claude-sonnet-4-5  
  类型：`blog`  
  包含内容：发布日期、产品定位与能力更新。

- **Model deprecations（官方 docs）**  
  https://platform.claude.com/docs/en/about-claude/model-deprecations  
  类型：`website`  
  包含内容：官方 API model name、Active / Deprecated 生命周期与迁移建议。

- **Using Claude on Amazon Bedrock（官方 docs）**  
  https://docs.claude.com/en/api/claude-on-amazon-bedrock  
  类型：`website`  
  包含内容：`Claude Sonnet 4.5` 的 `200k-token context window` 说明。

### Claude Opus 4.5

- **Introducing Claude Opus 4.5（发布方博客）**  
  https://www.anthropic.com/news/claude-opus-4-5  
  类型：`blog`  
  包含内容：发布日期、产品定位与能力更新。

- **Model deprecations（官方 docs）**  
  https://platform.claude.com/docs/en/about-claude/model-deprecations  
  类型：`website`  
  包含内容：官方 API model name、Active / Deprecated 生命周期与迁移建议。

### Claude Opus 4.6

- **Claude Opus 4.6（发布方博客）**  
  https://www.anthropic.com/news/claude-opus-4-6  
  类型：`blog`  
  包含内容：发布日期、能力更新与 `1M token context window in beta` 说明。

- **Model deprecations（官方 docs）**  
  https://platform.claude.com/docs/en/about-claude/model-deprecations  
  类型：`website`  
  包含内容：官方 API model name、Active / Deprecated 生命周期与迁移建议。

- **Using Claude on Amazon Bedrock（官方 docs）**  
  https://docs.claude.com/en/api/claude-on-amazon-bedrock  
  类型：`website`  
  包含内容：`Claude Opus 4.6` 属于 `1M-token context window` 适用范围。

### Claude Sonnet 4.6

- **Introducing Sonnet 4.6（发布方博客）**  
  https://www.anthropic.com/news/claude-sonnet-4-6  
  类型：`blog`  
  包含内容：发布日期、能力更新与 `1M token context window in beta` 说明。

- **Model deprecations（官方 docs）**  
  https://platform.claude.com/docs/en/about-claude/model-deprecations  
  类型：`website`  
  包含内容：官方 API model name、Active / Deprecated 生命周期与迁移建议。

- **Using Claude on Amazon Bedrock（官方 docs）**  
  https://docs.claude.com/en/api/claude-on-amazon-bedrock  
  类型：`website`  
  包含内容：`Claude Sonnet 4.6` 属于 `1M-token context window` 适用范围。

### Claude Opus 4.7

- **Introducing Claude Opus 4.7（发布方博客）**  
  https://www.anthropic.com/news/claude-opus-4-7  
  类型：`blog`  
  包含内容：发布日期与能力更新。

- **Model deprecations（官方 docs）**  
  https://platform.claude.com/docs/en/about-claude/model-deprecations  
  类型：`website`  
  包含内容：官方 API model name、Active / Deprecated 生命周期与迁移建议。

- **Using Claude on Amazon Bedrock（官方 docs）**  
  https://docs.claude.com/en/api/claude-on-amazon-bedrock  
  类型：`website`  
  包含内容：`Claude Opus 4.7` 属于 `1M-token context window` 适用范围。

### Claude Fable 5

- **Claude Fable 5 & Claude Mythos 5 System Card（PDF，主要分数来源）**  
  https://www-cdn.anthropic.com/d00db56fa754a1b115b6dd7cb2e3c342ee809620.pdf  
  类型：`system-card`  
  包含内容：SWE-bench Verified / Pro / Multilingual / Multimodal、GPQA Diamond、FrontierCode、OSWorld-Verified、BrowseComp 等。

- **Claude Fable 5 and Claude Mythos 5（发布方博客）**  
  https://www.anthropic.com/news/claude-fable-5-mythos-5  
  类型：`blog`  
  包含内容：产品定位、安全保障、定价、上线信息。

### Claude Mythos 5

- **Claude Fable 5 & Claude Mythos 5 System Card（PDF）**  
  https://www-cdn.anthropic.com/d00db56fa754a1b115b6dd7cb2e3c342ee809620.pdf  
  类型：`system-card`  
  包含内容：Mythos 5 的 GPQA Diamond 等旗舰能力数据。

- **Claude Fable 5 and Claude Mythos 5（发布方博客）**  
  https://www.anthropic.com/news/claude-fable-5-mythos-5  
  类型：`blog`

## 已下载 PDF

以下 PDF 已保存到 `docs/papers/anthropic/`：

- `claude-3-5-sonnet-oct-addendum.pdf` — Claude 3.5 Sonnet 十月升级版 Model Card Addendum。
- `claude-4-system-card.pdf` — Claude Opus 4 & Sonnet 4 System Card。
- `claude-fable-5-mythos-5-system-card.pdf` — Claude Fable 5 & Mythos 5 System Card。

## 未找到来源 / 未报告的字段说明

- **参数规模（`parameters.total` / `parameters.active`）**：Anthropic 官方未公开当前仓库中 Claude 3.5 Sonnet、Claude 3.7 Sonnet、Claude Opus 4、Claude Sonnet 4、Claude Sonnet 4.5、Claude Haiku 4.5、Claude Opus 4.5、Claude Opus 4.6、Claude Sonnet 4.6、Claude Opus 4.7、Claude Opus 4.8、Claude Fable 5、Claude Mythos 5、Claude Sonnet 5 的具体参数总量与激活参数，因此 YAML 中未填写该字段。
- **架构字段**：Anthropic 官方未公开当前仓库中上述模型的架构，故不再保留 `Dense` 这类推测性字段。
- **Claude Opus 4.5 的 context window**：本轮已通过官方博客与官方 lifecycle docs 确认其型号与发布日期，但尚未在 Anthropic 原文中稳定定位到可直接引用的 context 描述，因此 YAML 先留空，不猜测。
- **Claude Sonnet 4.5 / 4.6、Claude Opus 4.5 / 4.6 / 4.7 的 benchmark 数值**：官方页面存在图表与方法说明，但当前尚未完成对 `metrics.yaml` 可安全映射的精确数值整理，因此本轮先保持 `scores: {}`，避免把不同口径的图表数值混写回卡片。
- **Claude 4 Opus 的 MMLU / MMLU-Pro**：官方发布博客与 system card 未报告标准 MMLU 或 MMLU-Pro 分数（仅报告了 MMMLU、MMMU、AIME、TAU-bench 等），故未填充。
- **Claude Fable 5 的 MMLU / MMLU-Pro / MATH**：Fable 5 system card 未报告这些传统 benchmark 分数，仅在多语言能力评估中报告了 GMMLU / MILU / INCLUDE，因此未填充。
- **arena-elo**：三个模型均未在官方来源中报告 LMSYS Chatbot Arena Elo 分数，未填充。

## 备注

- Claude Fable 5 的 GPQA Diamond 分数（94.1%）在 system card 中明确标注为 **Mythos 5** 的结果；Fable 5 与 Mythos 5 是同一底层模型的两种配置（Fable 5 面向普通用户并带安全兜底，Mythos 5 面向授权用户），因此在 YAML 中做了注释说明。
- 所有分数均按发布方原始表格中的 percentage 尺度原样记录（0–100）。
