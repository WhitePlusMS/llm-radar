# 模型参数缺口扫描（2026-07-07）

> 扫描范围：`models/**/*.yaml`
> 扫描时间：2026-07-07
> 扫描脚本：`scripts/scan-parameter-gaps.ts`
> 扫描方式：脚本解析全部 YAML，统计 `parameters` 缺失、`active` 缺失、`undisclosed/uncertain` 参数占位，以及 `scores` / 数值 benchmark 缺口。

## 总体结果

- 模型总数：`143`
- 完全没有 `parameters` 信息：`68`
- 缺少 `parameters.active`：`1`
- `parameters.total` 为 `undisclosed/uncertain`：`6`
- `parameters.active` 为 `undisclosed/uncertain`：`8`
- `scores` 完全为空：`73`
- 完全没有任何数值 benchmark：`76`
- 一个 featured benchmark 数值都没有：`79`
- 同时缺少 `parameters` 且没有任何数值 benchmark：`47`
- 中小模型且没有任何数值 benchmark（人工复核候选）：`14`

## 按公司分组

### 1. 完全没有 `parameters` 信息

#### anthropic (14)
- `claude-3.5-sonnet.yaml`
- `claude-3.7-sonnet.yaml`
- `claude-4-opus.yaml`
- `claude-4-sonnet.yaml`
- `claude-fable-5.yaml`
- `claude-haiku-4.5.yaml`
- `claude-mythos-5.yaml`
- `claude-opus-4.5.yaml`
- `claude-opus-4.6.yaml`
- `claude-opus-4.7.yaml`
- `claude-opus-4.8.yaml`
- `claude-sonnet-4.5.yaml`
- `claude-sonnet-4.6.yaml`
- `claude-sonnet-5.yaml`

#### baichuan (3)
- `baichuan-m1-preview.yaml`
- `baichuan4-turbo.yaml`
- `baichuan4.yaml`

#### baidu (1)
- `ernie-4.5-vl.yaml`

#### bytedance (2)
- `doubao-1.5-pro.yaml`
- `seed2.0-lite.yaml`

#### google (9)
- `gemini-2.0-flash-lite.yaml`
- `gemini-2.0-flash.yaml`
- `gemini-2.5-flash-lite.yaml`
- `gemini-2.5-flash.yaml`
- `gemini-2.5-pro.yaml`
- `gemini-3-flash-preview.yaml`
- `gemini-3-pro-preview.yaml`
- `gemini-3.1-pro-preview.yaml`
- `gemini-3.5-flash.yaml`

#### minimax (3)
- `minimax-m2.1.yaml`
- `minimax-m2.5.yaml`
- `minimax-vl-01.yaml`

#### mistral (2)
- `codestral-25.01.yaml`
- `magistral-medium.yaml`

#### moonshot (1)
- `kimi-k1.5.yaml`

#### openai (22)
- `gpt-4.1-mini.yaml`
- `gpt-4.1-nano.yaml`
- `gpt-4.1.yaml`
- `gpt-4.5-preview.yaml`
- `gpt-4o-mini.yaml`
- `gpt-4o.yaml`
- `gpt-5-mini.yaml`
- `gpt-5-nano.yaml`
- `gpt-5-pro.yaml`
- `gpt-5.4-mini.yaml`
- `gpt-5.4-nano.yaml`
- `gpt-5.4-pro.yaml`
- `gpt-5.4.yaml`
- `gpt-5.5-pro.yaml`
- `gpt-5.5.yaml`
- `gpt-5.yaml`
- `o1-pro.yaml`
- `o1.yaml`
- `o3-mini.yaml`
- `o3-pro.yaml`
- `o3.yaml`
- `o4-mini.yaml`

#### tencent (2)
- `tencent-hy-2.0-instruct.yaml`
- `tencent-hy-2.0-think.yaml`

#### xai (7)
- `grok-2-mini.yaml`
- `grok-2.yaml`
- `grok-3-mini.yaml`
- `grok-3.yaml`
- `grok-4.3.yaml`
- `grok-4.yaml`
- `grok-build-0.1.yaml`

#### zhipu (2)
- `glm-5.1.yaml`
- `glm-5.2.yaml`

### 2. 缺少 `parameters.active`

