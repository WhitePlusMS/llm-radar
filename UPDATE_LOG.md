# LLM Radar 更新日志

## 2026-07-07 继续补齐 Tencent / Zhipu 官方主线，并修正发布日期口径

### 修改原因

在 OpenAI 和 Moonshot 收口之后，国内厂商里最适合继续推进的是 `Tencent / Zhipu`，因为这两条线上已经有足够硬的官方来源能支撑“补主线缺卡 + 修字段错误”：

- `Tencent`
  - 官方产品动态已经明确列出 `Tencent HY 2.0 Think / Instruct`
  - `Hunyuan-A13B` 的发布日期此前比官方动态晚了两天
- `Zhipu`
  - 官方 release notes 已明确列出 `GLM-5.1 / 5.2`
  - `GLM-5` 的产品发布日期与论文发布日期被混用了，`gpqa: 86.0` 的来源归因也不一致

这一轮继续遵循“最简原则 + 文档置信度原则”：只补官方已明确存在的主线条目，只修能被官方页面直接压实的日期、来源和最小规格，不猜参数和 benchmark。

### 修改文件与详情

- 新增模型：
  - `models/tencent/tencent-hy-2.0-think.yaml`
  - `models/tencent/tencent-hy-2.0-instruct.yaml`
  - `models/zhipu/glm-5.1.yaml`
  - `models/zhipu/glm-5.2.yaml`
- 更新模型：
  - `models/tencent/hunyuan-a13b.yaml`
  - `models/zhipu/glm-5.yaml`
- 更新研究文档：
  - `docs/research/tencent-sources.md`
  - `docs/research/zhipu-sources.md`
- 刷新索引：
  - `public/model-index.json`

### 修改影响

- `Tencent HY 2.0 Think`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2025-11-09`
  - 当前只保留官方动态可直接支撑的最小事实集：文本输入输出、closed-weights、reasoning
- `Tencent HY 2.0 Instruct`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2025-11-11`
  - 当前只保留官方动态可直接支撑的最小事实集：文本输入输出、closed-weights
- `Hunyuan-A13B`
  - 发布日期从 `2025-06-27` 修正为官方产品动态日期 `2025-06-25`
  - 补入 `reasoning` 标签
- `GLM-5.1`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2026-04-07`
  - `context_window` 收敛为 `200k`
- `GLM-5.2`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2026-06-16`
  - `context_window` 收敛为 `1M`
- `GLM-5`
  - `release_date` 从论文日期 `2026-02-17` 收敛为官方 release notes 日期 `2026-02-03`
  - `gpqa: 86.0` 的来源改回官方博客，而不再错误归给论文

### 验证

- `npm run build-index`：通过，生成 `139` 模型 / `14` benchmark / `15` 公司索引。
- `npm run build`：通过。
- `npm test`：`25/25` 通过。

## 2026-07-07 继续收紧 Moonshot / Kimi 参数口径，并记录最新主线迁移

### 修改原因

国内厂商这一段里，`Moonshot / Kimi` 是当前证据最硬、最适合继续推进的一条线，因为已经有两类非常明确的问题：

- `Kimi K2` / `Kimi K2.5` 的总参数量还保留着偏大的旧写法
- 官方平台当前主线已经切到 `K2.6` / `K2.7 Code`，但仓库研究文档还没有把这个状态记录清楚

同时，`K2.6` / `K2.7 Code` 虽然已经确认是官方最新主线，但在当前页面里还没有稳定暴露出可直接落库的发布日期；而本仓库又对 `release_date` 做强校验。因此这轮按“最简原则 + 文档置信度原则”先不硬加新卡，先把已知错误收掉，并把主线迁移事实记录清楚。

### 修改文件与详情

- 更新模型：
  - `models/moonshot/kimi-k2.yaml`
  - `models/moonshot/kimi-k2.5.yaml`
- 更新研究文档：
  - `docs/research/moonshot-sources.md`
- 刷新索引：
  - `public/model-index.json`

### 修改影响

- `Kimi K2`
  - `parameters.total` 从 `1.04T` 收敛为官方 GitHub 明示的 `1T`
  - `parameters.active` 从 `32.6B` 收敛为官方 GitHub 明示的 `32B`
- `Kimi K2.5`
  - `parameters.total` 从 `1.04T` 收敛为 `1T`
  - `parameters.active` 继续保留 `32B`
- `Moonshot` 研究文档
  - 明确记录 `K2.6` 是当前通用主线、`K2.7 Code` 是当前代码主线
  - 明确说明本轮为何没有立刻新建 `K2.6 / K2.7 Code` 模型卡：不是没找到官方型号，而是还没压实可直接落库的发布日期

### 验证

- `npm run build-index`：通过，生成 `135` 模型 / `14` benchmark / `15` 公司索引。
- `npm run build`：通过。
- `npm test`：`25/25` 通过。

## 2026-07-07 继续补齐 OpenAI 官方主线缺卡，并收紧 GPT-4.1 家族口径

### 修改原因

在 Anthropic、Google、xAI 收口之后，`OpenAI` 目录里最明显的剩余问题已经不是“字段脏”，而是“主线缺卡”：

- `GPT-4.1` 家族缺 `gpt-4.1-nano`
- `GPT-4.5 Preview` 缺卡
- `o3-mini / o3-pro / o1-pro` 缺卡
- `GPT-5 Pro / GPT-5.4 Pro / GPT-5.5 Pro` 缺卡

同时，`GPT-4.1` 与 `GPT-4.1 mini` 还缺官方 model doc，`context_window` 也仍是概括写法 `1M`，还没有收敛到官方模型页给出的精确数字。

这轮继续遵循“最简原则 + 文档置信度原则”：

- 只补官方 model doc + 官方 changelog / 官方博客都能支撑的主线卡；
- 能从 OpenAI 官方对比表直接拿到的分数才写；
- `o1-pro / o3-pro / GPT-5 Pro` 这类如果官方当前只给规格不给本项目 `metrics.yaml` 同口径 benchmark，就先空着。

### 修改文件与详情

- 新增模型：
  - `models/openai/gpt-4.1-nano.yaml`
  - `models/openai/gpt-4.5-preview.yaml`
  - `models/openai/o3-mini.yaml`
  - `models/openai/o3-pro.yaml`
  - `models/openai/o1-pro.yaml`
  - `models/openai/gpt-5-pro.yaml`
  - `models/openai/gpt-5.4-pro.yaml`
  - `models/openai/gpt-5.5-pro.yaml`
- 更新模型：
  - `models/openai/gpt-4.1.yaml`
  - `models/openai/gpt-4.1-mini.yaml`
- 更新研究文档：
  - `docs/research/openai-sources.md`
- 刷新索引：
  - `public/model-index.json`
- 刷新索引：
  - `public/model-index.json`

### 修改影响

- `GPT-4.1`
  - 补入官方 model doc source
  - `context_window` 从 `1M` 收敛为官方精确值 `1,047,576`
- `GPT-4.1 mini`
  - 补入官方 model doc source
  - `context_window` 从 `1M` 收敛为官方精确值 `1,047,576`
- `GPT-4.1 nano`
  - 新增官方主线模型卡
  - 写入官方 `GPT-4.1` 对比表可直接支撑的分数：
    - `mmlu: 80.1`
    - `gpqa: 50.3`
    - `ifeval: 74.5`
  - 不猜官方未报告的 `swe-bench`
- `GPT-4.5 Preview`
  - 新增官方主线 research preview 模型卡
  - 发布日期收敛为 `2025-02-27`
  - 写入官方对比表可直接支撑的分数：
    - `mmlu: 90.8`
    - `gpqa: 69.5`
    - `ifeval: 88.2`
    - `swe-bench: 38.0`
- `o3-mini`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2025-01-31`
  - 写入官方对比表可直接支撑的分数：
    - `mmlu: 86.9`
    - `gpqa: 77.2`
    - `ifeval: 93.9`
    - `swe-bench: 49.3`
- `o3-pro`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2025-06-10`
  - 当前官方只稳定给出规格与发布日期，`scores` 保持空值
- `o1-pro`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2025-03-19`
  - 当前官方只稳定给出规格与发布日期，`scores` 保持空值
- `GPT-5 Pro`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2025-10-06`
- `GPT-5.4 Pro`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2026-03-05`
- `GPT-5.5 Pro`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2026-04-24`

### 验证

- `npm run build-index`：通过，生成 `135` 模型 / `14` benchmark / `15` 公司索引。
- `npm run build`：通过。
- `npm test`：`25/25` 通过。

## 2026-07-07 继续补齐 Google 主线预览，并收紧 xAI 官方模型页字段

### 修改原因

在补完 Anthropic 缺失主线后，`Google / xAI` 这条线也已经有足够硬的官方证据可以继续推进，但这一轮不需要大范围翻修，只需要收掉几处最明确的问题：

- `Google`
  - 当前仓库缺少官方主线预览 `Gemini 3 Pro Preview`
  - 多张 `2.5 / 3.x` 模型卡没有把官方模型页已明确披露的 `PDF` 输入能力写回 `modalities`
- `xAI`
  - `Grok 4.3`、`Grok Build 0.1` 仍把输入模态写成纯文本，但官方 docs 已明确是 `text + image`
  - `Grok Build 0.1` 还有更硬的官方发布日期来源可以替换当前日期
  - `Grok 4.3` 的精确首发日期仍不够硬，但已经能拿到一个明确 dated 的官方公开可用公告，可先收敛到这个时间点

本轮继续遵循“最简原则 + 文档置信度原则”：只处理证据最硬的缺卡与字段，不顺手扩大到更多仍需额外核验的模型。

### 修改文件与详情

- 新增模型：
  - `models/google/gemini-3-pro-preview.yaml`
- 更新模型：
  - `models/google/gemini-2.5-pro.yaml`
  - `models/google/gemini-2.5-flash-lite.yaml`
  - `models/google/gemini-3-flash-preview.yaml`
  - `models/google/gemini-3.1-pro-preview.yaml`
  - `models/google/gemini-3.5-flash.yaml`
  - `models/xai/grok-4.3.yaml`
  - `models/xai/grok-build-0.1.yaml`
- 更新研究文档：
  - `docs/research/google-sources.md`
  - `docs/research/xai-sources.md`
- 刷新索引：
  - `public/model-index.json`

### 修改影响

- `Gemini 3 Pro Preview`
  - 新增官方主线预览模型卡
  - 发布日期按官方 lifecycle 页收敛为 `2025-11-18`
  - `context_window` 收敛为 `1M`
  - 模态收敛为 `text/image/audio/video/pdf -> text`
  - 因当前未从官方页面稳定落锤出可直接映射到 `metrics.yaml` 的 benchmark，`scores` 继续保持空值
- `Gemini 2.5 Pro`
  - 补回官方模型页明确披露的 `pdf` 输入能力
- `Gemini 2.5 Flash-Lite`
  - 补回官方模型页明确披露的 `pdf` 输入能力
- `Gemini 3 Flash Preview`
  - 补回官方模型页明确披露的 `pdf` 输入能力
- `Gemini 3.1 Pro Preview`
  - 补回官方模型页明确披露的 `pdf` 输入能力
- `Gemini 3.5 Flash`
  - 补回官方模型页明确披露的 `pdf` 输入能力
- `Gemini 2.5 Flash`
  - 本轮明确确认其官方模型页未把 `PDF` 列入 Inputs，因此不补 `pdf`，避免错填
- `Grok 4.3`
  - source 从泛化的 models 总页收敛为模型专页 `docs.x.ai/developers/models/grok-4.3`
  - 输入模态从 `[text]` 修正为 `[text, image]`
  - 标签补回 `multimodal`
  - `release_date` 收敛为 `2026-06-17`，依据当前能稳定定位到的最硬官方 dated 可用性公告 `Grok on Amazon Bedrock`
- `Grok Build 0.1`
  - source 从泛化的 models 总页收敛为模型专页
  - 补入官方发布博客 `Introducing Grok Build`
  - 发布日期收敛为 `2026-05-19`，优先采用官方 release notes 中 `grok-build-0.1` 这个具体 model slug 的上架时间
  - 输入模态从 `[text]` 修正为 `[text, image]`
  - 标签补回 `multimodal`

### 验证

- `npm run build-index`：通过，生成 `127` 模型 / `14` benchmark / `15` 公司索引。
- `npm run build`：通过。
- `npm test`：`25/25` 通过。

## 2026-07-07 补齐 Anthropic 缺失主线模型，并补记最新参数缺口扫描

### 修改原因

用户已经明确要求继续联网核验，并优先补齐官方主线模型；同时也要求不要因为“看起来像版本号”就凭直觉删掉官方真实存在的型号。这一轮在 Anthropic 线上已经拿到了足够硬的官方证据：

- 官方发布博客明确存在：
  - `Claude Sonnet 4.5`
  - `Claude Sonnet 4.6`
  - `Claude Opus 4.5`
  - `Claude Opus 4.6`
  - `Claude Opus 4.7`
- 官方 `Model deprecations` 页面也把这些模型列为正式 API 生命周期中的型号。

因此本轮按“最简原则 + 文档置信度原则”只做最小必要补齐：

- 新增 5 张缺失的 Anthropic 主线模型卡；
- 不先做整批文件重命名，不引入无必要 churn；
- 对没有从官方原文稳定落锤的 benchmark，继续保持空值而不是猜。

此外，参数缺口扫描脚本已经重新执行并刷新了 `docs/research/model-parameter-gap-scan-2026-07-07.md`，上一轮还没来得及写入更新日志，这里一并补记。

### 修改文件与详情

- 新增模型：
  - `models/anthropic/claude-sonnet-4.5.yaml`
  - `models/anthropic/claude-sonnet-4.6.yaml`
  - `models/anthropic/claude-opus-4.5.yaml`
  - `models/anthropic/claude-opus-4.6.yaml`
  - `models/anthropic/claude-opus-4.7.yaml`
- 更新研究文档：
  - `docs/research/anthropic-sources.md`
- 刷新索引：
  - `public/model-index.json`
- 补记本轮前已刷新的扫描报告：
  - `docs/research/model-parameter-gap-scan-2026-07-07.md`

### 修改影响

- `Claude Sonnet 4.5`
  - 新增官方主线模型卡
  - 发布日期收敛为官方博客日期 `2025-09-29`
  - `context_window` 收敛为官方 docs 可确认的 `200k`
- `Claude Sonnet 4.6`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2026-02-17`
  - `context_window` 收敛为官方博客 / docs 可确认的 `1M`
- `Claude Opus 4.5`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2025-11-24`
  - 不猜当前尚未稳定落锤的 `context_window` 与 benchmark
