# OpenAI 模型来源汇总

> 收集时间：2026-07-05  
> 收集范围：OpenAI 2024-2026 年发布的旗舰大语言模型（chat / reasoning / multimodal）。

## 2026-07-07 补充核验结论

- `GPT-4.1`、`GPT-4.1 mini`
  - 已补入官方 model doc。
  - `context_window` 从概括写法 `1M` 收敛为官方模型页的精确值 `1,047,576`。
- `GPT-4.1 nano`
  - 已补入官方主线模型卡。
  - `release_date` 收敛为 `2025-04-14`。
  - 分数直接采用 `GPT-4.1` 官方发布页里的对比表：`MMLU 80.1`、`GPQA 50.3`、`IFEval 74.5`。
- `GPT-4.5 Preview`
  - 已补入官方主线 research preview 模型卡。
  - `release_date` 收敛为 `2025-02-27`。
  - 分数采用 `GPT-4.1` 官方发布页中的对比表：`MMLU 90.8`、`GPQA 69.5`、`IFEval 88.2`、`SWE-bench 38.0`。
- `o3-mini`
  - 已补入官方主线模型卡。
  - `release_date` 收敛为 `2025-01-31`。
  - 分数采用 `GPT-4.1` 官方发布页中的对比表：`MMLU 86.9`、`GPQA 77.2`、`IFEval 93.9`、`SWE-bench 49.3`。
- `o3-pro`、`o1-pro`
  - 已补入官方主线模型卡。
  - 目前先只保留官方 model doc + changelog 可直接支撑的规格与发布日期，不猜 benchmark。
- `GPT-5 Pro`、`GPT-5.4 Pro`、`GPT-5.5 Pro`
  - 已补入官方主线模型卡。
  - 发布日期分别按官方 changelog 收敛为 `2025-10-06`、`2026-03-05`、`2026-04-24`。
- `GPT-4o`：
  - 已移除无法由允许范围内官方原始来源确认的 `mmlu-pro` / `humaneval`。
  - `context_window` 与 `modalities` 现在按 OpenAI API model doc 口径理解，不再沿用首发博客里更宽的“omni 能力”表述。
- `GPT-4o mini`：
  - `modalities.input` 去掉 `audio`，因为官方发布页明确写的是“today supports text and vision”，音频/视频属于后续计划。
- `o1`：
  - `release_date` 收敛为 `2024-12-17`，与当前保留分数使用的 `o1-2024-12-17` API 发布口径一致。
- `o3`：
  - 由于当前官方发布页与 system card 文本中未稳定检出与本仓库 `metrics.yaml` 一一对应的 `gpqa` / `swe-bench` 精确值，这两项已先清空，避免误填。
- `GPT-5.5`：
  - `release_date` 从 `2026-04-23` 修正为 `2026-04-24`。
- `GPT-5 / GPT-5 mini / GPT-5 nano / GPT-5.4 / GPT-5.4 mini / GPT-5.4 nano / GPT-5.5`：
  - 均补入 OpenAI API changelog 作为发布日期辅助来源。

## 已收录模型

| 模型 | slug | 发布日期 | 类型 | YAML 文件 |
|------|------|----------|------|-----------|
| GPT-4o | gpt-4o | 2024-05-13 | 多模态 chat | `models/openai/gpt-4o.yaml` |
| GPT-4.1 | gpt-4.1 | 2025-04-14 | 主线 chat | `models/openai/gpt-4.1.yaml` |
| GPT-4.1 mini | gpt-4.1-mini | 2025-04-14 | 轻量主线 | `models/openai/gpt-4.1-mini.yaml` |
| GPT-4.1 nano | gpt-4.1-nano | 2025-04-14 | 超轻量主线 | `models/openai/gpt-4.1-nano.yaml` |
| GPT-4.5 Preview | gpt-4.5-preview | 2025-02-27 | research preview | `models/openai/gpt-4.5-preview.yaml` |
| OpenAI o1 | o1 | 2024-12-05 | 推理模型 | `models/openai/o1.yaml` |
| OpenAI o1-pro | o1-pro | 2025-03-19 | 高算力推理模型 | `models/openai/o1-pro.yaml` |
| OpenAI o3-mini | o3-mini | 2025-01-31 | 轻量推理模型 | `models/openai/o3-mini.yaml` |
| OpenAI o3 | o3 | 2025-04-16 | 推理模型 | `models/openai/o3.yaml` |
| OpenAI o3-pro | o3-pro | 2025-06-10 | 高算力推理模型 | `models/openai/o3-pro.yaml` |
| GPT-5 | gpt-5 | 2025-08-07 | 主线旗舰 | `models/openai/gpt-5.yaml` |
| GPT-5 mini | gpt-5-mini | 2025-08-07 | 轻量主线 | `models/openai/gpt-5-mini.yaml` |
| GPT-5 nano | gpt-5-nano | 2025-08-07 | 超轻量主线 | `models/openai/gpt-5-nano.yaml` |
| GPT-5 Pro | gpt-5-pro | 2025-10-06 | 高算力旗舰 | `models/openai/gpt-5-pro.yaml` |
| GPT-5.4 | gpt-5.4 | 2026-03-05 | 迭代旗舰 | `models/openai/gpt-5.4.yaml` |
| GPT-5.4 Pro | gpt-5.4-pro | 2026-03-05 | 高算力迭代旗舰 | `models/openai/gpt-5.4-pro.yaml` |
| GPT-5.5 | gpt-5.5 | 2026-04-24 | 迭代旗舰 | `models/openai/gpt-5.5.yaml` |
| GPT-5.5 Pro | gpt-5.5-pro | 2026-04-24 | 高算力迭代旗舰 | `models/openai/gpt-5.5-pro.yaml` |

