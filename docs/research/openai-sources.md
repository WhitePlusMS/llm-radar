# OpenAI 模型来源汇总

> 收集时间：2026-07-05  
> 收集范围：OpenAI 2024-2026 年发布的旗舰大语言模型（chat / reasoning / multimodal）。

## 已收录模型

| 模型 | slug | 发布日期 | 类型 | YAML 文件 |
|------|------|----------|------|-----------|
| GPT-4o | gpt-4o | 2024-05-13 | 多模态 chat | `models/openai/gpt-4o.yaml` |
| OpenAI o1 | o1 | 2024-12-05 | 推理模型 | `models/openai/o1.yaml` |
| OpenAI o3 | o3 | 2025-04-16 | 推理模型 | `models/openai/o3.yaml` |

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

## 未找到原始来源的分数 / 说明

| 模型 | 字段/分数 | 原因 |
|------|-----------|------|
| GPT-4o | `parameters.total` / `parameters.active` | OpenAI 未公开 GPT-4o 的参数规模。 |
| GPT-4o | `architecture` | OpenAI 未公开架构细节（Dense / MoE 等）。 |
| GPT-4o | `mmlu-pro`, `humaneval`, `math-level-5`, `gsm8k`, `arena-elo`, `bbh`, `drop`, `hellaswag`, `arc-c`, `winogrande` | 原始发布博客未列出具体数值；系统卡 PDF 未成功下载/解析出对应表格。 |
| o1 | `parameters.total` / `parameters.active` | OpenAI 未公开 o1 的参数规模。 |
| o1 | `architecture` | OpenAI 未公开架构细节。 |
| o1 | `mmlu-pro`, `humaneval`, `gsm8k`, `arena-elo`, `ifeval`, `bbh`, `drop`, `hellaswag`, `arc-c`, `winogrande` | 官方 o1 API 公告页的 benchmark 表未包含这些项目。 |
| o3 | `parameters.total` / `parameters.active` | OpenAI 未公开 o3 的参数规模。 |
| o3 | `architecture` | OpenAI 未公开架构细节。 |
| o3 | `mmlu`, `mmlu-pro`, `humaneval`, `math-level-5`, `gsm8k`, `arena-elo`, `ifeval`, `bbh`, `drop`, `hellaswag`, `arc-c`, `winogrande` | 官方 o3 公告页主要强调 SWE-bench、Codeforces、AIME、GPQA、MMMU 等，未提供上述全部项目的具体数值；AIME 分数因不在允许集合中未记录为 `math-level-5`。 |

## PDF 下载情况

- o3 系统卡 PDF 链接已记录，但本次未成功下载到本地（`docs/papers/openai/` 目录为空）。  
- GPT-4o 系统卡为 arXiv 页面，未单独下载 PDF。  
- o1 系统卡为 arXiv 页面，未单独下载 PDF。