#### deepseek (1)
- `v3.2.yaml` (`total: 685B` 已有，`active` 缺失)

### 3. `parameters.total` 为 `undisclosed/uncertain`

#### alibaba (1)
- `qwen3.5-omni.yaml` -> `total: uncertain`

#### baidu (1)
- `ernie-5.1.yaml` -> `total: undisclosed`

#### bytedance (2)
- `seed-1.8.yaml` -> `total: undisclosed`
- `seed-2.0-pro.yaml` -> `total: undisclosed`

#### tencent (1)
- `hunyuan-t1.yaml` -> `total: undisclosed`

#### zhipu (1)
- `glm-4.yaml` -> `total: undisclosed`

### 4. `parameters.active` 为 `undisclosed/uncertain`

#### alibaba (2)
- `qwen3.5-omni.yaml` -> `active: uncertain`
- `qwq-32b.yaml` -> `active: undisclosed`

#### baidu (1)
- `ernie-5.1.yaml` -> `active: undisclosed`

#### bytedance (2)
- `seed-1.8.yaml` -> `active: undisclosed`
- `seed-2.0-pro.yaml` -> `active: undisclosed`

#### tencent (2)
- `hunyuan-t1.yaml` -> `active: undisclosed`
- `hunyuanvideo-1.5.yaml` -> `active: undisclosed`

#### zhipu (1)
- `glm-4.yaml` -> `active: undisclosed`

### 5. `scores` 完全为空

#### alibaba (6)
- `qwen2-vl-72b.yaml`
- `qwen2.5-vl.yaml`
- `qwen3-coder-480b-a35b.yaml`
- `qwen3-omni-30b-a3b.yaml`
- `qwen3-vl-235b-a22b.yaml`
- `qwq-32b.yaml`

#### anthropic (11)
- `claude-3.7-sonnet.yaml`
- `claude-fable-5.yaml`
- `claude-haiku-4.5.yaml`
- `claude-mythos-5.yaml`
- `claude-opus-4.5.yaml`
- `claude-opus-4.6.yaml`
- `claude-opus-4.7.yaml`
- `claude-opus-4.8.yaml`
- `claude-sonnet-4.5.yaml`
- `claude-sonnet-4.6.yaml`
- `claude-sonnet-5.yaml`

#### baichuan (4)
- `baichuan-m1-14b.yaml`
- `baichuan-m1-preview.yaml`
- `baichuan4-turbo.yaml`
- `baichuan4.yaml`

#### baidu (4)
- `ernie-4.5-21b-a3b.yaml`
- `ernie-4.5-vl-28b-a3b-thinking.yaml`
- `ernie-4.5-vl.yaml`
- `ernie-5.1.yaml`

#### bytedance (1)
- `doubao-1.5-pro.yaml`

#### deepseek (2)
- `coder-v2.yaml`
- `vl2.yaml`

#### google (5)
- `gemini-2.0-flash-lite.yaml`
- `gemini-2.5-flash-lite.yaml`
- `gemini-3-flash-preview.yaml`
- `gemini-3-pro-preview.yaml`
- `gemini-3.5-flash.yaml`

#### meta (2)
- `llama-3.2-11b-vision.yaml`
- `llama-3.2-90b-vision.yaml`

#### minimax (5)
- `minimax-m2.1.yaml`
- `minimax-m2.5.yaml`
- `minimax-m3.yaml`
- `minimax-text-01.yaml`
- `minimax-vl-01.yaml`

#### mistral (7)
- `codestral-25.01.yaml`
- `devstral-small.yaml`
- `magistral-small.yaml`
- `ministral-3-14b-25.12.yaml`
- `ministral-8b.yaml`
- `mistral-medium-3.5.yaml`
- `mistral-small-4.yaml`

#### moonshot (2)
- `kimi-vl-thinking-2506.yaml`
- `kimi-vl.yaml`

#### openai (14)
- `gpt-5-mini.yaml`
- `gpt-5-nano.yaml`
- `gpt-5-pro.yaml`
- `gpt-5.4-mini.yaml`
- `gpt-5.4-nano.yaml`
- `gpt-5.4-pro.yaml`
- `gpt-5.4.yaml`
- `gpt-5.5-pro.yaml`
- `gpt-5.5.yaml`
- `gpt-5.yaml`
- `o1-pro.yaml`
- `o3-pro.yaml`
- `o3.yaml`
- `o4-mini.yaml`