## 来源 URL

### GPT-4o

1. **Hello GPT-4o**（官方博客，发布方原始来源）  
   https://openai.com/index/hello-gpt-4o/  
   类型：blog  
   说明：GPT-4o 的原始发布公告，包含模型能力、多模态描述与安全评估，但未列出具体 benchmark 数值。

2. **GPT-4o System Card**（arXiv 论文，发布方原始来源）  
   https://arxiv.org/abs/2410.21276  
   类型：paper  
   说明：OpenAI 官方系统卡，含安全评估与部分能力评估。

3. **Introducing GPT-4.1 in the API**（官方博客，发布方原始来源）  
   https://openai.com/index/gpt-4-1/  
   类型：blog  
   说明：内含 GPT-4o (2024-11-20 快照) 与 GPT-4.1/o1/o3-mini 等的对比表，提供了本 YAML 中使用的 MMLU、GPQA Diamond、SWE-bench Verified、IFEval 等分数。

### OpenAI o1

1. **OpenAI o1 and new tools for developers**（官方博客，发布方原始来源）  
   https://openai.com/index/o1-and-new-tools-for-developers/  
   类型：blog  
   说明：o1 API 版本发布，内含 `o1-2024-12-17` 的 benchmark 对比表（GPQA diamond、MMLU、SWE-bench Verified、MATH、AIME 2024、MMMU 等）。本 YAML 中的 MMLU、GPQA、SWE-bench、MATH 分数均来自此表。

2. **Learning to reason with LLMs**（官方博客，发布方原始来源）  
   https://openai.com/index/learning-to-reason-with-llms/  
   类型：blog  
   说明：o1 的推理能力介绍，提及 GPQA Diamond 首次超越人类 PhD 专家、MMMU 78.2% 等，但未提供完整数值表。

3. **OpenAI o1 System Card**（arXiv 论文，发布方原始来源）  
   https://arxiv.org/abs/2412.16720  
   类型：paper  
   说明：o1 官方系统卡，含安全与评估详情。

### OpenAI o3

1. **Introducing OpenAI o3 and o4-mini**（官方博客，发布方原始来源）  
   https://openai.com/index/introducing-o3-and-o4-mini/  
   类型：blog  
   说明：o3 正式发布公告，提及在 Codeforces、SWE-bench、MMMU、AIME 等基准上取得新 SOTA。本 YAML 中的 GPQA Diamond 87.7%、SWE-bench Verified 71.7% 来自该发布页引用的官方结果。

2. **OpenAI o3 and o4-mini System Card**（官方 PDF，发布方原始来源）  
   https://cdn.openai.com/pdf/2221c875-02dc-4789-800b-e7758f3722c1/o3-and-o4-mini-system-card.pdf  
   类型：paper  
   说明：o3/o4-mini 官方系统卡。

### GPT-4.1 / GPT-4.1 mini / GPT-4.1 nano

1. **Introducing GPT-4.1 in the API**（官方博客，发布方原始来源）  
   https://openai.com/index/gpt-4-1/  
   类型：blog  
   说明：用于确认 `GPT-4.1 / mini / nano` 的发布日期，并提供对比表中的 `MMLU`、`GPQA Diamond`、`IFEval`、`SWE-bench Verified` 等分数。

2. **OpenAI API model pages**（官方模型页，发布方原始来源）  
   https://developers.openai.com/api/docs/models/gpt-4.1  
   https://developers.openai.com/api/docs/models/gpt-4.1-mini  
   https://developers.openai.com/api/docs/models/gpt-4.1-nano  
   类型：website  
   说明：用于确认 `context window` 与模态。

### GPT-4.5 Preview

1. **Introducing GPT-4.5**（官方博客，发布方原始来源）  
   https://openai.com/index/introducing-gpt-4-5/  
   类型：blog  
   说明：用于确认 `GPT-4.5 Preview` 的发布日期与 research preview 定位。

2. **GPT-4.5 Preview Model**（官方模型页，发布方原始来源）  
   https://developers.openai.com/api/docs/models/gpt-4.5-preview  
   类型：website  
   说明：用于确认 `128k` context 与模态。

3. **Introducing GPT-4.1 in the API**（官方博客，发布方原始来源）  
   https://openai.com/index/gpt-4-1/  
   类型：blog  
   说明：用于确认 `GPT-4.5 Preview` 在官方对比表中的 `MMLU`、`GPQA Diamond`、`IFEval`、`SWE-bench Verified`。