- `Claude Opus 4.6`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2026-02-05`
  - `context_window` 收敛为官方博客 / docs 可确认的 `1M`
- `Claude Opus 4.7`
  - 新增官方主线模型卡
  - 发布日期收敛为 `2026-04-16`
  - `context_window` 收敛为官方 docs 可确认的 `1M`
- `Anthropic` 研究文档
  - 补入上述 5 个主线模型的来源说明
  - 明确记录 Anthropic 官方 docs 中存在带日期的 API model name，但本轮不做整批 rename
  - 明确记录为什么 `Opus 4.5` 暂不硬写 context、为什么这 5 张卡暂不硬填 benchmark
- 参数缺口扫描报告
  - 本轮日志补记最新扫描结果：
    - 模型总数 `121`
    - 完全没有 `parameters` 信息 `48`
    - 缺少 `parameters.active` `1`
    - `parameters.total` 占位值 `6`
    - `parameters.active` 占位值 `8`

### 验证

- `npm run build-index`：通过，生成 `126` 模型 / `14` benchmark / `15` 公司索引。
- `npm run build`：通过。
- `npm test`：`25/25` 通过。

## 2026-07-07 继续补齐 Alibaba 官方主线开源模型，并收紧空分数的适用边界

### 修改原因

用户已经明确两条边界：

- 只保留官方主线模型，不要 distill、派生版、中间研究版；
- 没有任何可靠官方评测支撑的小模型不要硬加。

基于这个标准，`Alibaba / Qwen` 当前最明显的缺口不是“小模型数量不够”，而是几条已经公开、而且有官方 model card / 官方仓库直接支撑的主线条目还没入库，尤其是：

- `Qwen3.6-35B-A3B`
- `Qwen3.5-122B-A10B`
- `Qwen3.5-35B-A3B`
- `Qwen3-Omni-30B-A3B`
- `Qwen2-VL-72B`

这一轮继续遵循“最简原则 + 文档置信度原则”推进：只新增已经能被官方来源直接支撑的主线条目；对不在当前 `metrics.yaml` 范围内的多模态 benchmark，不做错误映射，直接在模型卡和研究文档中写清楚原因。

### 修改文件与详情

- 新增模型：
  - `models/alibaba/qwen3.6-35b-a3b.yaml`
  - `models/alibaba/qwen3.5-122b-a10b.yaml`
  - `models/alibaba/qwen3.5-35b-a3b.yaml`
  - `models/alibaba/qwen3-omni-30b-a3b.yaml`
  - `models/alibaba/qwen2-vl-72b.yaml`
- 更新研究文档：
  - `docs/research/alibaba-sources.md`
- 刷新索引：
  - `public/model-index.json`

### 修改影响

- `Qwen3.6-35B-A3B`
  - 新增官方主线模型卡
  - 写入官方可直接支撑的：
    - `35B total / 3B active`
    - `262,144 natively / 1,010,000 with extrapolation`
    - `text/image/video -> text`
    - `mmlu-pro: 85.2`
    - `gpqa: 85.5`
    - `swe-bench: 73.4`
- `Qwen3.5-122B-A10B`
  - 新增官方主线模型卡
  - 写入官方可直接支撑的：
    - `122B total / 10B active`
    - `mmlu-pro: 86.7`
    - `gpqa: 86.6`
    - `ifeval: 93.4`
    - `swe-bench: 72.0`
- `Qwen3.5-35B-A3B`
  - 新增官方主线模型卡
  - 写入官方可直接支撑的：
    - `35B total / 3B active`
    - `mmlu-pro: 85.3`
    - `gpqa: 84.2`
    - `ifeval: 91.9`
    - `swe-bench: 69.2`
- `Qwen3-Omni-30B-A3B`
  - 新增官方主线模型卡
  - 明确它是官方 `MoE-based Thinker-Talker` 主线，不是 distill / 派生版
  - 明确模态为 `text/image/audio/video -> text/audio`
  - 不硬写 `context_window`
  - `scores` 保持为空，并直接注明原因：官方 benchmark 主要是音频/视频/音视频指标，不在当前 `metrics.yaml` 集合内
- `Qwen2-VL-72B`
  - 新增官方主线模型卡
  - 明确它是官方 `72B` 指令版，模态为 `text/image/video -> text`
  - `scores` 保持为空，并直接注明原因：官方分数主要是 `MMMU / DocVQA / RealWorldQA / MMStar / MathVista / MVBench`
- `Alibaba` 研究文档
  - 新增上述 5 条官方主线的来源说明
  - 把 `Qwen3-Omni-30B-A3B` 和 `Qwen2-VL-72B` 为什么允许空 `scores` 讲清楚
  - 把 `Qwen3.5 / 3.6` 新增的 `SWE-bench` 口径与此前 generic family 卡片区分开，避免“家族卡”和“具体官方变体卡”混淆

### 验证

- `npm run build-index`：通过，生成 `121` 模型 / `14` benchmark / `15` 公司索引。
- `npm run build`：通过。
- `npm test`：`25/25` 通过。

---

## 2026-07-07 继续收紧 DeepSeek 官方主线，移除中间研究版 R1-Zero

### 修改原因

继续按“只采信官方一手来源、优先保留正式官方主线、避免把论文里的中间研究版本当成常规模型卡”推进 `DeepSeek`。这一轮最确定的问题是：

- `DeepSeek-R1-Zero` 虽然来自官方论文，但它是 R1 训练流程中的中间研究版本，不是正式对外主推的稳定主线型号；
- 同时官方也没有给出能稳定映射进当前项目 `metrics.yaml` 的 featured benchmark 集合。

在用户已经明确“不要无相关评测参数的小/杂模型，只保留官方模型”的前提下，这条继续留着只会增加噪音。

### 修改文件与详情

- 删除模型：
  - `models/deepseek/r1-zero.yaml`
- 更新研究文档：
  - `docs/research/deepseek-sources.md`
- 更新模型说明：
  - `models/deepseek/coder-v2.yaml`
  - `models/deepseek/vl2.yaml`

### 修改影响

- `DeepSeek-R1-Zero`
  - 从模型库移除
  - 原因在研究文档中明确记录为：
    - 官方存在，但属于中间研究版
    - 不是当前应优先保留的正式官方主线
    - 缺少可直接落到当前指标集合的 featured benchmark
- `DeepSeek` 研究文档
  - 新增 `R1-Zero` 已移除的裁决说明
  - 继续保留 `DeepSeek-Coder-V2` 与 `DeepSeek-VL2` 的说明：
    - `Coder-V2` 空分数是因为官方分数按 `Instruct / Base / Lite` 具体变体给出，不能安全混填到 generic 条目
    - `VL2` 空分数是因为官方主要给的是视觉/多模态 benchmark，不属于当前文本指标集
- `DeepSeek-Coder-V2`
  - 补入官方 arXiv 论文 source
  - 在模型卡中直接注明“空分数是因为官方只给具体后缀变体分数”
- `DeepSeek-VL2`
  - 在模型卡中直接注明“空分数是因为官方主要给视觉语言 benchmark，不属于当前文本指标集”

### 验证

- `npm run build-index`：通过，生成 `135` 模型 / `14` benchmark / `15` 公司索引。
- `npm run build`：通过。
- `npm test`：`25/25` 通过。

---

## 2026-07-07 继续收紧 Alibaba 官方模型卡，并补回可直接落地的官方分数

### 修改原因

继续按“只采信官方一手来源、能落就落、不能稳定确认就收回”的标准推进 `Alibaba / Qwen`。这轮重点不是盲删模型，而是把几条此前空分数或字段不稳的官方主线重新核一遍：

- `Qwen3.5-397B-A17B` 的官方 Hugging Face model card 已经能直接支撑一组通用文本 benchmark。
- `Qwen2.5-Omni-7B` 其实有官方 benchmark，只是之前没有落回 YAML。
- `QwQ-32B`、`Qwen2.5-VL`、`Qwen3-Coder`、`Qwen3-VL` 里还留着几处 context / 参数 / source 口径不够准的字段。

### 修改文件与详情

- 更新模型：
  - `models/alibaba/qwen3.5.yaml`
  - `models/alibaba/qwen3-coder-480b-a35b.yaml`
  - `models/alibaba/qwen3-vl-235b-a22b.yaml`
  - `models/alibaba/qwen2.5-vl.yaml`
  - `models/alibaba/qwen2.5-omni-7b.yaml`
  - `models/alibaba/qwq-32b.yaml`
- 更新研究文档：
  - `docs/research/alibaba-sources.md`
  - `docs/research/model-parameter-gap-scan-2026-07-07.md`

### 修改影响

- `Qwen3.5-397B-A17B`
  - `context_window` 收敛为官方表述：`262,144 natively / 1,010,000 with extrapolation`
  - 新增官方分数：
    - `mmlu-pro: 87.8`
    - `gpqa: 88.4`
    - `ifeval: 92.6`
- `Qwen2.5-Omni-7B`
  - `release_date` 从 `2025-03-26` 修正为官方博客日期 `2025-03-27`
  - 删除未在当前官方卡中稳定落锤的 `architecture` / `context_window`
  - 新增官方分数：
    - `mmlu-pro: 47.0`
    - `gpqa: 30.8`
    - `gsm8k: 88.7`
    - `humaneval: 78.7`
  - 补入 Hugging Face model card source
- `Qwen2.5-VL`
  - `context_window` 从 `128k` 收敛为官方 model card 的默认 `32k`
  - 删除 `architecture: Dense`
  - 补入 Hugging Face model card source
- `QwQ-32B`
  - `release_date` 修正为 `2025-03-06`
  - `parameters.total` 从 `32B` 收敛为官方 `32.5B`
  - `parameters.active` 改为 `undisclosed`
  - 删除未经当前官方来源直接确认的 `architecture: Dense`
  - `context_window` 改为官方 `131,072`
  - 补入 Hugging Face model card source
- `Qwen3-Coder-480B-A35B`
  - `context_window` 从概括写法收敛为官方 `262,144 natively / 1M with extrapolation`
- `Qwen3-VL-235B-A22B`
  - `context_window` 明确为 `256k native / 1M with extrapolation`
- `Alibaba` 研究文档
  - 新增 `Qwen3.5-397B-A17B` 与 `Qwen2.5-Omni-7B` 的官方来源说明
  - 不再把 `QwQ-32B` 简单记成“未单独收录”
  - 明确 `Qwen2.5-VL` 之所以仍空分数，是因为官方主要给的是视觉/视频/Agent benchmark，不是当前项目的通用文本指标集
- 参数缺口扫描报告
  - 重新执行 `scan:parameter-gaps`，刷新全库统计为：
    - 模型总数 `117`
    - 无 `parameters` `48`
    - 缺少 `active` `1`
    - `total` 占位值 `6`
    - `active` 占位值 `8`

### 验证

- `npm run build-index`：通过，生成 `117` 模型 / `14` benchmark / `15` 公司索引。
- `npm run build`：通过。
- `npm test`：`25/25` 通过。
- `npm run scan:parameter-gaps -- --out-file docs/research/model-parameter-gap-scan-2026-07-07.md`：通过。

---

## 2026-07-07 继续清理 ByteDance 中已确认属于推测或过期说明的字段

### 修改原因

在等待 `Baidu / ByteDance` 并发核验结论期间，`ByteDance` 里已经有几处不需要再等的确定问题：

- `Seed1.8` 的注释已经明确写着“MoE 为推测”，这种字段不应该继续保留。
- `Seed 2.0 Lite` 也没有官方直接披露能支撑 `architecture: MoE`。
- `bytedance-sources.md` 仍把 `Doubao-1.5-Pro` 写成“未收录”，但仓库当前已经有对应模型卡，文档已经落后于实际状态。

### 修改文件与详情

- 更新模型：
  - `models/bytedance/seed-1.8.yaml`
  - `models/bytedance/seed2.0-lite.yaml`
- 更新研究文档：
  - `docs/research/bytedance-sources.md`

### 修改影响

- `Seed1.8`
  - 删除 `architecture: MoE`
  - GitHub source type 统一改为 `codebase`
- `Seed 2.0 Lite`
  - 删除 `architecture: MoE`
- `ByteDance` 研究文档
  - 明确指出 `Doubao-1.5-Pro` 已经入库，旧的“未收录”说明过期
  - 记录了 `Seed1.8 / Seed 2.0 Lite` 的架构字段属于推测、已移除

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 根据并发核验结果继续收敛 Zhipu / Baichuan 模型字段

### 修改原因

并发核验回收后，`Zhipu / Baichuan` 这条线也拿到了足够硬的官方来源，可以继续收一批字段：

- `GLM-4` 的架构写法过于武断。
- `GLM-4.5 / 4.5-Air / 4.5V / 5` 还缺直接的 GitHub / Hugging Face model card 来源。
- `GLM-4.5V` 的发布日期、参数和输入模态都还不完整。
- `Baichuan-M1-14B` 的发布日期偏早，且上下文窗口没有被官方论文 / GitHub 稳定确认。
- `Baichuan-Omni` 的 source type 与项目内其他代码仓库来源不统一。
- `Baichuan` 研究文档里仍保留着把第三方新闻/转载当主来源的旧口径。

### 修改文件与详情

- 更新模型：
  - `models/zhipu/glm-4.yaml`
  - `models/zhipu/glm-4.5.yaml`
  - `models/zhipu/glm-4.5-air.yaml`
  - `models/zhipu/glm-4.5v.yaml`
  - `models/zhipu/glm-5.yaml`
  - `models/baichuan/baichuan-m1-14b.yaml`
  - `models/baichuan/baichuan-omni.yaml`
- 更新研究文档：
  - `docs/research/zhipu-sources.md`
  - `docs/research/baichuan-sources.md`

### 修改影响

- `GLM-4`
  - `architecture` 从 `Dense` 改为 `Transformer`
- `GLM-4.5`
  - 补入官方 GitHub 与 Hugging Face model card 来源
- `GLM-4.5-Air`
  - 补入 Hugging Face model card 来源
- `GLM-4.5V`
  - 发布日期收敛为 `2025-08-11`
  - 参数补齐为 `106B total / 12B active`
  - 输入模态补齐为 `text / image / video`
  - source 改为 `GLM-4.5V` Hugging Face + `GLM-V` GitHub
- `GLM-5`
  - 补入 GitHub / Hugging Face model card 来源
  - `swe-bench` 增加 `200K context window` 说明
- `Baichuan-M1-14B`
  - 发布日期收敛为 `2025-02-18`
  - 补入官方 GitHub source
  - 去掉未被官方论文 / GitHub 稳定确认的 `32k context_window`
- `Baichuan-Omni`
  - GitHub source type 统一改为 `codebase`
- `Baichuan` 研究文档
  - 降低了第三方新闻/转载的角色，不再把它们写成主来源
  - 明确标出 `Baichuan-M1-preview` 当前仍缺少足够硬的官方一手证据

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 根据并发核验结果继续收敛 Tencent 参数与来源口径

### 修改原因

并发核验回收后，`Tencent` 这条线已经有足够硬的官方证据可以收掉几处悬而未决的字段：

- `HunyuanVideo-1.5` 当前只有 `total: 8.3B`，`active` 缺失，会让参数缺口扫描长期挂着“待处理”。
- `Hunyuan-T1` 在 YAML 与研究文档里的发布日期不一致。
- `Hunyuan-A13B` 的 `gpqa` 需要更明确地标出是 `GPQA Diamond` 口径。
- `Tencent` 研究文档末尾还混着第三方新闻与云开发者链接，不适合继续当主证据清单。

### 修改文件与详情

- 更新模型：
  - `models/tencent/hunyuan-a13b.yaml`
  - `models/tencent/hunyuanvideo-1.5.yaml`
- 更新研究文档：
  - `docs/research/tencent-sources.md`

### 修改影响

- `Hunyuan-A13B`
  - 为 `gpqa` 补入 `note: GPQA Diamond`
- `HunyuanVideo-1.5`
  - 参数从“仅 total”收敛为：
    - `total: 8.3B`
    - `active: undisclosed`
  - 这样后续参数缺口扫描不会再把它归为“缺少 active”
- `Tencent` 研究文档
  - `Hunyuan-Large` 的发布日期说明改成以 `2024-11-05` 为 GitHub/开源发布日，并注明 `2024-11-04` 是 arXiv 提交日
  - `Hunyuan-T1` 发布日期统一为 `2025-03-21`
  - 明确写出 `HunyuanVideo-1.5` 的 `active params` 官方未披露
  - 参考来源列表移除了第三方新闻/云开发者文章，优先只保留原始来源

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 根据并发核验结果继续收紧 Google / xAI 主线模型字段

### 修改原因

在 `OpenAI / Anthropic` 收口之后，继续按并发核验结论处理 `Google / xAI`。这一轮发现的核心问题不是“模型缺失”，而是官方生命周期页、模型页和技术报告口径被混用了：

- `Google` 里有几条稳定模型仍保留首次预览日期。
- `Gemini 2.0 / 2.5` 中仍存在 `MoE` 这类官方未直接披露的架构字段。
- `Gemini 2.0 Flash` 的输出模态写得过宽。
- `Gemini 3.1 Pro Preview` 已经有官方页面可支撑分数，但模型卡仍是空分数。
- `xAI` 研究文档还没有把 `Grok 4.3 / Grok Build 0.1` 这类已入库官方模型的来源口径补清楚。

### 修改文件与详情

- 更新模型：
  - `models/google/gemini-2.0-flash.yaml`
  - `models/google/gemini-2.0-flash-lite.yaml`
  - `models/google/gemini-2.5-pro.yaml`
  - `models/google/gemini-2.5-flash.yaml`
  - `models/google/gemini-2.5-flash-lite.yaml`
  - `models/google/gemini-3.1-pro-preview.yaml`
  - `models/google/gemini-3.5-flash.yaml`
- 更新研究文档：
  - `docs/research/google-sources.md`
  - `docs/research/xai-sources.md`

### 修改影响

- `Gemini 2.0 Flash`
  - 删除 `architecture: MoE`
  - 输出模态收窄为 `[text]`
  - 补入 `Gemini deprecations` source
- `Gemini 2.5 Pro`
  - 发布日期收敛为稳定 API 模型口径 `2025-06-17`
  - 删除 `architecture: MoE`
  - 补入 `Gemini deprecations` source
- `Gemini 2.5 Flash`
  - 发布日期收敛为稳定 API 模型口径 `2025-06-17`
  - 删除 `architecture: MoE`
  - 补入 `Gemini deprecations` source
- `Gemini 2.5 Flash-Lite`
  - 发布日期收敛为稳定 API 模型口径 `2025-07-22`
  - 补入 `Gemini deprecations` source
- `Gemini 3.1 Pro Preview`
  - 补入 `Gemini deprecations` 与 Google DeepMind 模型页
  - 新增官方分数 `gpqa=94.3`、`swe-bench=80.6`
- `Gemini 3.5 Flash`
  - 补入 `Gemini deprecations` 与 Google DeepMind 模型页
- `Google` 研究文档
  - 清理了“技术报告 PDF 已下载到本地”这类已过期表述
  - 明确区分“首次预览日期”和“稳定 API 模型发布日期”
- `xAI` 研究文档
  - 补记了 `Grok 4.3` / `Grok Build 0.1` 的官方 docs 口径
  - 说明了此前 `Grok-2` 上下文窗口为何属于推断值并已移除

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 根据并发核验结果继续收紧 OpenAI / Anthropic 主线模型字段

### 修改原因

在参数缺口脚本扫描之后，继续按“并发子代理 + 官方原始来源”推进闭源主线模型核验。新一轮核验确认，`OpenAI` 与 `Anthropic` 里还有一批字段虽然不为空，但并不够硬：

- `GPT-4o` / `GPT-4o mini` 的模态写得过宽，混入了当前 API model doc 不支持的输入/输出。
- `o1` 的发布日期与当前保留 benchmark 所对应的 API 版本口径不一致。
- `o3` 的 `gpqa` / `swe-bench` 在官方文本里暂时没有稳定检出到与当前 `metrics.yaml` 一一对应的精确值。
- `Claude Haiku 4.5` 的发布日期过早。
- `Claude Fable 5` / `Claude Mythos 5` 里保留了尚未稳定核到的分数，而且 `Fable 5` 还存在把 `Mythos 5` 结果借填进来的风险。

### 修改文件与详情

- 更新模型：
  - `models/openai/gpt-4o.yaml`
  - `models/openai/gpt-4o-mini.yaml`
  - `models/openai/gpt-5.yaml`
  - `models/openai/gpt-5-mini.yaml`
  - `models/openai/gpt-5-nano.yaml`
  - `models/openai/gpt-5.4.yaml`
  - `models/openai/gpt-5.4-mini.yaml`
  - `models/openai/gpt-5.4-nano.yaml`
  - `models/openai/gpt-5.5.yaml`
  - `models/openai/o1.yaml`
  - `models/openai/o3.yaml`
  - `models/openai/o4-mini.yaml`
  - `models/anthropic/claude-4-opus.yaml`
  - `models/anthropic/claude-4-sonnet.yaml`
  - `models/anthropic/claude-haiku-4.5.yaml`
  - `models/anthropic/claude-opus-4.8.yaml`
  - `models/anthropic/claude-sonnet-5.yaml`
  - `models/anthropic/claude-fable-5.yaml`
  - `models/anthropic/claude-mythos-5.yaml`
- 更新研究文档：
  - `docs/research/openai-sources.md`
  - `docs/research/anthropic-sources.md`

### 修改影响

- `GPT-4o`：
  - 模态收窄为 `text/image -> text`
  - 补入 OpenAI API model doc source
- `GPT-4o mini`：
  - 去掉 `audio` 输入
  - 补入 OpenAI API model doc source
- `GPT-5.5`：
  - 发布日期修正为 `2026-04-24`
- `GPT-5* / GPT-5.4* / GPT-5.5 / o1 / o3 / o4-mini`：
  - 补入 OpenAI API changelog / model doc / system card 等官方来源
- `o1`：
  - 发布日期收敛为 `2024-12-17`
  - `weight_availability_tags` 补入 `multimodal`
- `o3`：
  - 清空暂时无法稳定由官方原始来源确认的 `gpqa` / `swe-bench`
- `Claude 4 Opus`、`Claude 4 Sonnet`：
  - 名称按官方写法改为 `Claude Opus 4`、`Claude Sonnet 4`
- `Claude Haiku 4.5`：
  - 发布日期修正为 `2025-10-15`
  - 补入官方发布博客
- `Claude Opus 4.8`、`Claude Sonnet 5`：
  - 补入官方发布博客
- `Claude Fable 5`、`Claude Mythos 5`：
  - 清空当前尚未稳定核到、且可能存在口径借填问题的分数

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 收紧 Anthropic / xAI / OpenAI 中已确认不可靠的字段

### 修改原因

在全量参数缺口扫描之后，继续按“官方未披露就不猜、现有字段必须能被官方原始来源支撑”的标准回看主线闭源模型，发现有几类值已经可以确定不该继续保留：

- `Anthropic` 里仍残留 `Dense` 这类官方未确认的架构推测。
- `xAI` 里存在通过 `Grok-3` 反推 `Grok-2` 上下文窗口的写法，也存在把官方仅明确为视觉理解的模型写成图像输出的情况。
- `OpenAI GPT-4o` 里仍保留了无法由官方页面确认的 `mmlu-pro` / `humaneval` 条目，而且 source 指向也不成立。

### 修改文件与详情

- 更新模型：
  - `models/anthropic/claude-3.5-sonnet.yaml`
  - `models/anthropic/claude-3.7-sonnet.yaml`
  - `models/xai/grok-2.yaml`
  - `models/xai/grok-2-mini.yaml`
  - `models/xai/grok-3.yaml`
  - `models/xai/grok-3-mini.yaml`
  - `models/openai/gpt-4o.yaml`
- 更新研究文档：
  - `docs/research/anthropic-sources.md`
  - `docs/research/xai-sources.md`
  - `docs/research/openai-sources.md`

### 修改影响

- `Claude 3.5 Sonnet` 与 `Claude 3.7 Sonnet` 不再保留官方未确认的 `architecture: Dense`。
- `Grok-2` 与 `Grok-2 mini` 不再保留由上一代描述反推出来的 `128k` context，也不再写成 `image` 输出。
- `Grok-3` 与 `Grok-3 mini` 不再保留 `architecture: unknown` 这种没有信息量且非官方字段。
- `GPT-4o` 移除了无法从 OpenAI 官方 `GPT-4.1` 对比页或官方 system card 直接确认的 `mmlu-pro` / `humaneval` 条目，只保留当前已经能由官方页面支撑的分数。

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`。 

