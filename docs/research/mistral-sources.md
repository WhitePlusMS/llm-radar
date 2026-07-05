# Mistral 模型调研来源

调研日期：2026-07-05

## 已确认并采用为 ModelCard 来源的原始来源

### Mistral Large 3（2025-12-02）

- **官方博客**：Introducing Mistral 3
  - URL: https://mistral.ai/news/mistral-3/
  - 类型：blog
  - 关键信息：Mistral Large 3 为稀疏 MoE，41B active / 675B total，256k 上下文，Apache 2.0，多语言多模态，LMArena #2 in OSS non-reasoning。
- **Hugging Face 模型卡**：mistralai/Mistral-Large-3-675B-Instruct-2512
  - URL: https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512
  - 类型：model_card
  - 关键信息：确认参数、MoE 架构（673B + 39B active language model + 2.5B vision encoder）、256k 上下文、Apache 2.0、多模态能力。

### Pixtral Large（2024-11-19）

- **官方博客**：Pixtral Large
  - URL: https://mistral.ai/news/pixtral-large/
  - 类型：blog
  - 关键信息：124B open-weights 多模态模型（123B decoder + 1B vision encoder），128k 上下文，MathVista 69.4%，在 ChartQA/DocVQA/MM-MT-Bench 上超过 GPT-4o/Gemini-1.5 Pro。
- **Hugging Face 模型卡**：mistralai/Pixtral-Large-Instruct-2411
  - URL: https://huggingface.co/mistralai/Pixtral-Large-Instruct-2411
  - 类型：model_card

### Magistral Medium（2025-06-10）

- **官方博客**：Magistral
  - URL: https://mistral.ai/news/magistral
  - 类型：blog
  - 关键信息：Mistral 首个推理模型；Magistral Small 24B Apache 2.0；Magistral Medium 为更强企业版；Medium AIME 2024 pass@1 = 73.6%，majority-voting@64 = 90%；Small 分别为 70.7% / 83.3%；支持多语言 CoT。
- **arXiv 论文**：Magistral (arXiv:2506.10910)
  - URL: https://arxiv.org/abs/2506.10910
  - 类型：paper
  - PDF 已下载到：`docs/papers/mistral/magistral-arxiv-2506.10910.pdf`
  - 关键信息：介绍 Magistral Medium（基于 Mistral Medium 3 纯 RL 训练）和 Magistral Small（ cold-start + RL）；论文包含 RL 算法、基础设施、数据筛选与 benchmark 表格。

## 未采用来源说明

- 第三方 benchmark 聚合站（如 frontierbenchmarks.com、llm-stats.com、artificialanalysis.ai）给出了 Mistral Large 3 的 MMLU / MMLU-Pro / GPQA 等具体数值，但属于第三方复测/聚合，不符合本项目"只采用发布方原始来源"的 ScoreSourcePolicy，故未录入 scores。
- Mistral Large 3 的 Hugging Face README 中 benchmark 结果以图片形式嵌入（无法直接提取数值），官方博客亦未以文本列出 MMLU / MMLU-Pro / GPQA / HumanEval / GSM8K 等数值，因此对应 scores 字段留空。
- Pixtral Large 官方博客主要报告多模态 benchmark（MathVista、ChartQA、DocVQA、MM-MT-Bench、LMSys Vision Leaderboard），不在指定的常见文本 benchmark 集合内，故 scores 留空。
- Magistral 官方博客与论文报告 AIME-24/25、LiveCodeBench、Aider 等推理/代码 benchmark，但 AIME 不在指定常见集合内；其余指定 benchmark 未在原始来源中报告，故 scores 留空。
- Magistral Medium 的参数规模在原始来源中未明确给出（仅 Small 明确为 24B），因此 `parameters.total` 与 `parameters.active` 留空。

## 已下载 PDF

- `docs/papers/mistral/magistral-arxiv-2506.10910.pdf`（Magistral 论文）