### OpenAI o3-mini / o3-pro / o1-pro

1. **OpenAI API model pages**（官方模型页，发布方原始来源）  
   https://developers.openai.com/api/docs/models/o3-mini  
   https://developers.openai.com/api/docs/models/o3-pro  
   https://developers.openai.com/api/docs/models/o1-pro  
   类型：website  
   说明：用于确认 `context window` 与模态。

2. **OpenAI API Changelog**（官方 changelog，发布方原始来源）  
   https://developers.openai.com/api/docs/changelog  
   类型：website  
   说明：用于确认 `o3-mini = 2025-01-31`、`o3-pro = 2025-06-10`、`o1-pro = 2025-03-19`。

3. **Introducing GPT-4.1 in the API**（官方博客，发布方原始来源）  
   https://openai.com/index/gpt-4-1/  
   类型：blog  
   说明：用于确认 `o3-mini` 在官方对比表中的 `MMLU`、`GPQA Diamond`、`IFEval`、`SWE-bench Verified`。

### GPT-5 Pro / GPT-5.4 Pro / GPT-5.5 Pro

1. **OpenAI API model pages**（官方模型页，发布方原始来源）  
   https://developers.openai.com/api/docs/models/gpt-5-pro  
   https://developers.openai.com/api/docs/models/gpt-5.4-pro  
   https://developers.openai.com/api/docs/models/gpt-5.5-pro  
   类型：website  
   说明：用于确认 `context window`、模态与 reasoning 定位。

2. **OpenAI API Changelog**（官方 changelog，发布方原始来源）  
   https://developers.openai.com/api/docs/changelog  
   类型：website  
   说明：用于确认 `GPT-5 Pro = 2025-10-06`、`GPT-5.4 Pro = 2026-03-05`、`GPT-5.5 Pro = 2026-04-24`。

### GPT-5 / GPT-5 mini / GPT-5 nano

1. **OpenAI API model pages**（官方模型页，发布方原始来源）  
   https://developers.openai.com/api/docs/models/gpt-5  
   https://developers.openai.com/api/docs/models/gpt-5-mini  
   https://developers.openai.com/api/docs/models/gpt-5-nano  
   类型：website  
   说明：页面直接给出对应 snapshot、`400k` context window、`text/image -> text` 模态；未公开参数规模与本项目 benchmark 分数，因此 `scores: {}`。

## 未找到原始来源的分数 / 说明

| 模型 | 字段/分数 | 原因 |
|------|-----------|------|
| GPT-4o | `parameters.total` / `parameters.active` | OpenAI 未公开 GPT-4o 的参数规模。 |
| GPT-4o | `architecture` | OpenAI 未公开架构细节（Dense / MoE 等）。 |
| GPT-4o | `mmlu-pro`, `humaneval`, `math-level-5`, `gsm8k`, `arena-elo`, `bbh`, `drop`, `hellaswag`, `arc-c`, `winogrande` | OpenAI 官方 `GPT-4.1` 对比页可确认 `mmlu`、`gpqa`、`swe-bench Verified`、`ifeval`，但未给出 GPT-4o 的 `mmlu-pro` 或 `humaneval`；因此这两项不应继续保留。 |
| o1 | `parameters.total` / `parameters.active` | OpenAI 未公开 o1 的参数规模。 |
| o1 | `architecture` | OpenAI 未公开架构细节。 |
| o1 | `mmlu-pro`, `humaneval`, `gsm8k`, `arena-elo`, `ifeval`, `bbh`, `drop`, `hellaswag`, `arc-c`, `winogrande` | 官方 o1 API 公告页的 benchmark 表未包含这些项目。 |
| o3 | `parameters.total` / `parameters.active` | OpenAI 未公开 o3 的参数规模。 |
| o3 | `architecture` | OpenAI 未公开架构细节。 |
| o3 | `mmlu`, `mmlu-pro`, `humaneval`, `math-level-5`, `gsm8k`, `arena-elo`, `ifeval`, `bbh`, `drop`, `hellaswag`, `arc-c`, `winogrande` | 官方 o3 公告页主要强调 SWE-bench、Codeforces、AIME、GPQA、MMMU 等，未提供上述全部项目的具体数值；AIME 分数因不在允许集合中未记录为 `math-level-5`。 |
| GPT-5 / GPT-5 mini / GPT-5 nano | `parameters.total` / `parameters.active` / `architecture` | OpenAI API 模型页未公开这些字段。 |
| GPT-5 / GPT-5 mini / GPT-5 nano | 全部项目分数 | 官方模型页未提供本项目 `metrics.yaml` 同口径 benchmark 数值。 |

## PDF 下载情况

- o3 系统卡 PDF 链接已记录，但本次未成功下载到本地（`docs/papers/openai/` 目录为空）。  
- GPT-4o 系统卡为 arXiv 页面，未单独下载 PDF。  
- o1 系统卡为 arXiv 页面，未单独下载 PDF。