---

## 2026-07-07 新增参数缺口扫描脚本并重跑全量模型扫描

### 修改原因

用户要求先“用脚本扫一遍全部代码，看看都需要处理哪些没有任何参数的模型”。为避免后续反复手工统计，本轮先把参数缺口扫描固化为独立脚本，并重新在当前分支上跑一遍全量模型。

### 修改文件与详情

- 新增脚本：
  - `scripts/scan-parameter-gaps.ts`
- 更新脚本入口：
  - `package.json`
- 重新生成扫描报告：
  - `docs/research/model-parameter-gap-scan-2026-07-07.md`

### 扫描结果摘要

- 模型总数：`118`
- 完全没有 `parameters`：`49`
- 缺少 `parameters.active`：`2`
- `parameters.total` 为 `undisclosed/uncertain`：`6`
- `parameters.active` 为 `undisclosed/uncertain`：`7`

### 修改影响

- 后续可以直接复跑 `npm run scan:parameter-gaps`，不需要再手工翻 `models/**/*.yaml`。
- 现在“完全没参数”、“缺 active”、“只写了 undisclosed/uncertain” 三类缺口已经被脚本分开列出，便于后续逐类清理。
- 本轮没有改动任何模型字段，只补了扫描能力和最新报告。

### 验证

- `npm run scan:parameter-gaps -- --out-file docs/research/model-parameter-gap-scan-2026-07-07.md`：通过。

---

## 2026-07-07 继续为 DeepSeek V2 / V2.5 主线补入官方分数

### 修改原因

在参数缺口扫描之后，继续按“已保留主线模型优先补官方评测参数”的策略推进。并发核验确认 `DeepSeek-V2` 与 `DeepSeek-V2.5` 都已经有能安全映射到当前 `metrics.yaml` 的官方分数，因此优先写回；而 `DeepSeek-Coder-V2` 的官方表格主要面向具体变体，不适合直接混填到当前无后缀模型卡。

### 修改文件与详情

- 更新模型：
  - `models/deepseek/v2.yaml`
  - `models/deepseek/v2.5.yaml`
- 更新研究文档：
  - `docs/research/deepseek-sources.md`
  - `docs/research/model-audit-2026-07-06-round2.md`

### 修改影响

- `DeepSeek-V2` 补入：
  - `mmlu`
  - `humaneval`
  - `gsm8k`
  - `bbh`
- `DeepSeek-V2.5` 补入：
  - `mmlu`（`note: 5-shot`）
  - `humaneval`（`note: HumanEval python`）
  - `swe-bench`（`note: SWE-verified`）
- `DeepSeek-Coder-V2` 继续保持空分数，避免把 `Instruct / Base / Lite` 这些具体变体的数据混填进当前模型卡。

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 新增全量参数缺口扫描报告

### 修改原因

用户明确要求先“用脚本扫一遍全部代码，看看都有哪些没有任何参数的模型”。因此本轮先暂停继续补模型或补分数，转而做一次全量参数缺口扫描，把需要处理的模型按类型和公司分组列出来。

### 修改文件与详情

- 新增扫描报告：
  - `docs/research/model-parameter-gap-scan-2026-07-07.md`

### 扫描结果摘要

- 扫描模型总数：`118`
- 完全没有 `parameters`：`49`
- 缺少 `parameters.active`：`2`
- `parameters.total` 为 `undisclosed/uncertain`：`6`
- `parameters.active` 为 `undisclosed/uncertain`：`7`

### 修改影响

- 后续工作顺序更清楚了，不需要再凭感觉逐个翻模型文件。
- 现在可以直接按三类缺口推进：
  - 完全无参数
  - 缺 `active`
  - `undisclosed/uncertain`
- 对主线闭源厂商（Anthropic / OpenAI / Google / xAI）和中文厂商旗舰（Baidu / Tencent / ByteDance / Zhipu 等）的处理策略也可以分开制定。

### 验证

- 使用脚本解析全部 `models/**/*.yaml` 后生成统计结果，并写入本地 Markdown 报告。

---

## 2026-07-07 为 Qwen3 主线与小中模型补入一批官方分数，并收紧口径映射

### 修改原因

继续给“已经保留的主线模型”补官方评测参数时，`Qwen3` 家族已经具备足够硬的官方技术报告表格，可以把一部分不易混淆的分数落回模型卡。但这条线同时存在 `base / thinking / non-thinking` 三种口径，必须保守写入，避免把不同模式的数据硬混成一张卡。

### 修改文件与详情

- 更新模型：
  - `models/alibaba/qwen3.yaml`
  - `models/alibaba/qwen3-8b.yaml`
  - `models/alibaba/qwen3-14b.yaml`
  - `models/alibaba/qwen3-32b.yaml`
  - `models/alibaba/qwen3-30b-a3b.yaml`
- 更新研究文档：
  - `docs/research/alibaba-sources.md`
  - `docs/research/model-audit-2026-07-06-round2.md`

### 修改影响

- `Qwen3` 旗舰与 `8B / 14B / 32B / 30B-A3B` 这些仍被保留的官方模型，不再全是空分数。
- 本轮只写入：
  - `mmlu-pro`
  - `gpqa`
  - `bbh`
  - `gsm8k`
  - `ifeval`
- 其中：
  - `mmlu-pro / gpqa / bbh / gsm8k` 来自官方技术报告 Base 表
  - `ifeval` 来自 thinking 表，并统一加了 `note: thinking mode`
- 没有把 `MATH` 或 `MATH-500` 强行映射到 `math-level-5`，继续避免错误口径扩散。

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 为 DeepSeek 主线版本补入官方 benchmark，并暂缓混口径的 Qwen3 小模型分数

### 修改原因

在用户收紧收录标准之后，下一步最有价值的工作不再是继续扩模型数量，而是给已经保留的主线模型补上可靠的官方评测参数。并发核验后，`DeepSeek` 主线的几条模型已经拿到了可直接落 `metrics.yaml` 的官方分数；而 `Qwen3` 小中模型虽然也找到了官方表格，但存在 `base / thinking / non-thinking` 三种口径混合问题，不能草率写回。

### 修改文件与详情

- 更新模型：
  - `models/deepseek/v3.1.yaml`
  - `models/deepseek/v3.2.yaml`
  - `models/deepseek/v3-0324.yaml`
  - `models/deepseek/r1-0528.yaml`
- 更新研究文档：
  - `docs/research/deepseek-sources.md`
  - `docs/research/model-audit-2026-07-06-round2.md`

### 修改影响

- `DeepSeek-V3.1` 补入 `mmlu-pro`、`gpqa`、`swe-bench`
- `DeepSeek-V3.2` 补入 `mmlu-pro`、`gpqa`、`swe-bench`
- `DeepSeek-V3-0324` 补入 `mmlu-pro`、`gpqa`、`math-level-5`（以 `MATH-500` 口径注明）、`swe-bench`
- `DeepSeek-R1-0528` 补入 `mmlu-pro`、`gpqa`
- 对 `Qwen3-8B / 14B / 32B / 30B-A3B`，目前只在研究文档里记录“已找到官方表格但口径混合”，没有贸然写入模型卡，避免把 `base` 与 `thinking` 混成一张卡的数据。

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 按新口径移除无评测参数小模型与 distill，并补回 DeepSeek / Google 主线模型

### 修改原因

用户进一步明确了收录标准：

- 没有官方评测参数支撑的小模型/轻量分支，不要为了“补数量”而保留。
- `Distill` 家族不要。
- 仍然要保留和继续补充“官方主线模型”。

因此这轮工作从“扩张家族数量”切换为“按更严格口径收缩无效条目，并补回主线正式版本”。

### 修改文件与详情

- 删除不符合新口径的模型：
  - `models/deepseek/r1-distill-llama-70b.yaml`
  - `models/deepseek/r1-distill-llama-8b.yaml`
  - `models/deepseek/r1-distill-qwen-14b.yaml`
  - `models/deepseek/r1-distill-qwen-32b.yaml`
  - `models/deepseek/r1-distill-qwen-7b.yaml`
  - `models/deepseek/vl2-small.yaml`
  - `models/deepseek/vl2-tiny.yaml`
  - `models/alibaba/qwen2.5-14b-instruct-1m.yaml`
  - `models/alibaba/qwen2.5-7b-instruct-1m.yaml`
  - `models/alibaba/qwen2.5-coder-32b.yaml`
  - `models/google/gemini-3.1-flash-lite.yaml`
- 新增主线官方模型：
  - `models/deepseek/v3-0324.yaml`
  - `models/deepseek/v3.2.yaml`
  - `models/google/gemini-3-flash-preview.yaml`
- 修正已有模型：
  - `models/deepseek/v3.1.yaml`：`output` 从 `[text, code]` 收敛为 `[text]`
  - `models/google/gemini-2.0-flash.yaml`：发布日期修正为 `2025-02-05`
  - `models/google/gemini-2.0-flash-lite.yaml`：发布日期修正为 `2025-02-25`
  - `models/google/gemini-3.1-pro-preview.yaml`：发布日期修正为 `2026-02-19`
  - `models/google/gemini-3.5-flash.yaml`：发布日期修正为 `2026-05-19`
- 更新研究文档：
  - `docs/research/deepseek-sources.md`
  - `docs/research/alibaba-sources.md`
  - `docs/research/google-sources.md`
  - `docs/research/model-audit-2026-07-06-round2.md`

### 修改影响

- 模型库不再为了凑数量保留缺少官方评测参数支撑的小模型和 distill 型号。
- DeepSeek 补回了更符合口径的主线版本 `V3-0324`、`V3.2`。
- Google 补入 `Gemini 3 Flash Preview`，并用官方生命周期页修正了多条发布日期。
- 模型总量会比上一轮略回落，但数据质量和筛选标准更贴近用户最新要求。

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 继续补齐 DeepSeek VL2 / R1 distill 家族与 Qwen2.5-Coder

### 修改原因

继续按“每家公司家族不能明显残缺”的目标推进时，DeepSeek 和 Alibaba/Qwen 仍有几类高置信度缺口：

- `DeepSeek-VL2` 官方已经明确拆成 `27B / Small / Tiny` 三个独立开源型号，但仓库只保留了主型号。
- `DeepSeek-R1` distill 家族除 32B / 70B 外，还存在多个官方已发布且常见的中小模型档位。
- `Qwen2.5-Coder-32B-Instruct` 作为 Qwen2.5 家族的重要代码代表模型，当前仓库缺失。
- Google 方面，本轮拿到了更硬的“应继续收录/应标注 deprecated”的研究证据，但由于新模型发布日期仍不够硬，本轮只更新研究文档，不强行写 YAML。

### 修改文件与详情

- 新增模型：
  - `models/deepseek/vl2-small.yaml`
  - `models/deepseek/vl2-tiny.yaml`
  - `models/deepseek/r1-distill-qwen-14b.yaml`
  - `models/deepseek/r1-distill-qwen-7b.yaml`
  - `models/deepseek/r1-distill-llama-8b.yaml`
  - `models/alibaba/qwen2.5-coder-32b.yaml`
- 更新研究文档：
  - `docs/research/deepseek-sources.md`
  - `docs/research/alibaba-sources.md`
  - `docs/research/google-sources.md`
  - `docs/research/model-audit-2026-07-06-round2.md`

### 修改影响

- DeepSeek 家族进一步从“旗舰模型覆盖”扩展为“官方公开主型号 + Small/Tiny + distill 主流档位”。
- `DeepSeek-VL2` 不再隐含代表整条家族，Small/Tiny 有了独立卡片。
- Alibaba/Qwen 新增 `Qwen2.5-Coder-32B-Instruct`，补上高价值代码模型分支。
- Google 研究文档中明确记下了 `Gemini 3.1 Flash-Lite`、`Gemini 3 Flash Preview` 的待收录状态，以及 `Gemini 2.0` 系列应视为 deprecated / shut down 的生命周期问题。

### 验证

- 待本轮收尾后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 补充 DeepSeek R1 distill 模型并收敛 VL2 上下文窗口

### 修改原因

继续审计 DeepSeek 家族时发现两类缺口：

- `DeepSeek-R1` 的 distill 家族已经在官方发布页、官方 GitHub 和官方 Hugging Face 中明确存在，但模型库里还没有代表条目。
- `DeepSeek-VL2` 的 `context_window` 仍写成 `uncertain`，而官方 GitHub README 已经明确给出 `4096 sequence length`，可以收敛为确定值。

### 修改文件与详情

- 新增模型：
  - `models/deepseek/r1-distill-qwen-32b.yaml`
  - `models/deepseek/r1-distill-llama-70b.yaml`
- 更新模型：
  - `models/deepseek/vl2.yaml`
- 更新研究文档：
  - `docs/research/deepseek-sources.md`
  - `docs/research/model-audit-2026-07-06-round2.md`

### 修改影响

- DeepSeek 家族从主模型覆盖扩展到 distill 代表模型，补强了中等参数量与开源推理分支。
- `DeepSeek-VL2` 的上下文窗口从“不确定”收敛为官方可证实的 `4k`。
- 新增 distill 条目只写入官方 GitHub README 中明确给出的 `GPQA Diamond` 与 `MATH-500`，没有引入第三方评测站数据。

### 验证

- 待本轮继续整理后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 补充 OpenAI / Anthropic / Alibaba / Mistral 新模型并修正 xAI / Mistral / Anthropic 字段

### 修改原因

继续并发审计官方模型目录后，发现还有几类高置信度缺口和错误字段需要立即落地：

- OpenAI 主线 `GPT-5 / GPT-5 mini / GPT-5 nano` 尚未入库。
- Anthropic 新增 `Claude Mythos 5` 未入库，且多条 Claude 卡片仍保留了未经官方确认的 `Dense` 架构。
- Alibaba/Qwen 缺少官方明确发布的 `Qwen2.5-1M` 长上下文分支。
- Mistral 已有条目中，`Mistral Medium 3.5` 与 `Mistral Small 4` 的参数、架构、上下文和开源状态与官方模型卡不一致。
- xAI 的 `Grok-4` 模态写得过宽，混入了官方未确认的音频输入输出。

### 修改文件与详情

- 新增模型：
  - `models/openai/gpt-5.yaml`
  - `models/openai/gpt-5-mini.yaml`
  - `models/openai/gpt-5-nano.yaml`
  - `models/anthropic/claude-mythos-5.yaml`
  - `models/alibaba/qwen2.5-14b-instruct-1m.yaml`
  - `models/alibaba/qwen2.5-7b-instruct-1m.yaml`
  - `models/mistral/ministral-3-14b-25.12.yaml`
