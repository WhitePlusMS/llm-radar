# 模型数据第二轮联网审计记录

> 审计时间：2026-07-06  
> AS_OF：2026-07-06  
> 调研方式：4 个并发智能体按厂商组调研，主线程做字段落地与构建校验。  
> 来源优先级：官方 API 文档 / 官方模型卡 / 官方 GitHub 或 Hugging Face 组织 / 官方博客 / arXiv 技术报告。第三方评测站只做线索，不直接写入 `scores`。

## 已落地新增模型

### OpenAI

- `models/openai/gpt-5.5.yaml`
- `models/openai/gpt-5.4.yaml`
- `models/openai/gpt-5.4-mini.yaml`
- `models/openai/gpt-5.4-nano.yaml`

来源：
- https://developers.openai.com/api/docs/models/gpt-5.5
- https://developers.openai.com/api/docs/models/gpt-5.4
- https://developers.openai.com/api/docs/models/gpt-5.4-mini
- https://developers.openai.com/api/docs/models/gpt-5.4-nano

处理原则：官方模型页提供 context window、输入/输出模态和快照日期；未提供参数规模或本项目 metrics 分数，因此 `scores: {}`。

### Anthropic

- `models/anthropic/claude-opus-4.8.yaml`
- `models/anthropic/claude-sonnet-5.yaml`
- `models/anthropic/claude-haiku-4.5.yaml`

来源：
- https://platform.claude.com/docs/en/about-claude/models/overview
- https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8
- https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5

处理原则：官方文档列出模型可用性、context window、max output 和 vision/text 能力；未公开参数规模与本项目 metrics 分数。

### Google

- `models/google/gemini-3.5-flash.yaml`
- `models/google/gemini-3.1-pro-preview.yaml`

来源：
- https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash
- https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview

处理原则：保留 API 文档可核验的 1M context 与 text/image/audio/video 输入能力；未填非官方 benchmark。

### xAI

- `models/xai/grok-4.3.yaml`
- `models/xai/grok-build-0.1.yaml`

来源：
- https://docs.x.ai/docs/models

处理原则：`grok-4.3` 作为当前 chat 模型，`grok-build-0.1` 作为 coding/agentic 模型；未公开参数和 benchmark。

### Meta

- `models/meta/llama-3.1-8b.yaml`
- `models/meta/llama-3.2-1b.yaml`
- `models/meta/llama-3.2-3b.yaml`
- `models/meta/llama-3.2-11b-vision.yaml`
- `models/meta/llama-3.2-90b-vision.yaml`

来源：
- https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md
- https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md
- https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct
- https://huggingface.co/meta-llama/Llama-3.2-90B-Vision-Instruct

处理原则：文本模型写入官方 model card 明确列出的 MMLU、MMLU-Pro、GPQA、HumanEval、MATH-500、GSM8K、IFEval、ARC-C 等；视觉模型当前 metrics 不匹配，保留空分数。

### Alibaba / Qwen

- `models/alibaba/qwen3-8b.yaml`
- `models/alibaba/qwen3-14b.yaml`
- `models/alibaba/qwen3-32b.yaml`
- `models/alibaba/qwen3-30b-a3b.yaml`
- `models/alibaba/qwen3-coder-480b-a35b.yaml`
- `models/alibaba/qwen3-vl-235b-a22b.yaml`
- `models/alibaba/qwq-32b.yaml`
- `models/alibaba/qwen2.5-omni-7b.yaml`

来源：
- https://qwenlm.github.io/blog/qwen3/
- https://qwenlm.github.io/blog/qwen3-coder/
- https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct
- https://huggingface.co/Qwen/Qwen3-VL-235B-A22B-Instruct
- https://qwenlm.github.io/blog/qwq-32b/
- https://qwenlm.github.io/blog/qwen2.5-omni/

处理原则：补入 8B/14B/32B/30B-A3B、代码、多模态视觉、推理和 Omni 代表模型；未逐项文本核验的分数不填。

### Mistral

- `models/mistral/mistral-medium-3.5.yaml`
- `models/mistral/mistral-small-4.yaml`
- `models/mistral/codestral-25.01.yaml`
- `models/mistral/devstral-small.yaml`
- `models/mistral/ministral-8b.yaml`

来源：
- https://docs.mistral.ai/models/model-cards/mistral-medium-3.5
- https://docs.mistral.ai/models/model-cards/mistral-small-4
- https://docs.mistral.ai/models/model-cards/codestral
- https://docs.mistral.ai/models/model-cards/devstral
- https://docs.mistral.ai/getting-started/models/models_overview/

处理原则：先补主线覆盖，不做旧 id 重命名；benchmark 暂空。

### DeepSeek

- `models/deepseek/v2.yaml`
- `models/deepseek/coder-v2.yaml`
- `models/deepseek/v3.1.yaml`
- `models/deepseek/r1-0528.yaml`

来源：
- https://github.com/deepseek-ai/DeepSeek-V2
- https://github.com/deepseek-ai/DeepSeek-Coder-V2
- https://api-docs.deepseek.com/news/news250821
- https://github.com/deepseek-ai/DeepSeek-R1

处理原则：补 V2、Coder、V3.1、R1 更新版代表；benchmark 暂空，避免混用版本。

## 已落地修正

- `models/meta/llama-3.1-70b.yaml`：补充官方 model card 中的 MMLU、MMLU-Pro、GPQA、HumanEval、MATH-500、GSM8K、IFEval、ARC-C。
- `models/meta/llama-3.3-70b.yaml`：补充官方 model card 中的 MMLU、MMLU-Pro、GPQA、HumanEval、MATH-500、GSM8K、IFEval。
- `models/alibaba/qwen3.5.yaml`：改为具体 `Qwen3.5-397B-A17B`，修正开源权重、text/image/video 输入与 262k native / 1M extrapolation context。
- `models/bytedance/seed-1.8.yaml`、`models/bytedance/seed-2.0-pro.yaml`、`models/bytedance/seed2.0-lite.yaml`：移除被错误写入标准 `ifeval` 的 Inverse IFEval。
- `models/minimax/minimax-m3.yaml`：删除 VentureBeat source 和不等价的 SWE-Bench Pro 分数。
- `models/baichuan/baichuan4.yaml`：删除 Donews 第三方新闻 source，仅保留百川平台来源。

## 尚未完全落地的缺口

- Google：`gemini-3.1-flash-lite`、`gemini-3-flash-preview` 可继续核验；同时需区分 deprecated 的 Gemini 2.0 系列。
- xAI：`grok-4-heavy` 与其他订阅/产品形态需确认是否属于 API 普通模型。
- Mistral：还可补 `mistral-large-25.02`、`pixtral-12b`、`magistral-small-1.2`、`magistral-medium-1.2`、`ministral-3b`。
- DeepSeek：还可补 `v3-0324`、`v3.2`、`v3.2-exp`、`vl2-tiny`、`vl2-small`、R1 distill 系列。
- 中文厂商：Baidu、Tencent、Zhipu、Moonshot、MiniMax、ByteDance、Baichuan 仍需逐文件继续清理 `note` 字段、第三方 source、视觉/音频/视频模型与文本 benchmark 混用问题。
- 数据 schema：当前构建脚本会丢弃 YAML 中的 `note` 字段；如果需要保留 benchmark 口径说明，应扩展 `ScoreEntry` 类型，而不是继续写会被忽略的字段。

## 验证结果

- `npm run build-index`：通过，生成 103 模型 / 14 benchmark / 15 公司索引。
- `npm run build`：通过。
- `npm test`：24/24 通过。