#### tencent (3)
- `hunyuanvideo-1.5.yaml`
- `tencent-hy-2.0-instruct.yaml`
- `tencent-hy-2.0-think.yaml`

#### xai (3)
- `grok-4.3.yaml`
- `grok-4.yaml`
- `grok-build-0.1.yaml`

#### zhipu (4)
- `glm-4.5-air.yaml`
- `glm-4.5v.yaml`
- `glm-5.1.yaml`
- `glm-5.2.yaml`

### 6. 完全没有任何数值 benchmark

#### alibaba (6)
- `qwen2-vl-72b.yaml`
- `qwen2.5-vl.yaml`
- `qwen3-coder-480b-a35b.yaml`
- `qwen3-omni-30b-a3b.yaml`
- `qwen3-vl-235b-a22b.yaml`
- `qwq-32b.yaml`

#### anthropic (11)
- `claude-3.7-sonnet.yaml`
- `claude-fable-5.yaml`
- `claude-haiku-4.5.yaml`
- `claude-mythos-5.yaml`
- `claude-opus-4.5.yaml`
- `claude-opus-4.6.yaml`
- `claude-opus-4.7.yaml`
- `claude-opus-4.8.yaml`
- `claude-sonnet-4.5.yaml`
- `claude-sonnet-4.6.yaml`
- `claude-sonnet-5.yaml`

#### baichuan (4)
- `baichuan-m1-14b.yaml`
- `baichuan-m1-preview.yaml`
- `baichuan4-turbo.yaml`
- `baichuan4.yaml`

#### baidu (4)
- `ernie-4.5-21b-a3b.yaml`
- `ernie-4.5-vl-28b-a3b-thinking.yaml`
- `ernie-4.5-vl.yaml`
- `ernie-5.1.yaml`

#### bytedance (1)
- `doubao-1.5-pro.yaml`

#### deepseek (2)
- `coder-v2.yaml`
- `vl2.yaml`

#### google (5)
- `gemini-2.0-flash-lite.yaml`
- `gemini-2.5-flash-lite.yaml`
- `gemini-3-flash-preview.yaml`
- `gemini-3-pro-preview.yaml`
- `gemini-3.5-flash.yaml`

#### meta (2)
- `llama-3.2-11b-vision.yaml`
- `llama-3.2-90b-vision.yaml`

#### minimax (5)
- `minimax-m2.1.yaml`
- `minimax-m2.5.yaml`
- `minimax-m3.yaml`
- `minimax-text-01.yaml`
- `minimax-vl-01.yaml`

#### mistral (10)
- `codestral-25.01.yaml`
- `devstral-small.yaml`
- `magistral-medium.yaml`
- `magistral-small.yaml`
- `ministral-3-14b-25.12.yaml`
- `ministral-8b.yaml`
- `mistral-large-3.yaml`
- `mistral-medium-3.5.yaml`
- `mistral-small-4.yaml`
- `pixtral-large.yaml`

#### moonshot (2)
- `kimi-vl-thinking-2506.yaml`
- `kimi-vl.yaml`

#### openai (14)
- `gpt-5-mini.yaml`
- `gpt-5-nano.yaml`
- `gpt-5-pro.yaml`
- `gpt-5.4-mini.yaml`
- `gpt-5.4-nano.yaml`
- `gpt-5.4-pro.yaml`
- `gpt-5.4.yaml`
- `gpt-5.5-pro.yaml`
- `gpt-5.5.yaml`
- `gpt-5.yaml`
- `o1-pro.yaml`
- `o3-pro.yaml`
- `o3.yaml`
- `o4-mini.yaml`

#### tencent (3)
- `hunyuanvideo-1.5.yaml`
- `tencent-hy-2.0-instruct.yaml`
- `tencent-hy-2.0-think.yaml`

#### xai (3)
- `grok-4.3.yaml`
- `grok-4.yaml`
- `grok-build-0.1.yaml`

#### zhipu (4)
- `glm-4.5-air.yaml`
- `glm-4.5v.yaml`
- `glm-5.1.yaml`
- `glm-5.2.yaml`

### 7. 一个 featured benchmark 数值都没有