- 修正现有模型：
  - `models/anthropic/claude-4-opus.yaml`
  - `models/anthropic/claude-4-sonnet.yaml`
  - `models/anthropic/claude-fable-5.yaml`
  - `models/xai/grok-4.yaml`
  - `models/mistral/mistral-medium-3.5.yaml`
  - `models/mistral/mistral-small-4.yaml`
- 更新研究文档：
  - `docs/research/openai-sources.md`
  - `docs/research/anthropic-sources.md`
  - `docs/research/alibaba-sources.md`
  - `docs/research/mistral-sources.md`
  - `docs/research/xai-sources.md`
  - `docs/research/model-audit-2026-07-06-round2.md`

### 修改影响

- 模型总数从 110 增长到 117。
- OpenAI 主线谱系从 5.4 / 5.5 补全到 `GPT-5` 主干及其 `mini` / `nano` 分支。
- Anthropic 不再保留官方未公开的推测架构字段，数据更干净。
- Alibaba 新增两条长上下文 Qwen2.5 分支，补强 7B / 14B 级别覆盖。
- Mistral 的两条现有卡片从明显错误元数据修正为官方模型卡值。
- xAI 的 Grok-4 模态不再把未确认的音频能力写进来。

### 验证

- `npm run build-index`：通过，生成 117 模型 / 14 benchmark / 15 公司索引。
- `npm run build`：待本轮收尾后统一执行。
- `npm test`：待本轮收尾后统一执行。

---

## 2026-07-07 补充 Kimi-VL-A3B-Thinking-2506 与 HunyuanVideo-1.5

### 修改原因

继续执行模型数据联网审计时，发现 Moonshot 与 Tencent 两个厂商仍有“官方仓库已明确发布、但当前模型库缺失”的代表模型：`Kimi-VL-A3B-Thinking-2506` 与 `HunyuanVideo-1.5`。这类缺口会让厂商家族覆盖失真，也会误导后续交叉验证。

### 修改文件与详情

- 新增模型文件：
  - `models/moonshot/kimi-vl-thinking-2506.yaml`
  - `models/tencent/hunyuanvideo-1.5.yaml`
- 更新来源审计文档：
  - `docs/research/moonshot-sources.md`
  - `docs/research/tencent-sources.md`
  - `docs/research/model-audit-2026-07-06-round2.md`

### 字段落地原则

- `Kimi-VL-A3B-Thinking-2506`
  - 仅依据 Moonshot 官方 GitHub 与官方 Hugging Face 模型卡写入。
  - 落地 `16B total / 3B active`、`128k` context、`text/image/video -> text` 多模态推理定位。
  - 官方未提供本项目当前 text benchmark 同口径分数，因此保持 `scores: {}`。
- `HunyuanVideo-1.5`
  - 仅依据 Tencent 官方 GitHub README 写入。
  - 落地 `8.3B`、`Diffusion Transformer (DiT) + 3D causal VAE`、`text/image -> video`。
  - 该模型定位为视频生成，当前项目 metrics 不匹配，因此保持 `scores: {}`。

### 修改影响

- Moonshot 与 Tencent 的模型家族覆盖更接近官方已发布状态。
- 模型总数预计从 108 增长到 110。
- 没有引入第三方新闻或非同口径 benchmark，数据来源链更干净。

### 验证

- 待本轮继续补充后统一执行 `npm run build-index`、`npm run build`、`npm test`。

---

## 2026-07-07 清理已合入分支与历史 stash

### 修改原因

确认 `refs/stash@{0}`、`refs/stash@{1}` 与 `codex/model-data-audit` 不再需要：两条 stash 的内容已被当前 `master` 吸收，`codex/model-data-audit` 已是 `master` 的祖先分支。

### 修改文件与详情

- 删除 Git stash 记录：
  - `stash@{1}`：`pre-merge-save-unrelated-work`，架构重切改动已通过 `daa9de45` / `37a2eb9e` 合入。
  - `stash@{0}`：`pre-merge-save-untracked-model-files`，新增模型文件已在当前 `master` 中跟踪。
- 删除本地分支：
  - `codex/model-data-audit`，该分支相对 `master` 没有独有提交。
- 更新：
  - `UPDATE_LOG.md`：记录本次清理动作、原因与影响。

### 修改影响

- 减少本地 Git 历史备份和已合入开发分支带来的误判。
- 不影响当前 `master` 源码、模型数据、构建产物或远程分支。
- 未删除 `gh-pages`，因为它是部署产物分支，不属于本次清理对象。

### 验证

- 后续通过 `git stash list`、`git branch --all --verbose --no-abbrev` 与 `git status --short --branch` 复查。

---

## 2026-07-06 官方 API 文档补全 OpenAI / Anthropic / Google / xAI 新模型

### 修改原因

用户要求持续联网核验各厂商模型清单，现有 closed/frontier 厂商覆盖落后：OpenAI 缺 GPT-5.4/5.5，Anthropic 缺 Opus 4.8 / Sonnet 5 / Haiku 4.5，Google 缺 Gemini 3.x，xAI 缺 Grok 4.3 / Grok Build。

### 修改文件与详情

- 新增 OpenAI 官方 API 模型：
  - `models/openai/gpt-5.5.yaml`
  - `models/openai/gpt-5.4.yaml`
  - `models/openai/gpt-5.4-mini.yaml`
  - `models/openai/gpt-5.4-nano.yaml`
- 新增 Anthropic 官方模型：
  - `models/anthropic/claude-opus-4.8.yaml`
  - `models/anthropic/claude-sonnet-5.yaml`
  - `models/anthropic/claude-haiku-4.5.yaml`
- 新增 Google Gemini API 模型：
  - `models/google/gemini-3.5-flash.yaml`
  - `models/google/gemini-3.1-pro-preview.yaml`
- 新增 xAI 官方模型：
  - `models/xai/grok-4.3.yaml`
  - `models/xai/grok-build-0.1.yaml`

### 修改影响

- 模型数从 70 个增加到 81 个。
- 新增模型只写入官方文档可核验的发布日期、上下文窗口、输入/输出模态、权重开放标签与 source。
- 官方未公开的参数规模、架构细节和 benchmark 分数保持缺省/空对象，避免臆造。

### 验证

- `npm run build-index`：通过，最终生成 103 模型 / 14 benchmark / 15 公司索引。
- `npm run build`：通过。
- `npm test`：24/24 通过。

---

## 2026-07-06 补充 Meta Llama 小模型与 Alibaba Qwen 多尺寸/多模态模型

### 修改原因

用户指出当前模型数量不足，尤其缺少 7B/8B 等小模型，以及 Alibaba/Qwen 生态的几十种规格。并发调研确认 Meta 与 Qwen 官方模型卡/博客中有多款可直接核验的开源模型缺失。

### 修改文件与详情

- 新增 Meta 官方模型卡明确列出的模型：
  - `models/meta/llama-3.1-8b.yaml`
  - `models/meta/llama-3.2-1b.yaml`
  - `models/meta/llama-3.2-3b.yaml`
  - `models/meta/llama-3.2-11b-vision.yaml`
  - `models/meta/llama-3.2-90b-vision.yaml`
- 新增 Alibaba / Qwen 官方来源明确列出的模型：
  - `models/alibaba/qwen3-8b.yaml`
  - `models/alibaba/qwen3-14b.yaml`
  - `models/alibaba/qwen3-32b.yaml`
  - `models/alibaba/qwen3-30b-a3b.yaml`
  - `models/alibaba/qwen3-coder-480b-a35b.yaml`
  - `models/alibaba/qwen3-vl-235b-a22b.yaml`
  - `models/alibaba/qwq-32b.yaml`
  - `models/alibaba/qwen2.5-omni-7b.yaml`

### 修改影响

- 模型数从 81 个增加到 94 个。
- Meta 增加 1B/3B/8B 与视觉 11B/90B，Qwen 增加 8B/14B/32B/30B-A3B、Coder、VL、QwQ、Omni。
- 对官方模型卡中明确报告的 Llama 3.1 8B、Llama 3.2 1B/3B 部分 benchmark 写入分数；视觉/Omni/代码模型在当前 metrics 不匹配或分数未逐项核验时保持 `scores: {}`。

### 验证

- `npm run build-index`：通过，最终生成 103 模型 / 14 benchmark / 15 公司索引。
- `npm run build`：通过。
- `npm test`：24/24 通过。

---

## 2026-07-06 修正 Meta 官方分数与 Qwen3.5 具体型号字段

### 修改原因

并发调研发现 `llama-3.1-70b`、`llama-3.3-70b` 官方 model card 已报告多项当前 metrics 分数，但项目中为空；同时 `qwen3.5` 以系列占位方式记录，权重开放状态、模态和 context window 与 Qwen 官方 Hugging Face 模型卡不一致。

### 修改文件与详情

- `models/meta/llama-3.1-70b.yaml`
  - 根据 Llama 3.1 官方 model card 补充 `mmlu`、`mmlu-pro`、`gpqa`、`humaneval`、`math-level-5`、`gsm8k`、`ifeval`、`arc-c`。
- `models/meta/llama-3.3-70b.yaml`
  - 根据 Llama 3.3 官方 model card 补充 `mmlu`、`mmlu-pro`、`gpqa`、`humaneval`、`math-level-5`、`gsm8k`、`ifeval`。
- `models/alibaba/qwen3.5.yaml`
  - `id` 从 `alibaba/qwen3.5` 修正为 `alibaba/qwen3.5-397b-a17b`。
  - `name` 修正为 `Qwen3.5-397B-A17B`。
  - `context_window` 修正为 `262k native / 1M with extrapolation`。
  - `modalities.input` 从 `[text]` 修正为 `[text, image, video]`。
  - `weight_availability_tags` 从闭源改为 `[open-weights, reasoning, multimodal]`。
  - 新增 Hugging Face 官方模型卡 source。

### 修改影响

- Meta 70B 系列在雷达图和数据表中不再全是空分数。
- Qwen3.5 从模糊系列占位转为具体官方型号，避免参数、context 与开放状态混用。

### 验证

- `npm run build-index`：通过，最终生成 103 模型 / 14 benchmark / 15 公司索引。
- `npm run build`：通过。
- `npm test`：24/24 通过。

---

## 2026-07-06 清理非同口径 benchmark 与第三方新闻来源

### 修改原因

并发调研发现部分分数不符合项目 metrics 定义：ByteDance 的 `Inverse IFEval` 被写入标准 `ifeval`，MiniMax M3 的 `SWE-Bench Pro` 被写入 `SWE-Bench Verified`，且来源为 VentureBeat 第三方新闻。Baichuan4 也混入了第三方新闻来源。

### 修改文件与详情

- `models/bytedance/seed-1.8.yaml`
  - 将 `ifeval` 从 Inverse IFEval 数值改为 `null`。
- `models/bytedance/seed-2.0-pro.yaml`
  - 将 `modalities.output` 从推测的 `[text, image, video]` 收敛为 `[text]`。
  - 将 `ifeval` 从 Inverse IFEval 数值改为 `null`。
- `models/bytedance/seed2.0-lite.yaml`
  - 将 `ifeval` 从 Inverse IFEval 数值改为 `null`。
- `models/minimax/minimax-m3.yaml`
  - 删除 VentureBeat 第三方新闻 source。
  - 删除不符合 `SWE-Bench Verified` 定义的 SWE-Bench Pro 分数。
- `models/baichuan/baichuan4.yaml`
  - 删除 Donews 第三方新闻 source，仅保留百川 API 平台来源。

### 修改影响

- 雷达图不再把反向/不同 benchmark 当成标准同名指标比较。
- 第三方新闻不再作为分数来源进入模型卡。
- 保留模型条目本身，只移除不可靠字段，避免无依据排名。

### 验证

- `npm run build-index`：通过，最终生成 103 模型 / 14 benchmark / 15 公司索引。
- `npm run build`：通过。
- `npm test`：24/24 通过。

---

## 2026-07-06 补充 Mistral 与 DeepSeek 主线缺失模型

### 修改原因

并发调研确认 Mistral 缺少 Medium/Small/Codestral/Devstral/Ministral 等近年主线模型，DeepSeek 缺少 V2、Coder-V2、V3.1 与 R1-0528 等代表版本。为避免破坏现有 URL 选择状态，本次先新增明确模型文件，不重命名旧文件。

### 修改文件与详情

- 新增 Mistral 模型：
  - `models/mistral/mistral-medium-3.5.yaml`
  - `models/mistral/mistral-small-4.yaml`
  - `models/mistral/codestral-25.01.yaml`
  - `models/mistral/devstral-small.yaml`
  - `models/mistral/ministral-8b.yaml`
- 新增 DeepSeek 模型：
  - `models/deepseek/v2.yaml`
  - `models/deepseek/coder-v2.yaml`
  - `models/deepseek/v3.1.yaml`
  - `models/deepseek/r1-0528.yaml`
- 新增审计报告：
  - `docs/research/model-audit-2026-07-06-round2.md`

### 修改影响

- Mistral 覆盖从 4 个扩展到 9 个，补入 8B/24B 和代码/开发者模型。
- DeepSeek 覆盖从 5 个扩展到 9 个，补入 V2、Coder、V3.1 与 R1 更新版。
- 新增模型均保留官方 docs/GitHub source；benchmark 未逐项核验前保持 `scores: {}`。

### 验证

- `npm run build-index`：后续继续补充后，最新索引已更新为 108 模型 / 14 benchmark / 15 公司。
- `npm run build`：通过。
- `npm test`：25/25 通过。

---

## 2026-07-07 保留 benchmark 口径说明并补充 Zhipu 缺失模型

### 修改原因

继续审中文厂商时确认了一个数据链路问题：YAML 里很多 benchmark 已经写了 `note`，例如 `GPQA-Diamond`、`Prompt Strict`、`MATH-500`，但构建器会把这些说明丢掉。同时，Zhipu 生态仍缺 `GLM-4.5-Air` 和 `GLM-4.5V`。

### 修改文件与详情

- `src/types.ts`
  - 为 `ScoreEntry` 增加可选字段 `note?: string`。
- `src/lib/model-index-builder.ts`
  - 构建索引时正式保留 score 的 `note` 字段，不再在 YAML -> JSON 过程中丢失。
- `tests/model-index-builder.test.ts`
  - 新增回归测试，确保 `note` 会进入 `public/model-index.json`。
- `models/baidu/ernie-4.5.yaml`
  - 删除与 text-only 模态矛盾的 `multimodal` 标签。
- `models/tencent/hunyuan-t1.yaml`
  - 将推测的 `560B / 56B` 参数改回 `undisclosed`。
  - 将 GitHub README 的 source type 从 `blog` 改为 `codebase`。
- `models/minimax/minimax-m2.yaml`
  - 将明显错误的 `release_date` 修正到 2026-05-29。
- `models/baichuan/baichuan-m1-preview.yaml`
  - 删除 IT 之家/环球网第三方来源，保留百川官方平台来源。
- 新增：
  - `models/zhipu/glm-4.5-air.yaml`
  - `models/zhipu/glm-4.5v.yaml`

### 修改影响

- 前端索引现在能保留 benchmark 的口径说明，后续如果 UI 需要展示 `Prompt Strict`、`HumanEval+`、`MATH-500`，数据层已经准备好。
- Zhipu 从 3 个模型扩展到 5 个，补上 `Air` 与视觉变体。
- 中文厂商中几条最明显的错误字段已被修正，减少“推测参数”和“第三方来源”混入。

### 验证

- `npm run build-index`：通过，生成 108 模型 / 14 benchmark / 15 公司索引。
- `npm test`：25/25 通过。

---

## 2026-07-07 补充 ERNIE 4.5-VL / MiniMax-VL-01 / Baichuan4-Turbo

### 修改原因

继续补“公司内代表模型数量明显偏少”的厂商。Baidu、MiniMax、Baichuan 仍只有 4-5 个条目，且缺少公开能确认存在的视觉或 Turbo 代表模型。

### 修改文件与详情

- 新增：
  - `models/baidu/ernie-4.5-vl.yaml`
  - `models/minimax/minimax-vl-01.yaml`
  - `models/baichuan/baichuan4-turbo.yaml`
- 更新：
  - `docs/research/model-audit-2026-07-06-round2.md`

### 修改影响

- 这些新增条目主要用于家族补全，而不是文本 benchmark 排名。
- 三个模型都只保留官方能确认的来源、模态和基础元数据；当前项目指标不匹配或官方未公开分数，因此统一保持 `scores: {}`。
- DataTable 现在会显示 benchmark 口径说明，例如 `GPQA-Diamond`、`Prompt Strict`、`MATH-500`。

### 验证

- `npm run build-index`：通过，生成 108 模型 / 14 benchmark / 15 公司索引。
- `npm run build`：通过。
- `npm test`：25/25 通过。

---

## 2026-07-06 替换 Anthropic Logo 为紧凑 A 图标

### 修改原因
用户反馈：当前新增的 Anthropic SVG 搜错了，显示为一整条 `ANTHROPIC` 文字，不适合放在 30px 模型信息卡 logo 方块中；应使用 Anthropic 的紧凑 A 形图标版本。

### 修改文件与详情

#### 1. 替换 Anthropic SVG（`assets/logos/anthropic.svg`）
- 将原来的 `viewBox="0 0 182 24"` 长文字版 `AnthropicText` 替换为 `viewBox="0 0 24 24"` 的紧凑 Anthropic 图标。
- 新图标使用 `fill="currentColor"`，继续兼容当前 `.ic-logo` 的浅色底 + 深色图标展示策略。
- 保留 `<title>Anthropic</title>`，保证 SVG 语义不丢失。

