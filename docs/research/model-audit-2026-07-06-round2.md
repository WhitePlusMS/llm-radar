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
- `models/openai/gpt-5.yaml`
- `models/openai/gpt-5-mini.yaml`
- `models/openai/gpt-5-nano.yaml`

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
- `models/anthropic/claude-mythos-5.yaml`

来源：
- https://platform.claude.com/docs/en/about-claude/models/overview
- https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8
- https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5

处理原则：官方文档列出模型可用性、context window、max output 和 vision/text 能力；未公开参数规模与本项目 metrics 分数。

### Google

- `models/google/gemini-3.5-flash.yaml`
- `models/google/gemini-3.1-pro-preview.yaml`
- `models/google/gemini-3-flash-preview.yaml`

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
- `models/alibaba/qwen2.5-coder-32b.yaml`
- `models/alibaba/qwen3-vl-235b-a22b.yaml`
- `models/alibaba/qwq-32b.yaml`
- `models/alibaba/qwen2.5-omni-7b.yaml`
- `models/alibaba/qwen2.5-14b-instruct-1m.yaml`
- `models/alibaba/qwen2.5-7b-instruct-1m.yaml`

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
- `models/mistral/ministral-3-14b-25.12.yaml`

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
- `models/deepseek/v3-0324.yaml`
- `models/deepseek/v3.2.yaml`

来源：
- https://github.com/deepseek-ai/DeepSeek-V2
- https://github.com/deepseek-ai/DeepSeek-Coder-V2
- https://api-docs.deepseek.com/news/news250821
- https://github.com/deepseek-ai/DeepSeek-R1

处理原则：补 V2、Coder、V3.1、R1 更新版代表；benchmark 暂空，避免混用版本。

### Zhipu

- `models/zhipu/glm-4.5-air.yaml`
- `models/zhipu/glm-4.5v.yaml`

来源：
- https://z.ai/blog/glm-4.5
- https://arxiv.org/abs/2508.06471

处理原则：`GLM-4.5-Air` 作为轻量版公开变体补入，`GLM-4.5V` 作为视觉变体补入；当前未逐项核验到项目 metrics 的文本分数，因此 `scores: {}`。

### Baidu / MiniMax / Baichuan（第三轮补充）

- `models/baidu/ernie-4.5-vl.yaml`
- `models/minimax/minimax-vl-01.yaml`
- `models/baichuan/baichuan4-turbo.yaml`

来源：
- https://ernie.baidu.com/blog/publication/ERNIE_Technical_Report.pdf
- https://arxiv.org/abs/2501.08313
- https://platform.baichuan-ai.com/prices

处理原则：这三类都是家族补全型条目。官方来源能确认它们存在、定位和模态，但当前项目的文本 benchmark 不匹配或未公开，因此统一保留 `scores: {}`。

### Moonshot / Tencent（第四轮补充）

- `models/moonshot/kimi-vl-thinking-2506.yaml`
- `models/tencent/hunyuanvideo-1.5.yaml`

来源：
- https://github.com/MoonshotAI/Kimi-VL
- https://huggingface.co/moonshotai/Kimi-VL-A3B-Thinking-2506
- https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5

处理原则：这两条都属于“官方仓库明确已发布，但当前模型库缺失”的家族补全条目。`Kimi-VL-A3B-Thinking-2506` 可以直接从官方仓库确认 `16B / 3B active / 128k`；`HunyuanVideo-1.5` 可以直接从官方 README 确认 `8.3B`、text-to-video 与 image-to-video 定位。由于当前项目 metrics 主要是文本 benchmark，两者统一保留 `scores: {}`。

## 已落地修正