#### alibaba (6)
- `qwen2-vl-72b.yaml`
- `qwen2.5-vl.yaml`
- `qwen3-coder-480b-a35b.yaml`
- `qwen3-omni-30b-a3b.yaml`
- `qwen3-vl-235b-a22b.yaml`
- `qwq-32b.yaml`

#### anthropic (12)
- `claude-3.7-sonnet.yaml`
- `claude-4-sonnet.yaml`
- `claude-fable-5.yaml`
- `claude-haiku-4.5.yaml`
- `claude-mythos-5.yaml`
- `claude-opus-4.5.yaml`
- `claude-opus-4.6.yaml`
- `claude-opus-4.7.yaml`
- `claude-opus-4.8.yaml`
- `claude-sonnet-4.5.yaml`
- `claude-sonnet-4.6.yaml`
- `claude-sonnet-5.yaml`

#### baichuan (5)
- `baichuan-m1-14b.yaml`
- `baichuan-m1-preview.yaml`
- `baichuan-omni.yaml`
- `baichuan4-turbo.yaml`
- `baichuan4.yaml`

#### baidu (4)
- `ernie-4.5-21b-a3b.yaml`
- `ernie-4.5-vl-28b-a3b-thinking.yaml`
- `ernie-4.5-vl.yaml`
- `ernie-5.1.yaml`

#### bytedance (1)
- `doubao-1.5-pro.yaml`

#### deepseek (2)
- `coder-v2.yaml`
- `vl2.yaml`

#### google (5)
- `gemini-2.0-flash-lite.yaml`
- `gemini-2.5-flash-lite.yaml`
- `gemini-3-flash-preview.yaml`
- `gemini-3-pro-preview.yaml`
- `gemini-3.5-flash.yaml`

#### meta (2)
- `llama-3.2-11b-vision.yaml`
- `llama-3.2-90b-vision.yaml`

#### minimax (5)
- `minimax-m2.1.yaml`
- `minimax-m2.5.yaml`
- `minimax-m3.yaml`
- `minimax-text-01.yaml`
- `minimax-vl-01.yaml`

#### mistral (10)
- `codestral-25.01.yaml`
- `devstral-small.yaml`
- `magistral-medium.yaml`
- `magistral-small.yaml`
- `ministral-3-14b-25.12.yaml`
- `ministral-8b.yaml`
- `mistral-large-3.yaml`
- `mistral-medium-3.5.yaml`
- `mistral-small-4.yaml`
- `pixtral-large.yaml`

#### moonshot (2)
- `kimi-vl-thinking-2506.yaml`
- `kimi-vl.yaml`

#### openai (15)
- `gpt-4o-mini.yaml`
- `gpt-5-mini.yaml`
- `gpt-5-nano.yaml`
- `gpt-5-pro.yaml`
- `gpt-5.4-mini.yaml`
- `gpt-5.4-nano.yaml`
- `gpt-5.4-pro.yaml`
- `gpt-5.4.yaml`
- `gpt-5.5-pro.yaml`
- `gpt-5.5.yaml`
- `gpt-5.yaml`
- `o1-pro.yaml`
- `o3-pro.yaml`
- `o3.yaml`
- `o4-mini.yaml`

#### tencent (3)
- `hunyuanvideo-1.5.yaml`
- `tencent-hy-2.0-instruct.yaml`
- `tencent-hy-2.0-think.yaml`

#### xai (3)
- `grok-4.3.yaml`
- `grok-4.yaml`
- `grok-build-0.1.yaml`

#### zhipu (4)
- `glm-4.5-air.yaml`
- `glm-4.5v.yaml`
- `glm-5.1.yaml`
- `glm-5.2.yaml`

### 8. 同时缺少 `parameters` 且没有任何数值 benchmark

#### anthropic (11)
- `claude-3.7-sonnet.yaml`
- `claude-fable-5.yaml`
- `claude-haiku-4.5.yaml`
- `claude-mythos-5.yaml`
- `claude-opus-4.5.yaml`
- `claude-opus-4.6.yaml`
- `claude-opus-4.7.yaml`
- `claude-opus-4.8.yaml`
- `claude-sonnet-4.5.yaml`
- `claude-sonnet-4.6.yaml`
- `claude-sonnet-5.yaml`