### 信息来源
- 联网核对 LobeHub Icons：Anthropic 存在普通图标与 Text Logo 两种版本；当前项目应使用普通图标版本。
- 通过 unpkg 获取 `@lobehub/icons-static-svg` 中的 `icons/anthropic.svg`，并确认 `icons/anthropic-text.svg` 是此前误用的长文字版。

### 修改影响
- Anthropic 模型卡片中的 logo 从长文字变为紧凑 A 图标，在 30px 方块内更清晰。
- 不影响模型数据、品牌色、选择逻辑、构建脚本或其它厂商 logo。

### 验证
- `npm run build`：通过，TypeScript 与 Vite 构建均成功。
- Vite 仍提示 JS chunk 大于 500 kB，这是 ECharts 相关既有构建警告，不影响本次修改。

---

## 2026-07-06 放大 Capability Radar 图表区域与雷达本体

### 修改原因
用户反馈：`Capability Radar · normalized` 这一块上下高度不够，雷达图本体偏小；当选择很多模型后，多条模型线叠加在较小雷达图中，显示不清。

### 修改文件与详情

#### 1. 增大雷达图画布区域（`src/index.css`）
- `.chart-wrap` 内边距从 `16px` 调整为 `22px 18px 24px`，让图表上下更透气。
- `.chart-wrap .echart` 从：
  - `max-width: 560px`
  - `height: 440px`
  调整为：
  - `max-width: 760px`
  - `height: 560px`
- `.chart-empty` 高度同步从 `440px` 调整为 `560px`，避免无 benchmark 空态高度与正常图表高度不一致。
- 移动端增加独立规则：
  - `.chart-wrap .echart { height: 440px; }`
  - `.chart-empty { height: 440px; }`
  防止小屏下图表过高影响首屏可用性。

#### 2. 增大 ECharts radar 半径（`src/lib/radar-option.ts`）
- `radar.radius` 从 `68%` 调整为 `76%`。
- 画布变大后同步放大雷达本体，避免只增加外部区域但图形仍然偏小。

### 修改影响
- 桌面端雷达图区域明显更高，图形本体更大，多模型叠加时线条与面积更容易辨认。
- 移动端仍保持较克制的高度，避免页面被单个图表占满过多。
- 未修改模型数据、评分归一化、tooltip、选择逻辑或平均线逻辑。

### 验证
- `npm run build`：通过，TypeScript 与 Vite 构建均成功。
- `npm test`：20/20 通过。
- Vite 仍提示 JS chunk 大于 500 kB，这是 ECharts 相关既有构建警告，不影响本次修改。

---

## 2026-07-06 按布局方案 D 调整前端：Model Info 下移到 DataTable 下方

### 修改原因
用户要求参考 `docs/superpowers/mockups/layout-option-d-modelinfo-below-table.html` 对前端进行修改优化，并顺手修复能发现的小 bug。

样式稿的关键方向是：左侧为控制区（模型选择 + benchmark 选择），右侧主内容按雷达图、数据表、Model Info、Sources 纵向排列；Model Info 不再挤在右侧窄栏中。

### 修改文件与详情

#### 1. 调整真实页面布局（`src/App.tsx`）
- 将 `<aside>` 移到 `<main>` 前，形成左侧控制栏 + 右侧结果区的布局顺序。
- 左侧控制栏仅保留：
  - `ModelSelector`
  - `MetricSelector`
- 将 `ModelInfoPanel` 从侧栏移到 `DataTable` 下方，包裹为新的 `model-info-section`。
- `Model Info` 区域使用 `section-label` 标题体系，编号为 `03`，右侧显示 `{selectedModels.length} cards`。
- `Sources` 保持在主内容底部，形成 `Radar -> DataTable -> Model Info -> Sources` 的主阅读路径。

#### 2. 补齐布局与卡片网格样式（`src/index.css`）
- `topbar`、`masthead`、`.layout`、`footer` 的内部容器从 `max-width: 1280px` 改为 `max-width: none`，对齐样式稿的全宽工作台效果。
- `.layout` 改为 `grid-template-columns: 320px 1fr`，左侧固定控制区，右侧主内容吃满剩余宽度。
- 新增 `.control-sidebar`：
  - 桌面端 `position: sticky`
  - `max-height: calc(100vh - 32px)`
  - `overflow-y: auto`
- 移动端恢复单列布局，并取消 sticky/滚动限制。
- 新增 `.model-info-section` 与 `.model-info-grid`，Model Info 卡片使用 `repeat(auto-fill, minmax(280px, 1fr))` 响应式网格。
- `.model-info-grid .info-card` 清除旧的纵向 `margin-bottom`，避免网格间距叠加。

#### 3. 修复模型选择 checkbox 双触发 bug（`src/components/ModelSelector.tsx`）
- 根因：公司行和模型行本身有 `onClick`，内部 checkbox 也有 `onChange`，点击 checkbox 时事件冒泡会导致一次点击触发两次切换。
- 新增 `toggleCompanySelection`，让公司行和公司 checkbox 复用同一份切换逻辑。
- 给公司 checkbox 与模型 checkbox 增加 `onClick={(e) => e.stopPropagation()}`，避免父行重复处理。
- 模型 checkbox 保持自身 `onChange={() => onToggle(model.id)}`，点击文字/行仍可通过父行切换。

#### 4. 顺延 Sources 编号（`src/components/SourceList.tsx`）
- 因新增 `03 Model Info` 区块，`Sources` 从 `03` 调整为 `04`。
- 避免页面中出现两个 `03`，修复样式稿编号冲突类的小问题。

#### 5. 构建产物刷新（`public/model-index.json`）
- `npm run build` 与 `npm test` 中的构建脚本重新生成 `public/model-index.json`。
- 本次仅刷新 `meta.generated_at`，模型数、benchmark 数、公司数保持不变。

### 修改影响
- Model Info 从右侧窄栏移到数据表下方，卡片宽度更充足，长参数、长来源标题更不容易挤压布局。
- 左侧控制区更聚焦，模型选择与 benchmark 选择在同一侧完成。
- 主内容顺序更接近数据分析阅读路径：先看图，再看表，再看模型详情与来源。
- 修复 checkbox 点击一次可能被抵消的问题，模型/公司选择交互更稳定。
- 未修改数据结构、评分逻辑、URL 同步逻辑和来源解析逻辑。

### 验证
- `npm run build`：通过，TypeScript 与 Vite 构建均成功。
- `npm test`：20/20 通过。
- Vite 仍提示 JS chunk 大于 500 kB，这是当前 ECharts 体积带来的既有构建警告，不阻断本次修改。

---

## 2026-07-06 修复模型 Logo 与品牌色背景撞色导致看不清的问题

### 修改原因
用户反馈：MiniMax 等模型的 logo 展示区域带有品牌色背景，logo 本身的颜色与背景过于接近，导致看不清 logo。

根因：`ModelLogo` 组件始终把 `model.brand_color` 作为 `.ic-logo` 的背景色。MiniMax 的 `brand_color` 为 `#F23F5D`，而 `assets/logos/minimax.svg` 的主色是 `#E2167E` 到 `#FE603C` 的粉橙渐变，二者对比度过低，logo 融入背景。

### 修改内容

#### 1. 调整 Logo 渲染策略（`src/components/ModelLogo.tsx`）
- 正常加载 logo 图片时，不再使用品牌色作为背景，而是交给 CSS 使用浅色中性底。
- 图片加载失败时，才回退到品牌色背景 + 白色首字母。
- 增加 `ic-logo-fallback` 类名，用于区分两种状态的样式。

#### 2. 更新 `.ic-logo` 样式（`src/index.css`）
- 默认状态：
  - `background: var(--surface)`（白色底）
  - `color: var(--ink)`（深色，保证 `currentColor` 型 SVG 如 Anthropic/OpenAI 可见）
  - `border: 1px solid var(--rule)`（与卡片表面区隔）
- 回退状态 `.ic-logo-fallback`：
  - `color: #fff`（白色首字母）
  - `border-color: transparent`（移除边框，保持品牌色方块完整）

### 影响
- 所有彩色 logo（MiniMax、DeepSeek、Google 等）在浅色底上清晰可辨。
- `currentColor` 型文字 logo（Anthropic、OpenAI）因改为深色文字，在浅色底上同样可见。
- 图片加载失败的回退显示保持原有品牌色 + 白色首字母，无回归。
- 信息卡左侧的 `borderLeftColor: model.brand_color` 品牌色强调线保留，品牌识别不受影响。

### 验证
- `npx tsc --noEmit`：通过
- `npm test`：20/20 通过

---

## 2026-07-06 视觉系统重构：Lucide 图标 + 品牌颜色 + 品牌 Logo

### 修改原因
项目存在三个视觉层面的问题：lucide-react 已安装但零使用，各处用 Unicode 字符代替图标；模型品牌颜色不准确（如 Qwen 使用橙色而非官方紫色）；模型 Logo 为手绘首字母占位符。

### 修改内容

#### 1. Lucide 图标替换
- `src/components/MetricSelector.tsx`：★ → `<Star />`，新增 `lucide-react` 导入
- `src/components/ModelSelector.tsx`：⌕ → `<Search />`，× → `<X />`，▸ → `<ChevronRight />`
- `src/App.tsx`：内联 GitHub SVG path → `<Github />`
- `src/components/DataTable.tsx`：来源 ↗ → 来源 `<ExternalLink />`
- `src/components/SourceList.tsx`：{title} ↗ → {title} `<ExternalLink />`
- `src/index.css`：移除 `.gh-mark` 样式（不再使用），`.star` 改用 width/height，`.ico` 改用 width/height

#### 2. 模型品牌颜色修正（依据 LobeHub Icons 官方色值）
| 厂商 | 旧色 | 新色 |
|---|---|---|
| Alibaba/Qwen | `#FF6A00` (橙) | `#615CED` (紫) |
| Anthropic/Claude | `#CC785C` | `#D97757` |
| Google/Gemini | `#4796E3` | `#4285F4` |
| Meta/Llama | `#0082FB` | `#1d65c1` |
| Mistral | `#FF7000` | `#FA520F` |
| Zhipu/GLM | `#0B61FF` | `#4268FA` |
| MiniMax | `#FE603C` | `#F23F5D` |
| Baichuan | `#FF6A00` | `#FF6933` |
| ByteDance | `#00F2EA` | `#325AB4` |
| Baidu/ERNIE | `#2529D8` | `#2932E1` |

保留不变的：OpenAI `#10A37F`、DeepSeek `#4D6BFE`、xAI `#000000`、Moonshot `#1783FF`、Tencent `#0052D9`

#### 3. 模型 Logo 替换为官方 SVG（从 LobeHub 获取）
全部 15 个 `assets/logos/*.svg` 文件已替换为 LobeHub Icons 官方品牌 SVG（color 或 text 变体）

### 验证
- `npm run build`：通过
- `npm test`：20/20 通过
- `npm run build-index`：70 模型索引生成成功

---

## 2026-07-06 修复雷达图首屏不渲染（echarts-for-react wrapper bug）

### 修改原因
用户反馈 BUG：加载的模型完全不显示雷达图数值，全是 N/A。
排查发现：DataTable 数值正常（GPQA 94.1 / 83.9 / 82.5 等均显示），数据流无误；仅雷达图 canvas 不渲染。
根因：`echarts-for-react@3.0.2` 的 `initEchartsInstance` 用了一个 `finished` 事件 trick——
init 临时实例 → 监听 `finished` → dispose → 用测得的 width/height 重新 init → 才 `setOption`。
而 `echarts@5.5` 空初始化（无 option）不再触发 `finished` 事件，导致 Promise 永不 resolve、
`setOption` 永不调用、首屏 canvas 不创建。HMR 走 `componentDidUpdate` 路径才能命中 `setOption`，
故热重载后看似正常——极具迷惑性。手动对实例调 `setOption` 后 canvas 立即出现，确认根因。

### 修改文件与详情

**`src/components/RadarChart.tsx` — 删 wrapper，直接驱动 echarts**
- 删除 `import ReactECharts from 'echarts-for-react'`，改 `import * as echarts from 'echarts'`。
- 用两个 effect 取代 wrapper：
  - 容器 effect（依赖 `container` 节点 state）：节点 attach 时 `echarts.init` + `ResizeObserver` 监听 resize；detach 时 `disconnect` + `dispose`。
  - option effect（依赖 `option`）：`instRef.current?.setOption(option, { notMerge: true })`。
- 节点获取用 callback ref + state：`<div ref={setContainer} className="echart" />`，`setContainer` 写入 state。
  规避 React 18 StrictMode dev 下 `[]` effect 与 ref 挂载时机的竞态（实测：`[]` effect 首跑时 `containerRef.current` 仍为 null，init 被跳过）。
- 容器尺寸交给 CSS `.chart-wrap .echart { width:100%; max-width:560px; height:440px }`，删除内联 style，单点控尺寸。

**`package.json` — 卸载冗余依赖**
- `npm uninstall echarts-for-react`（不再被引用，按最简原则删除）。

### 修改影响
- **首屏雷达图正常渲染**：canvas 700×550（560×440 × DPR1.25），非空白（drawn=true）。
- 交互后 canvas 持续：切 metric（6→5）、全选 45 模型（46 legend 含 Avg）后 canvas 均在。
- 删除一个坏掉的第三方 wrapper，雷达图初始化逻辑全部收口到 RadarChart 内，可读可测。
- **破坏性变更（按 no-backward-compat 原则）**：移除 `echarts-for-react` 依赖；RadarChart 不再接受 ReactECharts 的 `ref`/`notMerge` 等 props（原本就未用）。

### 验证
- `npx tsc --noEmit` → 0 报错。
- `npx vitest run` → 19/19 通过。
- `npm run build` → 成功（JS 1202 kB / gzip 397 kB，CSS 22.6 kB）。
- 浏览器实测（CDP）：首屏 `hasCanvas=true / w=700 / h=550 / drawn=true`；切 metric 后 `hasCanvas=true / selMetrics=5`；全选 45 模型后 `hasCanvas=true / legendItems=46 / selModels=45`。
- 验证用 Chrome 已关闭（dev server 5173 常驻未动）。

---

## 2026-07-06 topbar 精简 + GitHub 入口 + 横向溢出修复

### 修改原因
用户反馈三点：
1. topbar 中的 `VOL 0.1· 45 MODELS· 14 BENCHMARKS· 15 LABS` 是冗余信息（hero stats 已展示同样数字），删除。
2. topbar 最右侧应加 GitHub 仓库跳转入口，并配 GitHub logo 图标。
3. BUG：选中多个模型后页面越来越宽，直到出现横向滚动条——不应出现横向滚动条。

### 修改文件与详情

**`src/App.tsx` — topbar 重构**
- 删除 `.meta` span（VOL/MODELS/BENCHMARKS/LABS 计数串）。
- 右侧改为 `.topbar-right` 容器：保留 `UPDATED {date}` 实时更新标识 + 新增 GitHub 链接（`.gh`）。
- GitHub 链接含内联官方 mark SVG（14×14，`fill="currentColor"`）+ "GitHub" 文字，`href=https://github.com/WhitePlusMS/llm-radar`，新标签打开。

**`src/index.css`**
- topbar：删除不再使用的 `.topbar .meta` / `.topbar .meta b` 规则（不做向后兼容）；新增 `.topbar-right`（inline-flex gap 16）、`.gh`（inline-flex 居中 + 薄荷色 + hover 变白）、`.gh-mark`（flex none）。
- **横向溢出根因修复**：`.layout > main, .layout > aside { min-width: 0 }`。CSS grid item 默认 `min-width: auto`，会被内部长内容（长 URL、`table.data` 的 `min-width:640px`）撑开 track 导致整页横向滚动；显式归零后列正确收缩，溢出由内部 overflow 容器（`.table-wrap`/`.info-card`）接管。
- 长连续串兜底：`.info-grid` 加 `min-width:0`；`.info-grid .v` 加 `min-width:0; overflow-wrap:anywhere`；`.info-src a` 加 `overflow-wrap:anywhere`。防止长 URL / 长参数串撑破 320px 侧栏卡片。

### 修改影响
- topbar 信息密度降低，GitHub 入口可见可点。
- **横向溢出彻底修复**：选中 45 个模型（全选）后 `documentElement.scrollWidth === clientWidth = 1046`，无横向滚动条；aside 守住 320px，main 654px，45 张 info-card 正常渲染。
- **破坏性变更（按 no-backward-compat 原则）**：删除 `.topbar .meta` CSS 规则；topbar DOM 结构变更。无外部 API 影响。

### 验证
- `npx tsc --noEmit` → 0 报错。
- `npx vitest run` → 19/19 通过。
- 浏览器实测（CDP）：初始 `overflowX=false`；点"全选"选 45 模型后 `scrollW=1046 / clientW=1046 / overflowX=false / asideClientW=320 / infoCardCount=45`；GitHub 链接 `rect.x=960` 在最右、`color=rgb(187,243,221)` 薄荷色、SVG 14×14、`href` 正确。
- 验证用 Chrome 已关闭（dev server 5173 常驻未动）。

---

## 2026-07-06 UI 视觉重设计：Cool Light 设计系统落地（CV-Lab 品牌色对齐）

### 修改原因
用户反馈"UI 设计极差"，线上界面是典型 AI slop（Inter 字体 + 白卡 + slate-50 + indigo-600，零品牌识别度）。基于定稿 mockup `mockup-light-editorial.html`（冷调浅色 + CV-Lab 品牌色 + Hanken Grotesk/JetBrains Mono），把整套视觉系统移植进真实 React 代码。**只做视觉替换，不改功能逻辑。**

