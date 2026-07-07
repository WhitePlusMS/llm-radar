# 模型参数缺口扫描（2026-07-07）

> 扫描范围：`models/**/*.yaml`
> 扫描时间：2026-07-07
> 扫描脚本：`scripts/scan-parameter-gaps.ts`
> 扫描方式：脚本解析全部 YAML，统计 `parameters` 缺失、`active` 缺失、以及 `undisclosed/uncertain` 参数占位。

## 总体结果

- 模型总数：`121`
- 完全没有 `parameters` 信息：`48`
- 缺少 `parameters.active`：`1`
- `parameters.total` 为 `undisclosed/uncertain`：`6`
- `parameters.active` 为 `undisclosed/uncertain`：`8`

## 按公司分组

### 1. 完全没有 `parameters` 信息

#### anthropic (9)
- `claude-3.5-sonnet.yaml`
- `claude-3.7-sonnet.yaml`
- `claude-4-opus.yaml`
- `claude-4-sonnet.yaml`
- `claude-fable-5.yaml`
- `claude-haiku-4.5.yaml`
- `claude-mythos-5.yaml`
- `claude-opus-4.8.yaml`
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

#### google (8)
- `gemini-2.0-flash-lite.yaml`
- `gemini-2.0-flash.yaml`
- `gemini-2.5-flash-lite.yaml`
- `gemini-2.5-flash.yaml`
- `gemini-2.5-pro.yaml`
- `gemini-3-flash-preview.yaml`
- `gemini-3.1-pro-preview.yaml`
- `gemini-3.5-flash.yaml`

#### minimax (1)
- `minimax-vl-01.yaml`

#### mistral (2)
- `codestral-25.01.yaml`
- `magistral-medium.yaml`

#### moonshot (1)
- `kimi-k1.5.yaml`

#### openai (14)
- `gpt-4.1-mini.yaml`
- `gpt-4.1.yaml`
- `gpt-4o-mini.yaml`
- `gpt-4o.yaml`
- `gpt-5-mini.yaml`
- `gpt-5-nano.yaml`
- `gpt-5.4-mini.yaml`
- `gpt-5.4-nano.yaml`
- `gpt-5.4.yaml`
- `gpt-5.5.yaml`
- `gpt-5.yaml`
- `o1.yaml`
- `o3.yaml`
- `o4-mini.yaml`

#### xai (7)
- `grok-2-mini.yaml`
- `grok-2.yaml`
- `grok-3-mini.yaml`
- `grok-3.yaml`
- `grok-4.3.yaml`
- `grok-4.yaml`
- `grok-build-0.1.yaml`

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

- `deepseek/v3.2`：优先继续核验 `active params`
- `tencent/hunyuanvideo-1.5`：优先核验是否有官方 `active params`

## 结论

当前最需要处理的，不是继续盲目补模型数量，而是把参数信息的缺口按三类收口：

1. 官方完全未公开，因此当前文件没有 `parameters`
2. 已知 `total`，但仍缺 `active`
3. 只能暂时保守写成 `undisclosed/uncertain`

后续最有效的推进方式，是按这三类分别清理，而不是混在一起逐个碰运气。