#### baichuan (3)
- `baichuan-m1-preview.yaml`
- `baichuan4-turbo.yaml`
- `baichuan4.yaml`

#### baidu (1)
- `ernie-4.5-vl.yaml`

#### bytedance (1)
- `doubao-1.5-pro.yaml`

#### google (5)
- `gemini-2.0-flash-lite.yaml`
- `gemini-2.5-flash-lite.yaml`
- `gemini-3-flash-preview.yaml`
- `gemini-3-pro-preview.yaml`
- `gemini-3.5-flash.yaml`

#### minimax (3)
- `minimax-m2.1.yaml`
- `minimax-m2.5.yaml`
- `minimax-vl-01.yaml`

#### mistral (2)
- `codestral-25.01.yaml`
- `magistral-medium.yaml`

#### openai (14)
- `gpt-5-mini.yaml`
- `gpt-5-nano.yaml`
- `gpt-5-pro.yaml`
- `gpt-5.4-mini.yaml`
- `gpt-5.4-nano.yaml`
- `gpt-5.4-pro.yaml`
- `gpt-5.4.yaml`
- `gpt-5.5-pro.yaml`
- `gpt-5.5.yaml`
- `gpt-5.yaml`
- `o1-pro.yaml`
- `o3-pro.yaml`
- `o3.yaml`
- `o4-mini.yaml`

#### tencent (2)
- `tencent-hy-2.0-instruct.yaml`
- `tencent-hy-2.0-think.yaml`

#### xai (3)
- `grok-4.3.yaml`
- `grok-4.yaml`
- `grok-build-0.1.yaml`

#### zhipu (2)
- `glm-5.1.yaml`
- `glm-5.2.yaml`

### 9. 中小模型且没有任何数值 benchmark（人工复核候选）

#### alibaba (2)
- `qwen3-omni-30b-a3b.yaml` (`total: 30B`)
- `qwq-32b.yaml` (`total: 32.5B`)

#### baichuan (1)
- `baichuan-m1-14b.yaml` (`total: 14B`)

#### baidu (2)
- `ernie-4.5-21b-a3b.yaml` (`total: 21B`)
- `ernie-4.5-vl-28b-a3b-thinking.yaml` (`total: 28B`)

#### deepseek (1)
- `vl2.yaml` (`total: 27B`)

#### meta (1)
- `llama-3.2-11b-vision.yaml` (`total: 11B`)

#### mistral (4)
- `devstral-small.yaml` (`total: 24B`)
- `magistral-small.yaml` (`total: 24B`)
- `ministral-3-14b-25.12.yaml` (`total: 14B`)
- `ministral-8b.yaml` (`total: 8B`)

#### moonshot (2)
- `kimi-vl-thinking-2506.yaml` (`total: 16B`)
- `kimi-vl.yaml` (`total: 16B`)

#### tencent (1)
- `hunyuanvideo-1.5.yaml` (`total: 8.3B`)

## 优先处理建议

### 第一优先级：主线闭源厂商

这些公司大量模型没有 `parameters`，处理策略应以补官方证据和统一表述为主，而不是猜参数：

- `anthropic`
- `openai`
- `google`
- `xai`

### 第二优先级：中文厂商旗舰

这些模型更有机会从官方论文、技术报告或平台文档中补到更完整参数：

- `baidu`
- `tencent`
- `bytedance`
- `zhipu`
- `baichuan`

### 第三优先级：已部分完成但仍有缺口

- 先人工复核“中小模型且没有任何数值 benchmark”这一组，决定哪些该删、哪些只是 benchmark 不匹配当前 metrics 集。
- `deepseek/v3.2`：优先继续核验 `active params`
- `tencent/hunyuanvideo-1.5`：优先核验是否有官方 `active params`

## 结论

当前最需要处理的，不是继续盲目补模型数量，而是把模型缺口按四类收口：

1. 官方完全未公开，因此当前文件没有 `parameters`
2. 已知 `total`，但仍缺 `active`
3. 只能暂时保守写成 `undisclosed/uncertain`
4. 模型存在，但完全没有可落到当前项目的数值 benchmark

其中第 4 类尤其适合配合“官方主线 / 非主线”和“旗舰 / 中小模型”一起判断，避免把该留的多模态主线误删，也避免把信息过薄的小模型继续堆在库里。