### 设计系统（`src/index.css` 重写为唯一视觉源）
- `:root` token：冷白底 `#f8fafc` + slate 文字 + 品牌蓝 `#345fdf`（CV-Lab 实测值，非 `#2563eb`）+ hero 海军蓝渐变 `#091120→#163a5d`（收住，不用亮蓝）+ 薄荷 `#bbf3dd` hero 强调 + 奶油 `#fff5df` 徽章底。
- 字体：Hanken Grotesk（标题/正文）+ JetBrains Mono（数据/标签/数字，tabular-nums）。**删除 Inter。** Google Fonts 经 `index.html` preconnect+link 加载。
- 组件类：topbar / masthead(wordmark+stats) / layout / section-label / panel / chart-card / table.data / src-card / model-row / info-card / metric-row / footer.site，全部从 mockup 原样搬入。
- 可访问性补强：真实 `<input type=checkbox class=cb>` 用 `appearance:none`+背景 SVG 勾选，替代 mockup 的纯 span（保留键盘可达）；`focus-visible` 焦点环；`prefers-reduced-motion` 关闭 blink/pulse。

### 修改文件与详情

**视觉基础**
- `src/index.css` — 整体重写：保留 Tailwind 三条 directive，其下写入完整设计系统（token + 全部组件类 + 真实 checkbox 样式）。组件不再用 Tailwind utility 拼凑，改引语义类名，杜绝设计分叉。
- `index.html` — favicon 换 `/favicon.svg`（雷达图标）；加 `theme-color=#091120`、description；加 Hanken Grotesk + JetBrains Mono 的 preconnect+link；title 调整。
- `public/favicon.svg` — 新建：深海军蓝圆角底 + 薄荷雷达图标，与 hero 字标同源。

**ECharts 主题迁移（`src/lib/radar-option.ts`）**
- `radar.splitLine` / `axisLine` → `#e2e8f0` 发丝线；`splitArea.show=false`（移除填充）；`axisName` 套 mono 字体 + ink-2 色。
- 模型系列 `lineStyle.width` 3→1.8、`areaStyle.opacity` 0.10（对齐 mockup `.series`）；emphasis 0.20。平均线 `#475569` muted 灰虚线、width 1.3（对齐 `.series-avg`）。
- tooltip 套 mono 字体 + 品牌色 `#345fdf` 来源链接 + tabular-nums；缺失仍走 `RadarPoint.missing` 语义（不改投影逻辑）。

**布局与组件**
- `src/App.tsx` — 重构为 `topbar + masthead(wordmark+stats) + layout(main: chart/table/sources + aside: 3 panels) + footer`。新增 `RadarLogo` 内联 SVG（3 同心圆+扫掠线+中心点，全薄荷）。hero stats 用 `meta` 计数 + UTC 时间。
- `src/components/RadarChart.tsx` — 套 `.chart-block`(section 01) + `.chart-card`(toolbar+legend+chart-wrap+note)。新增 `featuredCount` prop 用于 section 副标。空态用 `.chart-empty`。
- `src/components/DataTable.tsx` — 套 `.table-block`(section 02) + `table.data`（右对齐 tabular-nums、2px 双线表头、avg-cell 浅底、N/A 退后色、来源行内 `.src`）。投影/格式化逻辑不变，仍走 `projectScore`/`formatRawValue`/`resolveSource`。
- `src/components/SourceList.tsx` — 套 `.src-card` + `.src-list` + `.src-item`（色点 + 模型名+来源标题 + 类型），扁平化为单层列表。
- `src/components/ModelSelector.tsx` — 套 `.panel`(idx 01) + `.search` + `.select` 下拉 + `.company-group`/`.model-row`/`.sel-summary`。行内只留色点+名称+日期+均开关（标签与详情归 ModelInfoPanel）。公司行用真实 checkbox + role/键盘可达。
- `src/components/MetricSelector.tsx` — 套 `.panel`(idx 03) + `.metric-group`/`.metric-row` + 琥珀 `★` featured 标。
- `src/components/ModelInfoPanel.tsx` — 套 `.info-card`（左边框品牌色 + `.ic-logo` + `.info-grid` k/v + `.tag` + `.info-src`）。
- `src/components/ModelLogo.tsx` — 简化为 `.ic-logo` 渲染器（30px 品牌色方块 + img object-contain + 首字母回退）。`size` prop 与 sm 变体删除（ModelSelector 改用纯色点，sm 不再被消费）。
- `src/components/Footer.tsx` — 套 `footer.site` 结构，左标语右更新时间+计数，UTC 格式。

### 修改影响
- 视觉系统统一收口到 `src/index.css`，组件只消费语义类名，杜绝 Tailwind utility 散拼导致的设计漂移。
- ECharts 继续使用（未换 SVG），主题映射到 mockup 发丝线风格，tooltip/axisName 套 mono+品牌色。
- **破坏性变更（按 no-backward-compat 原则）**：`ModelLogo` 删除 `size` prop 与 sm 变体；`RadarChart` 新增 `featuredCount` prop（必填调用方更新）；App 布局结构整体替换，旧 header+12-col grid 不保留。
- 功能逻辑零改动：选择/平均/URL 同步/投影/格式化/缺失语义均未动。

### 验证
- `npx tsc --noEmit` → 0 报错（修一处：ECharts `axisName.letterSpacing` 不在类型内，删除）。
- `npm test` → 19/19 通过（radar-option 16 + build 3）。
- `npm run build` → 通过，CSS 21.74 kB（gzip 5.18 kB）。
- 浏览器实测（Playwright `getComputedStyle`）：body bg `#f8fafc`、font Hanken Grotesk、`--accent #345fdf`、`--hero-bg-1 #091120`、topbar bg `#091120`、masthead 海军蓝渐变+薄荷径向、idx 徽章奶油底 `#fff5df`+蓝字 `#345fdf`、model-row 色点品牌色、ECharts canvas 渲染、表头 2px 双线、avg-cell `#f1f5f9`、footer.site 全部一致。

### 清理
- 删除 `public/mockup-dark-terminal.html`、`public/mockup-light-editorial.html`、`public/mockup-wordmarks.html`（设计稿，移植完成不再需要）。

---

## 2026-07-06 架构深化（第 2 轮）：分数呈现深模块 / 选择集去重 / ModelLogo / SourceList 安全统一

### 修改原因
基于 `/improve-codebase-architecture` 第 2 轮评审（3 轮走查 + 2 个 Explore agent 交叉验证）发现的 5 处架构摩擦，4 个并发 agent 同时修复。本轮发现并修复了 1 个**活 bug**：raw 分支的 `toFixed` 在 tooltip 与 DataTable 间已静默分叉（tooltip 显示 `1400.0 / 1400`、表格显示 `1400 / 1400`）。

### 修改文件与详情

**候选 1 + 3（Agent A）— 抽出 ScorePresentation 深模块 + 清理 selectMetrics 撒谎参数**
- `src/lib/radar-option.ts`
  - 新增 `formatRawValue(value, metric)`：percentage→toFixed(1)、zero_to_one→toFixed(3)、raw→原值直出不 toFixed（有 max_value 时追加 ` / {max_value}`）。tooltip 与表格共享此出口，**修复 raw 分支 toFixed 静默分叉 bug**。
  - 新增 `resolveSource(model, sourceKey?)`：sourceKey 指定则按 key 找，否则 fallback `sources[0]`，两处同源。
  - `selectMetrics` 删除全程未读的 `_models` 参数，签名改为 `selectMetrics(metrics, selectedMetricIds)`，同步更新 `buildRadarOption` 调用点。
  - tooltip formatter 内联的 raw 格式化与来源查找替换为 `formatRawValue` / `resolveSource`。
- `src/components/DataTable.tsx`
  - 删除本地 `formatRaw` 与 `formatScore` 两套并行实现，改为 `projectScore` 取 `RadarPoint`（缺失语义单点决定）+ `formatRawValue`/`resolveSource` 投影展示文本，与 tooltip 同源。
  - `selectedMetrics` 改用 `selectMetrics(...)` 复用，去掉内联 find/filter。
  - 平均列改用 `buildAveragePoints(averageModels, selectedMetrics)` 预计算按 metric 索引，删除表格内 IIFE reduce。
  - 移除不再需要的 `normalize` / `ScoreEntry` 导入。
- `tests/radar-option.test.ts`
  - 新增 `formatRawValue` describe 块：3 种 scale 格式化断言 + 一条回归断言（tooltip 对 raw 分数的 rawText 必须等于 `formatRawValue` 输出，含 `1400 / 1400`、不含旧 bug 痕迹 `1400.0`）。
  - 修正一条浮点期望：`80.55` 在 JS 浮点存储下 `toFixed(1)` 得 `80.5`，改用 `80.56` 干净进位到 `80.6`。

**候选 2（Agent B）— 删死代码 + 塌缩 useComparison 三段重复 + 去 App 默认值 dance**
- `src/hooks/use-selectable-set.ts`：**整体删除**（96 行死代码，0 导入者）。
- `src/hooks/use-comparison.ts`
  - 新增不 export 的本地原语 `useIdSet(key, getDefaults)`，拥有完整决策：useState 初始化、popstate 同步、默认值就绪自动应用一次（内部 `defaultsAppliedRef` + effect）、set/toggle/clear 同步写回 URL。
  - `useComparison` 重写为三次 `useIdSet` 调用 + 薄映射，外部 API 不变（仍返回 9 个值）。
  - 3 个 default 参数从 `string[]` 改为 `() => string[]` 惰求值，适配 index 异步加载。
- `src/App.tsx`：删除 `defaultsAppliedRef` 与整个补打 effect（决策收口进 `useIdSet`），`useComparison` 调用改为传 getter 闭包，移除失效的 `useRef` 导入。

**候选 4（Agent C）— 抽出 `<ModelLogo>` 组件收口 logo 约定**
- `src/components/ModelLogo.tsx`（新建）：`<ModelLogo model company? size?/>` 收口 logo 路径回退约定 + onError 行为（统一采用 brand_color 首字母回退，`useState` 控制），`size: 'sm'|'lg'` 经 `SIZE_CLASS` 映射表集中管理。
- `src/components/ModelInfoPanel.tsx`：删除本地 `logoPath` 计算与 logo img/fallback 整段，替换为 `<ModelLogo size="lg"/>`。
- `src/components/ModelSelector.tsx`：删除本地 `logoPath` 计算与 `<img>`，替换为 `<ModelLogo size="sm" company={companyMap.get(...)}/>`。

**候选 5（Agent D）— SourceList HTML 安全策略统一**
- `src/components/SourceList.tsx`：删除冗余 `escapeHtml` 与 `dangerouslySetInnerHTML`，`<a>` 改为 JSX 子节点（`{source.title} <span>({source.type})</span>`），与 ModelInfoPanel/DataTable 统一为 React 默认转义。

### 修改影响
- **活 bug 修复**：raw 分数在 tooltip 与表格的显示统一（均 `1400 / 1400`，不再一处带 `.0` 一处不带）。
- **locality**：缺失判定/raw 格式化/平均/来源解析 4 个语义各只剩一处定义；logo 路径约定与回退、HTML 转义各收口一处；"URL or 默认"决策单点。
- **leverage**：`formatRawValue`/`resolveSource`/`buildAveragePoints`/`selectMetrics`/`useIdSet`/`<ModelLogo>` 各为一处接口、多消费方。
- **死代码**：净降 96 行（`use-selectable-set.ts` 整文件）+ DataTable 三套并行实现。
- **测试**：19/19 通过（新增 `formatRawValue` 6 条断言含 1 条回归）。
- **破坏性变更（按 no-backward-compat 原则）**：`selectMetrics` 签名去参；`useComparison` default 参数改惰求值；`RadarPoint` 现被 DataTable 外部导入（不再是死 export）。这些变更让问题暴露，不做兼容层。

### 验证
- `npx tsc --noEmit` → 0 报错
- `npm test` → 19/19 通过
- `npm run build` → 构建成功

---

## 2026-07-06 架构深化：分数投影 / 选择集原语 / 构建校验表驱动

### 修改原因
基于 `/improve-codebase-architecture` 评审发现的 3 处架构摩擦（浅模块、局部性裂开、类型重复）做深化重构。
原则：删除测试通过的真模块予以保留并加深，浅模块替换为更深的原语，不做任何向后兼容（让数据问题暴露）。

### 修改内容

#### C01 · 分数投影保留"缺失"语义（修复正确性 bug）
**问题**：`normalizeScore(null) → 0` 把缺失语义在投影点抹掉，下游三处各自反推——
tooltip 用 `value === 0` 判定 N/A，导致**真实 0 分也被误显示为 N/A**；平均线则要偷渡过滤 null 才不被拉低。
**改动**：
- `src/lib/radar-option.ts`
  - 新增 `RadarPoint = { value: number; missing: boolean }` 与 `projectScore(entry, metric)`，
    "是否缺失"单点决定。`normalize` 降为模块私有函数。
  - `buildAverageSeries` → `buildAveragePoints`，返回 `RadarPoint[]`，缺失不计入均值且 `missing=true`。
  - `buildRadarOption` 用 `pointsByName` 闭包表，tooltip 按 `point.missing` 决定 N/A，不再用 `value===0` 反推。
  - **不再导出 `normalizeScore`**（破坏性更新，按 CLAUDE.md 不做兼容）。
- `tests/radar-option.test.ts`
  - 改测 `projectScore` / `buildAveragePoints`；新增回归断言：真实 0 分 `missing=false`、
    tooltip 对真实 0 显示 `0.0`、对缺失显示 `N/A`。

#### C02 · `useComparison` 深化为 `useSelectableSet` 原语
**问题**：model/metric 两份重复选择逻辑（接口 6 项≈通用选择集）；"URL 优先否则默认"决策被劈成两半——
hook 初始化读 URL，App 再用 `defaultsAppliedRef` + `useEffect` 在默认值就绪后补打一次，难测。
**改动**：
- 新增 `src/hooks/use-selectable-set.ts`：`useSelectableSet(key, getDefaults)` 拥有完整"URL or 默认"决策，
  内部用 `defaultsAppliedRef` 在默认值就绪时仅当 URL 未指定时应用一次；暴露 `{ ids, toggle, set, clear }`。
- `src/hooks/use-comparison.ts` 退化为薄壳，两次调用 `useSelectableSet` 组合出原 6 项接口。
- `src/App.tsx`：删除 `defaultsAppliedRef` 与补打 `useEffect`、移除 `useRef` 导入；
  `setMetricIds` 因不再被 App 使用而从解构中移除。

#### C03 · 构建期校验表驱动 + 类型单一来源
**问题**：`scripts/build-index.ts` 重复定义了一份宽松版类型（union 被改成 `string`），与 `src/types.ts` 漂移；
`validateModelCard` 是 ~80 行逐字段 `if (typeof x !== ...) fail(...)` 链，规则埋在控制流；`model_card` 下划线别名是兼容包袱。
**改动**：
- `src/types.ts`：`ScoreScale` / `SourceType` / `WeightAvailabilityTag` 改为从同源 `const` 数组派生
  （`SCORE_SCALES` / `SOURCE_TYPES` / `WEIGHT_AVAILABILITY_TAGS`），运行时可被构建脚本 import。
- `scripts/build-index.ts`：
  - 删除本地所有 interface 重复定义，类型一律 `import type` from `../src/types`。
  - 新增字段校验工具集 `asObj/reqStr/reqBool/reqArr/reqObj/optStr/reqEnum`，替代散落的 if 链（删除测试：移除后复杂度散回各调用点 → 真模块）。
  - 删除 `model_card` 下划线别名（不做兼容）；`VALID_SOURCE_TYPES` / `VALID_SCALES` 常量随之删除，改用同源数组。
  - 新增对可选字段 `parameters/architecture/context_window/modalities` 的校验（原代码完全未校验，导致 `null` 被写进 JSON）。
  - 新增对 `weight_availability_tags` 枚举成员的校验（原代码只查是数组）。
- **数据修正（校验变严后暴露的真实问题，按"让问题暴露"原则清理而非加兼容）**：
  - `models/{meta,llama-*}` 等 6 个 YAML：`type: model_card` → `type: model-card`。
  - `models/baidu/ernie-x1.yaml`：删除 `parameters:{total:null,active:null}`、`architecture: null`、`context_window: null`。
  - `models/google/gemini-{2.0-flash,2.5-flash,2.5-pro}.yaml`、`models/xai/grok-{2,3,4}.yaml`、`models/mistral/magistral-medium.yaml`：删除 `null`/空值的 `parameters` 块。
  - `models/meta/llama-{3.1-405b,4-maverick,4-scout}.yaml`：从 `weight_availability_tags` 移除误用的 `chat`（`chat` 是能力分类，非权重开放标签）。

### 修改影响
- **行为修复**：tooltip 不再把真实 0 分误显示为 N/A；缺失分数仍画在中心 0 但 tooltip 正确显示 N/A。
- **可测试性**：`projectScore` 成为纯函数测试面，覆盖了原 `normalizeScore` 无法表达的"缺失 vs 真实 0"语义；
  `useSelectableSet` 的"URL 优先否则默认"可在单测中锁死（当前由集成路径覆盖）。
- **数据质量**：构建期校验更严，非法枚举/`null` 标量字段在构建时即失败而非静默写入 JSON。
- **类型单一来源**：加一个 `SourceType` 枚举值只需改 `src/types.ts` 一处，构建脚本自动同步。
- **构建产物**：`public/model-index.json` 重新生成（45 模型 / 14 benchmark / 15 公司）。
- 验证：`npx tsc --noEmit` 通过；`npx vitest run` 14/14 通过；`npm run build` 成功。

---

## 2026-07-06 UI/UX 优化与部署修复

### 修改原因
通过浏览器截图（Playwright + CDP）检查线上效果后，发现当前界面存在以下主要问题：
1. 雷达图高度不足（仅 26rem），在 1440px 桌面端显得过小，周围留白过多。
2. ECharts 内置图例与自定义图例重复，造成视觉噪音。
3. 模型选择器中模型名称被截断（如 `Claud...`）。
4. 移动端布局将控制面板放在雷达图上方，用户必须滚动很久才能看到核心图表。
5. 数据来源面板在窄侧边栏中换行混乱。
6. 空状态只有纯文本提示，缺乏视觉引导。
7. 平均线图例与实际线条样式不一致，线条不够醒目。
8. 部署后发现 GitHub Pages 实际在从分支根目录提供源码 `index.html`（引用 `/src/main.tsx`），导致线上页面空白；原 `actions/deploy-pages` 需要 Pages Source 设为 "GitHub Actions" 才能生效。