- `models/meta/llama-3.1-70b.yaml`：补充官方 model card 中的 MMLU、MMLU-Pro、GPQA、HumanEval、MATH-500、GSM8K、IFEval、ARC-C。
- `models/meta/llama-3.3-70b.yaml`：补充官方 model card 中的 MMLU、MMLU-Pro、GPQA、HumanEval、MATH-500、GSM8K、IFEval。
- `models/alibaba/qwen3.5.yaml`：改为具体 `Qwen3.5-397B-A17B`，修正开源权重、text/image/video 输入与 262k native / 1M extrapolation context。
- `models/bytedance/seed-1.8.yaml`、`models/bytedance/seed-2.0-pro.yaml`、`models/bytedance/seed2.0-lite.yaml`：移除被错误写入标准 `ifeval` 的 Inverse IFEval。
- `models/minimax/minimax-m3.yaml`：删除 VentureBeat source 和不等价的 SWE-Bench Pro 分数。
- `models/baichuan/baichuan4.yaml`：删除 Donews 第三方新闻 source，仅保留百川平台来源。
- `models/baidu/ernie-4.5.yaml`：移除与 text-only 模态冲突的 `multimodal` 标签。
- `models/tencent/hunyuan-t1.yaml`：将推测参数改回 `undisclosed`，并把 GitHub README 的来源类型改为 `codebase`。
- `models/minimax/minimax-m2.yaml`：修正明显错误的发布日期为 2026-05-29。
- `models/baichuan/baichuan-m1-preview.yaml`：移除 IT 之家/环球网第三方来源，仅保留百川官方平台来源。
- `src/types.ts`、`src/lib/model-index-builder.ts`：正式保留 `ScoreEntry.note`，避免 benchmark 口径说明在 YAML -> JSON 构建时丢失。
- `models/baidu/ernie-4.5-vl.yaml`、`models/minimax/minimax-vl-01.yaml`、`models/baichuan/baichuan4-turbo.yaml`：补充三类家族代表模型，优先增强公司覆盖度。
- `models/anthropic/claude-4-opus.yaml`、`models/anthropic/claude-4-sonnet.yaml`、`models/anthropic/claude-fable-5.yaml`：删除官方未披露的推测性 `Dense` 架构字段。
- `models/xai/grok-4.yaml`：按 xAI 官方发布页把模态收敛为 `text/image -> text`，移除不受官方支持的音频输入/输出。
- `models/mistral/mistral-medium-3.5.yaml`：按官方模型卡修正为 `123B total / 15B active`、`Hybrid`、`128k`、`open-weights`。
- `models/mistral/mistral-small-4.yaml`：按官方模型卡修正为 `119B total / 6.5B active`、`Hybrid`、`256k`。
- `models/deepseek/vl2.yaml`：按官方 GitHub README 将 `context_window` 从 `uncertain` 收敛为 `4k`，并补入官方代码仓库 source。
- `models/deepseek/v3.1.yaml`：将 `modalities.output` 从 `[text, code]` 收敛为 `[text]`，避免把“代码能力”误写成独立输出模态。
- `models/deepseek/v3.1.yaml`、`models/deepseek/v3.2.yaml`、`models/deepseek/v3-0324.yaml`、`models/deepseek/r1-0528.yaml`：补入官方 Hugging Face / 官方论文可直接映射到当前指标的 `mmlu-pro`、`gpqa`、`swe-bench`、`math-level-5(MATH-500)` 分数。
- `models/deepseek/v2.yaml`、`models/deepseek/v2.5.yaml`：补入官方 GitHub / 官方 Hugging Face 可直接映射的 `mmlu`、`humaneval`、`gsm8k`、`bbh`、`swe-bench` 分数，并用 `note` 标明 `5-shot`、`HumanEval python`、`SWE-verified` 等口径。
- `models/alibaba/qwen3.yaml`、`models/alibaba/qwen3-8b.yaml`、`models/alibaba/qwen3-14b.yaml`、`models/alibaba/qwen3-32b.yaml`、`models/alibaba/qwen3-30b-a3b.yaml`：补入官方 Qwen3 技术报告可安全落地的 `mmlu-pro`、`gpqa`、`bbh`、`gsm8k`，以及带 `thinking mode` 标注的 `ifeval`。

## 尚未完全落地的缺口

- Google：`gemini-3-flash-preview` 已补入；`gemini-3.1-flash-lite` 虽有官方发布日期，但因缺少官方评测参数且属于轻量分支，按新口径不再保留。
- xAI：`grok-4-heavy` 与其他订阅/产品形态需确认是否属于 API 普通模型。
- Mistral：还可补 `mistral-large-25.02`、`pixtral-12b`、`magistral-small-1.2`、`magistral-medium-1.2`、`ministral-3b`。
- DeepSeek：`v3-0324` 与 `v3.2` 已补入；`v3.2-exp` 因实验性质与缺少评测参数，暂未保留。`VL2 Small/Tiny` 与 `R1 distill` 也按新口径移除。
- Alibaba / Qwen：Qwen3 小中模型已先按“Base 表 + thinking 模式 IFEval”的保守策略补入一批官方分数；`MATH` 与 `MATH-500` 仍未强行映射为 `math-level-5`。
- DeepSeek：`V2 / V2.5` 也已补入一批能安全映射的官方分数；`Coder-V2` 因官方表格主要面向具体变体而暂未硬填。
- 中文厂商：Baidu、Tencent、Moonshot、MiniMax、ByteDance、Baichuan 仍需逐文件继续清理第三方 source、视觉/音频/视频模型与文本 benchmark 混用问题。
- Moonshot / Tencent：虽然已补 `Kimi-VL-A3B-Thinking-2506` 与 `HunyuanVideo-1.5`，但仍可继续核验是否还有官方轻量版、Turbo/Preview、音频或工具模型未纳入。
- OpenAI / Anthropic / Alibaba / Mistral：本轮已继续补主线与长上下文分支，但 Google 新模型因官方发布日期仍需更硬证据，暂未强行入库。
- 数据 schema：`ScoreEntry.note` 已保留到索引层，但前端还没有把这些口径说明完整展示出来。

## 验证结果

- `npm run build-index`：待本轮按新收录口径清理并补主线版本后再次统一验证。
- `npm run build`：待本轮文档更新后再次统一验证。
- `npm test`：待本轮文档更新后再次统一验证。