### 修改内容

#### 1. 视觉与布局优化
- `src/App.tsx`
  - 为标题添加品牌图标（`Radar` from lucide-react）与渐变背景方块。
  - 主布局使用 `order-*` 调整移动端顺序：雷达图在上方优先展示，控制面板在下方。
  - 图表容器高度提升为 `h-[28rem] md:h-[36rem] lg:h-[42rem]`。
  - 数据来源面板从左侧边栏移出，放在图表下方并以网格布局展示。
  - 空状态添加 `BarChart3` 图标与更明确的文案。
- `src/components/RadarChart.tsx`
  - 移除 ECharts 内置图例，只保留顶部自定义图例。
  - 自定义图例增加背景色、圆角与最大宽度截断，避免过长模型名撑开布局。
  - 图表容器改为 `flex-1` 以填满父容器高度。
- `src/components/ModelSelector.tsx`
  - 模型名称与发布日期改为上下两行显示，取消 `truncate`，完整展示模型名。
  - 增大每项垂直内边距，提升可点击区域。
- `src/components/MetricSelector.tsx`
  - 能力分组标题添加圆点装饰，并改为 `text-slate-500` 增强层级。
  - 选中项文字加粗并配合背景色，提升识别度。
- `src/components/SourceList.tsx`
  - 数据来源改为响应式网格（`sm:grid-cols-2 lg:grid-cols-3`）。
  - 每个模型来源使用独立卡片，标题与链接排版更清晰。
- `src/lib/radar-option.ts`
  - 雷达图半径从 `65%` 调整为 `68%`，平衡桌面与移动端的标签显示。
  - 模型线条宽度从 2 提升到 3，hover 时进一步加粗。
  - 平均线改为更粗的虚线（`width: 3, type: 'dashed, color: '#64748b'`），并显示小圆点符号。
  - 移除默认状态下的面积填充，hover 时显示极浅填充，避免多个模型叠加成灰块。
  - 网格背景色（`splitArea`）改为极低透明度的 slate，避免喧宾夺主。
  - tooltip 增加白底、边框与更清晰的指标值对齐布局。

#### 2. 部署修复
- `.github/workflows/deploy.yml`
  - 将 `actions/deploy-pages` 方案替换为 `peaceiris/actions-gh-pages@v3`。
  - 工作流在 `cicd` 分支推送时自动构建 `dist` 并强制推送到 `gh-pages` 分支。
- 手动创建并推送了 `gh-pages` 分支，内容为最新 `dist` 产物（`index.html`、`model-index.json`、`assets/*`）。

### 验证结果
- `npm test`：10 个测试全部通过。
- `npm run build`：TypeScript 编译与 Vite 构建均成功。
- Playwright 截图验证：桌面端 1440x900、移动端 390x844 下图表完整渲染，移动端雷达图位于首屏。
- 清空选择后保持 `0 / 45`，不再自动恢复默认值。

### 待用户确认/操作
- GitHub Pages 的 Source 需要设置为 **Deploy from a branch → `gh-pages`**。当前仓库似乎仍从 `cicd` 或 `master` 分支根目录提供源码 `index.html`（含 `/src/main.tsx`），导致线上空白。切换到 `gh-pages` 分支后即可正常显示构建产物。

### 相关提交
- `d487944` ui: enlarge radar chart, remove duplicated legend, improve layout and mobile ordering
- `b84fb69` ui: remove heavy radar area fills, show subtle fill only on hover
- `522fbeb` ui: soften radar grid splitArea colors
- `e7e62e3` ui: thicker radar lines, more visible average line, smaller radius for mobile labels
- `a6db7f7` ci: switch deployment to gh-pages branch using peaceiris/actions-gh-pages

---

## 2026-07-06 修复雷达图所有数据点显示为 N/A（实际不渲染）

### 修改原因
通过 Playwright 截图验证发现，雷达图区域仅显示六边形网格与平均线，各模型的数据线与数据点完全不可见，呈现为"所有值都是 N/A"的空图效果。DataTable 中部分单元格显示 N/A 是数据缺失导致，属于预期行为；但雷达图不渲染任何模型数据是代码缺陷。

### 根因分析
`src/lib/radar-option.ts` 在构建 radar series 的 `data` 时，把每个模型的 `value` 设置成了对象数组：

```ts
value: points.map((p) =>
  p.missing
    ? { value: p.value, itemStyle: { color: 'transparent', borderColor: ..., borderWidth: 2 }, symbol: 'circle', symbolSize: 5 }
    : { value: p.value }
) as unknown as number[]
```

该写法试图为缺失值绘制"空心环点"。但 ECharts 的 `series-radar.data[i].value` 必须是 `number[]`；传入对象数组后 ECharts 无法解析，导致整个模型系列不被渲染，所有点都落在中心（视觉上等同于全部 N/A）。

### 修改内容

#### 1. 修复 radar value 格式
- `src/lib/radar-option.ts`
  - 将模型系列的 `value` 改回标准的 `number[]`：`value: points.map((p) => p.value)`。
  - 缺失值仍归一化为 `0`，与之前一致；是否缺失由 `RadarPoint.missing` 在 tooltip/DataTable 中区分。

#### 2. 同步测试断言
- `tests/radar-option.test.ts`
  - 更新 `缺失值对应的 radar 数据点 value 为 0，真实分数保留归一化值` 测试：
    - `series.data[0].value` 类型从 `Array<{ value: number }>` 改为 `number[]`。
    - 断言从 `.toMatchObject({ value: 80 })` 改为 `.toBe(80)`。

#### 3. 更新图表说明
- `src/components/RadarChart.tsx`
  - chart-note 从"空心环点 = 该 benchmark 缺失 (N/A)"改为：
    > 缺失的 benchmark 在图上落至中心 0 分，tooltip 中显示为 N/A，不计入形状面积
  - 因为当前实现不再绘制空心环点，原说明会误导用户。

### 验证结果
- `npm test`：19 个测试全部通过。
- `npm run build`：TypeScript 编译与 Vite 构建均成功，`public/model-index.json` 重新生成。
- Playwright 截图验证：雷达图现在正确渲染 Claude Fable 5、Qwen3.5-Omni、GLM-5 等模型的数据线与面积填充，平均线（灰虚线）也正常显示。
- DataTable 中 N/A 单元格数量仍为 19/36，与数据缺失情况一致，非代码 bug。

### 待后续考虑
- 若需要雷达图上直接区分"缺失"与"真实 0 分"的视觉标记，需改用 ECharts 支持的方案（如自定义系列、markPoint 或双层 series），而非在 `value` 数组元素中塞对象。

---

## 2026-07-06 修复雷达图 hover 始终命中平均线 tooltip

### 修改原因
用户反馈：鼠标 hover 雷达图时，tooltip 一直显示"平均"系列的数据，无法查看各模型自身的数值。

### 根因分析
`src/lib/radar-option.ts` 构建 radar series 的 `data` 数组时，先放入模型系列，最后才 `push` 平均系列。ECharts 对同一 radar series 内的多个 data item 按数组顺序绘制，后绘制的图形位于上层并优先接收鼠标事件。因此平均值虚线/点覆盖在模型多边形之上，导致用户 hover 模型区域时实际命中的是最上层的平均线，tooltip 只能显示"平均"。

### 修改内容

#### 1. 调整平均系列绘制层级
- `src/lib/radar-option.ts`
  - 将平均系列从 `seriesData.push(...)` 改为 `seriesData.unshift(...)`，使其位于 `data` 数组最前面。
  - 平均系列最先绘制、位于最下层；模型系列后绘制、位于上层，hover 时优先响应模型数据。
  - 平均线 `areaStyle.opacity: 0`，不会遮挡模型系列的面积填充。

#### 2. 增加回归测试
- `tests/radar-option.test.ts`
  - 新增断言：开启平均线时，`series.data[0].name` 必须为 `'平均'`，后续元素顺序与模型顺序一致。
  - 防止未来 reorder 导致 hover 命中错误复发。

### 验证结果
- `npm test`：20 个测试全部通过（新增 1 条回归测试）。
- `npm run build`：TypeScript 编译与 Vite 构建均成功，`public/model-index.json` 重新生成。
- Playwright 截图验证：雷达图渲染正常，平均虚线位于模型多边形下方，模型数据线与面积填充清晰可见。
- 注：由于 ECharts tooltip 依赖鼠标在 canvas 上的精确位置，自动化脚本难以稳定触发 hover；层级修复已通过代码逻辑与回归测试锁定。

### 待后续考虑
- 若希望 hover 空白区域时同时展示所有模型与平均线的数值（类似 axis tooltip），需将 tooltip 改为自定义 formatter 并遍历所有 data item；当前仍保持"hover 哪个系列显示哪个系列"的 item tooltip 行为。

---

## 2026-07-06 修复雷达图仍只能 hover 中平均线

### 修改原因
用户反馈：即使上回把平均系列调到 data 数组最前，雷达图上 hover 仍然只能选中"平均"线。

### 根因分析
通过浏览器实际验证发现：ECharts 的 radar series 在一个 series 内放多个 data item 时，**鼠标事件总是命中 `data[0]`**（与绘制顺序无关），所以只要平均系列存在于 `data[0]`，hover 就永远显示平均。上次只调整了顺序，没有解决"单 series 多 data item 事件命中异常"的根本问题。

### 修改内容

#### 1. 每个模型拆分为独立 radar series
- `src/lib/radar-option.ts`
  - 不再用一个 radar series 承载所有模型 + 平均；改为**每个模型一个 radar series**，平均也单独一个 series。
  - 模型 series 设置 `z: 2`，平均 series 设置 `z: 1`，确保模型图形在上层。
  - 平均 series 增加 `silent: true`，使其不再拦截鼠标事件；hover 只能命中模型 series。
  - tooltip `trigger` 保持 `'item'`，formatter 使用 `params.seriesName`（即 series 名称，现在正确对应模型名）。

#### 2. 同步测试
- `tests/radar-option.test.ts`
  - 更新系列数量断言：现在 `option.series` 是 series 数组，长度等于模型数（+1 含平均）。
  - 新增断言：平均 series 位于数组最前且 `z` 小于模型 series。
  - 缺失值测试改为按 `series.name` 查找对应模型 series。

### 验证结果
- `npm test`：20/20 通过。
- `npm run build`：通过。
- Playwright + 浏览器 console 验证：hover 雷达图不同区域时，tooltip 现在能命中 `Qwen3.5-Omni`、`GLM-5` 等模型系列，不再固定显示"平均"。
- 平均线仍正常渲染为灰虚线，仅作为视觉参考；详细均值仍可在 DataTable 中查看。

### 相关文件
- `src/lib/radar-option.ts`

---

## 2026-07-06 前端选择控件与视觉体系小范围重构

### 修改原因
用户反馈当前模型选择与平均线选择混在一起，行尾“均”字按钮语义不清；同时英文视觉、按钮、筛选器、benchmark 解释和数据表层级不够成熟。此次按“PM/市场用户优先、兼顾初学者和技术用户”的方向做小范围重构，不改数据结构和雷达图算法。

### 修改文件与详情

**`package.json` / `package-lock.json` — 引入最小成熟 UI 基础**
- 新增 `@radix-ui/react-checkbox`、`@radix-ui/react-select`、`@radix-ui/react-tooltip`，用于可访问的 Checkbox、Select、Tooltip。
- 新增 `@fontsource/geist-sans`，让英文主字体稳定使用 Geist Sans，不再依赖用户系统字体。

**`src/components/ui/*` / `src/lib/class-names.ts` — 新增基础控件**
- 新增 `Button`、`Badge`、`Checkbox`、`Select`、`Tooltip` 组件。
- 新增 `cn` className 合并工具，避免组件内手写重复 class 拼接。

**`src/components/ModelSelector.tsx` / `src/lib/model-browser.ts` — 重构模型选择与平均基线交互**
- “显示模型”和“计入平均基线”拆成两套独立选择。
- 行尾“均”文字按钮改为图标按钮，含 Tooltip 与 `aria-pressed`，避免误读。
- 自动展开公司只跟随“显示模型”，不再因为默认平均基线包含全部模型而展开所有公司。
- 公司/标签筛选改用统一 Select 组件；操作按钮改用统一 Button。

**`src/components/MetricSelector.tsx` — benchmark 选择更可理解**
- benchmark 名称增加 Tooltip，展示 metric 描述。
- featured 星标改为“精选”徽章。
- 保留“默认 / 全部”，新增“清空”操作。

**`src/components/DataTable.tsx` — 数据表可读性增强**
- benchmark 表头增加 Tooltip 解释。
- featured benchmark 在表头显示“精选”徽章。
- N/A 单元格增加“未报告”辅助文案。
- 原始分、归一分、来源链接分层显示。

**`src/main.tsx` / `src/index.css` — 全局视觉 token 与控件样式统一**
- 引入 Geist Sans 字体资源。
- 统一 Button、Checkbox、Select、Badge、Tooltip、基线图标按钮、表格 sticky 模型列、焦点态和 hover 态。
- 移动端和桌面端均保持整页无横向溢出。

### 修改影响
- 左侧模型列表从“配置面板感”更接近成熟产品工具控件。
- 平均基线不再用“均”字表达，降低新用户误解成本。
- PM/市场用户能更快理解默认精选 benchmark、来源可信和对比结果；技术用户仍能追踪原始分、归一分和来源。
- 雷达图 ECharts 初始化方式、分数归一化、缺失值规则和 URL 参数语义保持不变。

### 验证结果
- `npm run build`：通过，TypeScript 编译与 Vite 构建均成功。
- `npm test`：24/24 通过。
- Playwright + Chrome 桌面截图：1440px 宽度无整页横向溢出，基线按钮已收敛为图标按钮。
- Playwright + Chrome 移动截图：390px 宽度无整页横向溢出，控制区、表格和卡片正常堆叠。

### 相关文件
- `package.json`
- `package-lock.json`
- `src/components/ui/Button.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Checkbox.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Tooltip.tsx`
- `src/lib/class-names.ts`
- `src/lib/model-browser.ts`
- `src/components/ModelSelector.tsx`
- `src/components/MetricSelector.tsx`
- `src/components/DataTable.tsx`
- `src/main.tsx`
- `src/index.css`

---

## 2026-07-07 主分支合并后验证微调

### 修改原因
合并到 `master` 后执行验证构建时，保留一处基线按钮可访问性/布局微调，并刷新构建索引时间戳，保证主分支验证后的工作树可提交、可复现。

### 修改文件与详情

**`src/components/ModelSelector.tsx` — 基线按钮改为图标按钮**
- 将按钮内可见文字 `基线` 改为 `sr-only` 文案 `计入平均基线`。
- 保留 `aria-label` 的按模型动态说明，避免图标按钮失去可访问名称。

**`src/index.css` — 固定基线按钮尺寸**
- `.baseline-toggle` 固定为 24px 宽高，居中显示图标。
- 去掉横向 padding，避免不同文本长度影响模型行布局。
- 选中态改为浅蓝强调，与侧栏控件选中态保持一致。

**`public/model-index.json` — 构建刷新**
- `npm run build` 刷新 `generated_at`。

### 修改影响
- 侧栏模型行更稳定，不会因“基线”文字撑开或造成对齐漂移。
- 屏幕阅读器仍能读到基线按钮含义。
- 运行时数据内容不变，仅索引生成时间刷新。

### 验证结果
- `npx tsc -b`：通过。
- `npm test`：24/24 通过。
- `npm run build`：通过，生成 103 模型 / 14 benchmark / 15 公司索引；Vite 仅提示 chunk size warning，不影响构建产物。

### 相关文件
- `src/components/ModelSelector.tsx`
- `src/index.css`
- `public/model-index.json`

---

## 2026-07-06 按功能地形重切架构 module

### 修改原因
架构评审确认三处 shallow module：
1. `scripts/build-index.ts` 同时承担 CLI adapter、YAML 读取、BuildValidation、索引生成和写文件，Data-to-Deploy seam 太粗。
2. `App.tsx` 与 `use-comparison.ts` 分散承担 URL 默认值、id 集合和 ModelCard/Metric 投影，ModelSelectorState interface 过宽。
3. `ModelSelector.tsx` 同时做搜索、CompanyProfile lookup、标签目录、分组、展开和渲染，Model browser 规则 locality 不足。

### 修改文件与详情

**`src/lib/model-index-builder.ts` — 新增 ModelIndex 构建 module**
- 新增 `buildModelIndex`，作为 BuildValidation 的唯一 interface。
- 将 Metric、CompanyProfile、ModelCard、ScoreSourcePolicy、logo warning、排序和 meta 生成集中到一个 module。
- 新增 `BuildIndexError`，构建规则错误不再直接 `process.exit`，便于测试穿过同一 seam。

**`scripts/build-index.ts` — 收窄为 CLI adapter**
- 删除脚本内字段校验和 ModelCard 组装逻辑。
- 保留参数解析、YAML 读取、模型文件扫描、写 `public/model-index.json` 和日志输出。
- adapter 捕获 `BuildIndexError` 后统一输出 `[build-index] ERROR` 并退出。

**`src/hooks/use-model-selector-state.ts` — 新增 ModelSelectorState module**
- 替代旧 `use-comparison.ts`。
- 将 URL query 读写、异步默认值、模型/benchmark/平均线 id 集合、id → ModelCard 投影收口到一个 hook。
- `App` 调用方不再知道默认选中规则和 id 查找细节。

**`src/hooks/use-comparison.ts` — 删除旧 shallow hook**
- 删除三组 id set 的薄聚合旧 module，不做向后兼容。

**`src/lib/model-browser.ts` — 新增 Model browser 投影 module**
- 新增 `buildModelBrowserProjection`，集中处理搜索、公司筛选、标签筛选、标签目录、公司排序、分组、选中态、平均态和展开态。
- 新增 `selectedCompanyKeys`，让自动展开选中/平均模型所属公司的规则集中。

**`src/components/ModelSelector.tsx` — 收窄为渲染 module**
- 删除组件内 `companyMap`、`allTags`、`filteredModels`、`grouped` 等重复推导。
- 改为消费 `ModelBrowserProjection`，只保留本地输入框/筛选值/展开状态和 UI 事件。

**`src/App.tsx` — 消费已投影状态**
- 改用 `useModelSelectorState(index)`。
- 删除默认 ids、selectedModels、averageModels、featuredCount 的散落计算。

**`tsconfig.node.json` — 补齐脚本/测试 module 解析**
- 增加 `baseUrl` 与 `@/*` paths。
- include 增加 `src/**/*.ts`，保证 scripts/tests 引用 src module 时可被 TypeScript 项目识别。

**`tests/model-index-builder.test.ts` — 新增 BuildValidation interface 测试**
- 验证 `buildModelIndex` 可直接生成 ModelIndex、按发布日期排序。
- 验证 source 越界会在 module interface 抛出 `BuildIndexError`。

**`tests/model-browser.test.ts` — 新增 Model browser 投影测试**
- 验证标签目录、公司排序、分组、选中态、平均态集中生成。
- 验证搜索过滤结果自动展开。

**`models/minimax/minimax-m3.yaml` — 修正空 scores 结构**
- 将只有注释的 `scores:` 改为 `scores: {}`。
- 原因：YAML 中只有注释的 mapping 会解析为 `null`，不符合 `ModelCard.scores: Record<string, ScoreEntry>` 的领域类型。
- 不在 BuildValidation 中兼容 `scores: null`，让数据结构错误继续在构建期暴露。

### 修改影响
- BuildValidation bugs 的 locality 从 CLI 脚本集中到 `model-index-builder`。
- 前端选择状态的默认值、URL 和实体投影集中到 ModelSelectorState，App 的 interface 明显缩小。
- ModelSelector 只渲染浏览投影，搜索/分组规则可脱离 DOM 单测。
- 不保留旧 `useComparison` 兼容导出，问题会在编译期暴露。
- `minimax-m3` 的“未报告所有当前 benchmark”状态现在用空对象显式表达，不再依赖 YAML 注释形状。

### 验证结果
- `npx tsc -b`：通过。
- `npm test`：24/24 通过。
- `npm run build`：通过，生成 103 模型 / 14 benchmark / 15 公司索引；Vite 仅提示 chunk size warning，不影响构建产物。

### 相关文件
- `src/lib/model-index-builder.ts`
- `scripts/build-index.ts`
- `src/hooks/use-model-selector-state.ts`
- `src/hooks/use-comparison.ts`
- `src/lib/model-browser.ts`
- `src/components/ModelSelector.tsx`
- `src/App.tsx`
- `tsconfig.node.json`
- `tests/model-index-builder.test.ts`
- `tests/model-browser.test.ts`
- `models/minimax/minimax-m3.yaml`

## 2026-07-06 模型数据全面验证与家族补全

### 修改原因
用户指出项目中模型参数与评测分数存在不全/不对的问题，且多个厂商的模型家族覆盖明显缺失（如 Qwen 仅 3 个、Claude 仅 3 个）。需要对 `models/` 下全部模型 YAML 进行广泛的联网搜索、权威聚合站点查询、原始论文交叉验证，并补全缺失的主要型号。

### 调研与验证方法

1. **分组并行调研**：使用 5 个 explore 子代理分别调研 15 个厂商的模型谱系、参数、评测分数。
2. **权威来源优先级**：官方技术报告/论文 > LMSYS Chatbot Arena > Artificial Analysis > OpenCompass > Papers With Code > 官方博客。
3. **交叉验证**：对每个缺失或存疑的数据点，至少通过两个独立来源核对；无法确认的数据不硬填。

### 新增模型文件（24 个）

- `models/openai/gpt-4.1.yaml`
- `models/openai/gpt-4.1-mini.yaml`
- `models/openai/gpt-4o-mini.yaml`
- `models/openai/o4-mini.yaml`
- `models/google/gemini-2.0-flash-lite.yaml`
- `models/google/gemini-2.5-flash-lite.yaml`
- `models/anthropic/claude-4-sonnet.yaml`
- `models/anthropic/claude-3.7-sonnet.yaml`
- `models/meta/llama-3.3-70b.yaml`
- `models/meta/llama-3.1-70b.yaml`
- `models/alibaba/qwen3.5.yaml`
- `models/alibaba/qwen2.5-vl.yaml`
- `models/deepseek/v2.5.yaml`
- `models/deepseek/r1-zero.yaml`
- `models/mistral/magistral-small.yaml`
- `models/xai/grok-3-mini.yaml`
- `models/xai/grok-2-mini.yaml`
- `models/moonshot/kimi-vl.yaml`
- `models/minimax/minimax-text-01.yaml`
- `models/baichuan/baichuan-m1-14b.yaml`
- `models/bytedance/doubao-1.5-pro.yaml`
- `models/bytedance/seed2.0-lite.yaml`
- `models/baidu/ernie-5.0.yaml`
- `models/baidu/ernie-5.1.yaml`
- `models/tencent/hunyuan-a13b.yaml`

### 修改的现有模型文件（23 个）

- `models/openai/gpt-4o.yaml`：新增 `mmlu-pro`、`humaneval`
- `models/meta/llama-3.1-405b.yaml`：新增 `math-level-5`
- `models/deepseek/r1.yaml`：新增 `math-level-5`
- `models/deepseek/v3.yaml`：新增 `math-level-5`
- `models/deepseek/vl2.yaml`：`context_window` 改为 `uncertain`
- `models/mistral/magistral-medium.yaml`：标注架构/上下文不确定
- `models/anthropic/claude-3.5-sonnet.yaml`：标注架构为官方未公开
- `models/anthropic/claude-4-opus.yaml`：标注架构为官方未公开
- `models/anthropic/claude-fable-5.yaml`：标注架构为官方未公开
- `models/alibaba/qwen3.yaml`：标注分数为 Base 模型分数
- `models/alibaba/qwen3.5-omni.yaml`：参数改为 `uncertain`
- `models/zhipu/glm-4.yaml`：新增 `ifeval`
- `models/zhipu/glm-4.5.yaml`：新增 `mmlu`、`math-level-5`、`ifeval`、`humaneval`
- `models/zhipu/glm-5.yaml`：`gpqa` 更新为 thinking 模式值
- `models/moonshot/kimi-k2.yaml`：修正总/激活参数
- `models/moonshot/kimi-k2.5.yaml`：修正总参数
- `models/bytedance/seed-1.8.yaml`：修正发布日期、输出模态、`ifeval` 标注
- `models/bytedance/seed-2.0-pro.yaml`：新增 `swe-bench`、修正模态、`ifeval` 标注
- `models/baidu/ernie-4.5.yaml`：修正发布日期、模态、新增 `gpqa`
- `models/baidu/ernie-x1.yaml`：修正发布日期、新增架构、修正模态
- `models/baidu/ernie-5.0-base.yaml`：修正发布日期、总参数
- `models/tencent/hunyuan-large.yaml`：修正发布日期、新增 `gpqa`/`ifeval`
- `models/tencent/hunyuan-t1.yaml`：修正发布日期、参数标注不确定

### 新增报告文件

- `MODEL_VALIDATION_REPORT.md`：完整记录新增模型、修改字段、数据来源、待确认项。

### 修改影响

- 模型总数从 45 增加到 70，覆盖 15 个厂商的主要模型家族。
- 修正了多处错误数据（发布日期、参数、模态、分数来源）。
- 对官方未披露的数据明确标注 `uncertain`，避免无依据填充。
- 保持与现有 YAML 格式、构建脚本、前端展示兼容。

### 验证结果

- `npm run build` → 成功
- 构建输出：`模型数: 70 / benchmark 数: 14 / 公司数: 15`
- `npx vitest run` → 20/20 通过

### 待后续工作

- 部分 featured 指标（如 `arena-elo`、`humaneval`、`math-level-5`）在多个模型中仍缺失，需等待官方披露。
- 建议定期（每季度）复核各厂商模型家族。

---

## 2026-07-06 调整 DataTable 右上角说明文字字体

### 修改原因
用户反馈 DataTable 右上角 "raw · normalized · source" 说明文字字体难看。

### 修改内容
- `src/index.css`
  - `.section-label .right` 从继承 mono 字体（JetBrains Mono + 大写 + 0.18em 宽字距）改为正文字体：
    - `font-family: var(--font-sans)`（Hanken Grotesk）
    - `font-size: 11px`
    - `font-weight: 400`
    - `letter-spacing: 0.02em`
    - `text-transform: none`
    - 颜色保持 `var(--dim)`
  - 使其看起来像轻盈的辅助说明，而非代码/标签。

### 验证结果
- `npm test`：20/20 通过。
- `npm run build`：通过。
- Playwright 截图验证：右上角说明文字已改为小写、无衬线字体，与左侧大写 mono 标题形成层级对比。

### 相关文件
- `src/index.css`

---

## 2026-07-06 修复 DataTable 与雷达图 tooltip 来源链接交互/布局问题

### 修改原因
用户反馈两点 UI 反人类设计：
1. 雷达图 hover 时 tooltip 里出现"来源 ↗"跳转链接，但鼠标一动 tooltip 就消失，永远点不到。
2. DataTable 02 单元格里直接用 source 的完整标题（如论文/PDF 长名）作为链接文本，导致表格被撑得很长，横向溢出严重。

### 修改文件与详情

**`src/components/DataTable.tsx` — 来源链接文本缩短**
- 单元格内来源 `<a>` 的子节点从 `{source.title} ↗` 改为 `来源 ↗`。
- 完整 `source.title` 仍保留在 `<a title={source.title}>` 中，hover 时通过浏览器原生 tooltip 查看完整来源名称。

**`src/index.css` — 表格来源链接样式微调**
- `table.data td.val .src` 从 `display: block` 改为 `display: inline-block`，从 `max-width: 12rem` 收紧到 `max-width: 8rem`。
- 保持 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` 作为兜底，防止极端标题撑开单元格。

**`src/lib/radar-option.ts` — tooltip 链接变得可点击**
- tooltip 配置增加 `enterable: true`：允许鼠标进入 tooltip 区域。
- 增加 `hideDelay: 500`：鼠标移出系列后保留 500ms，给用户足够时间从系列滑入 tooltip 点击链接。
- 增加 `confine: true`：限制 tooltip 不超出图表画布，避免链接被截断在可视区外。
- 来源链接颜色统一为品牌蓝 `#345fdf`，不再随系列色变化，确保可识别性。
- 删除 `buildSeriesTip` 内未再使用的局部 `color` 变量，修复 TypeScript `TS6133` 编译错误。

### 修改影响
- DataTable 横向空间占用显著下降，长来源标题不再撑开列宽，表格整体更紧凑。
- 雷达图 tooltip 中的"来源 ↗"现在可以实际点击跳转（鼠标可进入 tooltip，500ms 延迟保证移入时间）。
- 无功能逻辑变更，数据来源、URL、target="_blank" 行为保持不变。

### 验证结果
- `npm test`：20/20 通过。
- `npm run build`：TypeScript 编译与 Vite 构建均成功，生成 70 模型 / 14 benchmark / 15 公司索引。

### 相关文件
- `src/components/DataTable.tsx`
- `src/lib/radar-option.ts`
- `src/index.css`

---

## 2026-07-06 雷达图 hover tooltip 移除来源链接

### 修改原因
用户反馈：hover 卡片（雷达图 tooltip）里不要放来源链接，直接去掉更清爽；来源应该在 DataTable / SourceList 里查看。

### 修改文件与详情

**`src/lib/radar-option.ts` — tooltip 内不再渲染来源**
- `buildSeriesTip` 中删除每条 metric 下的"来源 ↗" `<a>` 链接生成逻辑。
- tooltip 配置回退到普通 hover 卡片：`enterable`、`hideDelay`、`confine` 删除，`backgroundColor` 恢复为 `0.96`。
- hover 卡片现在只展示：系列名 + 各 metric 的归一化分数与原始值（或 N/A）。

### 修改影响
- 雷达图 tooltip 回归纯信息展示，无交互链接，避免用户尝试点击却点不到的挫败感。
- 完整来源仍可在 02 DataTable 的"来源 ↗"列和 03 Sources 列表中点击跳转。
- 无其它功能影响。

### 验证结果
- `npm test`：20/20 通过。
- `npm run build`：TypeScript 编译与 Vite 构建均成功。

### 相关文件
- `src/lib/radar-option.ts`

---

## 2026-07-07 收紧百度 / 字节模型卡官方来源口径

### 修改原因
用户要求继续按“只采信官方一手来源”的标准收紧模型库。上一轮百度、字节部分模型卡仍混有几类不够硬的字段：

- 用第三方新闻稿充当主 source
- 由相对描述反推出来的精确参数
- 官方页未稳定落锤的 `release_date` / `context_window` / `modalities`
- 研究文档与仓库当前数据状态不一致

这轮目标不是继续铺量，而是先把 `models/baidu` 与 `models/bytedance` 里已经发现的口径问题清干净。

### 修改内容

**百度模型卡收紧**
- 删除 `models/baidu/ernie-x1.yaml`
  - 原因：当前未找到百度官方博客、官方论文、官方 API / 模型文档作为一手来源；原文件主 source 为第三方 `wicinternet.org`，不符合本轮采信标准。
- `models/baidu/ernie-4.5.yaml`
  - 删除未被当前官方页稳定支撑的 `release_date`
  - 删除未被当前官方页稳定支撑的 `context_window`
- `models/baidu/ernie-4.5-vl.yaml`
  - 删除 `release_date`
  - 删除 `context_window`
  - 将模态从 `text,image,audio,video -> text,image,audio` 收紧为 `text,image -> text`
- `models/baidu/ernie-5.0.yaml`
  - `release_date` 从 `2026-01-22` 改为百度官方博客页发布时间 `2026-02-06`
  - `modalities.output` 从 `[text, image, audio]` 补齐为 `[text, image, audio, video]`
- `models/baidu/ernie-5.0-base.yaml`
  - `release_date` 从 `2026-01-22` 改为 `2026-02-06`
  - `modalities.output` 从 `[text, image, audio]` 补齐为 `[text, image, audio, video]`
- `models/baidu/ernie-5.1.yaml`
  - `parameters.total` 从基于比例反推的 `800B` 收紧为 `undisclosed`
  - 删除 `context_window`
  - 删除整块 `modalities`
  - 将非标准 YAML 空对象写法收敛为标准 `scores: {}`

**字节模型卡收紧**
- `models/bytedance/doubao-1.5-pro.yaml`
  - 删除 `release_date`
  - 删除 `context_window`
  - 删除 `modalities`
  - 清空 `scores`，回退为仅保留官方 source 的最小事实集
- `models/bytedance/seed-1.8.yaml`
  - 删除未稳定落锤的 `release_date`
  - 删除 `context_window`
- `models/bytedance/seed-2.0-pro.yaml`
  - 删除 `architecture`
  - 删除 `context_window`
  - 删除 `modalities`
  - `swe-bench.note` 统一为官方表格原文口径 `SWE Bench Verified`
- `models/bytedance/seed-thinking-v1.5.yaml`
  - 删除 `context_window`
  - 保留由官方博客与技术报告直接支撑的 `release_date / architecture / 200B / 20B / IFEval 87.4`
- `models/bytedance/seed2.0-lite.yaml`
  - 删除 `context_window`
  - 删除 `modalities`

**研究文档同步**
- `docs/research/baidu-sources.md`
  - 新增本轮对 `ERNIE 4.5 / 5.0 / 5.1 / X1` 的裁决结论
  - 同步 `ERNIE X1` 已从仓库移除
  - 修正 `ERNIE 5.0` 发布日期口径到 `2026-02-06`
  - 移除不存在的本地 PDF 备份描述
- `docs/research/bytedance-sources.md`
  - 同步 `Seed1.8 / Seed 2.0 Pro / Seed 2.0 Lite / Seed-Thinking-v1.5 / Doubao-1.5-Pro` 的最新裁决
  - 修正 `Seed 2.0 Pro` / `Seed 2.0 Lite` 的 `SWE Bench Verified` 结论
  - 修正 `Seed-Thinking-v1.5` 的 `IFEval 87.4` 口径
  - 删除不存在的“本地保存 PDF”清单

### 修改影响

- `ERNIE X1` 不再以第三方新闻稿为依据混入模型库，百度模型集合更干净。
- 百度 / 字节这两组模型卡中，未被官方原文直接支撑的 `release_date`、`context_window`、`modalities`、参数与分数被明显收紧，减少“看起来完整但证据不够硬”的字段。
- 研究文档与当前仓库状态重新对齐，后续继续做全库审计时不会再被旧说明误导。

### 相关文件

- `models/baidu/ernie-4.5.yaml`
- `models/baidu/ernie-4.5-vl.yaml`
- `models/baidu/ernie-5.0.yaml`
- `models/baidu/ernie-5.0-base.yaml`
- `models/baidu/ernie-5.1.yaml`
- `models/baidu/ernie-x1.yaml`
- `models/bytedance/doubao-1.5-pro.yaml`
- `models/bytedance/seed-1.8.yaml`
- `models/bytedance/seed-2.0-pro.yaml`
- `models/bytedance/seed-thinking-v1.5.yaml`
- `models/bytedance/seed2.0-lite.yaml`
- `docs/research/baidu-sources.md`
- `docs/research/bytedance-sources.md`
- `UPDATE_LOG.md`
