# 2026-07-07 模型收录清洗结论

> 目的：把“脚本扫描结果”和“并发官方主线核验结果”合并成可执行清单。
> 口径：优先保留官方主线模型；对没有任何数值 benchmark 的中小模型和历史/过粗条目做重点复核。

## 1. 脚本扫描结论

扫描脚本：`scripts/scan-parameter-gaps.ts`

- 模型总数：`143`
- 完全没有 `parameters`：`68`
- 缺少 `parameters.active`：`1`
- `scores` 完全为空：`73`
- 完全没有任何数值 benchmark：`76`
- 同时缺少 `parameters` 且没有任何数值 benchmark：`47`
- 中小模型且没有任何数值 benchmark：`14`

对应报告：

- `docs/research/model-parameter-gap-scan-2026-07-07.md`

### 中小模型且没有任何数值 benchmark（人工复核候选）

- `alibaba/qwen3-omni-30b-a3b`
- `alibaba/qwq-32b`
- `baichuan/baichuan-m1-14b`
- `baidu/ernie-4.5-21b-a3b`
- `baidu/ernie-4.5-vl-28b-a3b-thinking`
- `deepseek/vl2`
- `meta/llama-3.2-11b-vision`
- `mistral/devstral-small`
- `mistral/magistral-small`
- `mistral/ministral-3-14b-25.12`
- `mistral/ministral-8b`
- `moonshot/kimi-vl`
- `moonshot/kimi-vl-thinking-2506`
- `tencent/hunyuanvideo-1.5`

## 2. 明确应补的官方主线

以下条目来自并发官方核验，且主线身份比较明确。

### OpenAI

- `gpt-5.1`
- `gpt-5.2`
- `gpt-5.2-pro`
- `gpt-5.3-codex`

来源：

- https://developers.openai.com/api/docs/models/all
- https://developers.openai.com/api/docs/models/gpt-5.3-codex

### Google

- `gemini-3.1-flash-lite`

来源：

- https://ai.google.dev/gemini-api/docs/models
- https://ai.google.dev/gemini-api/docs/models/gemini-v3

### Baidu

- `ERNIE-X1.1`
- `ERNIE-4.5-Turbo-128K`
- `ERNIE-4.5-Turbo-VL`
- `ERNIE-4.5-0.3B`

来源：

- https://cloud.baidu.com/doc/qianfan/s/rmh4stp0j
- https://cloud.baidu.com/product/model.html
- https://ernie.baidu.com/blog/posts/ernie4.5/

### Tencent

- `Hy3`
- `Hy3-Preview`
- `HY-Image-V3.0`
- `HY-3D-3.1`
- `HY-Vision-2.0-Instruct`

来源：

- https://cloud.tencent.com/document/product/1823/130051
- https://github.com/Tencent-Hunyuan/Hy3
- https://cloud.tencent.com/product/tclm

### Zhipu

- `GLM-4.6`
- `GLM-4.7`
- `GLM-5-Turbo`
- `GLM-5V-Turbo`
- `GLM-4.6V`

来源：

- https://docs.z.ai/release-notes/new-released
- https://docs.z.ai/guides/llm/glm-4.7
- https://docs.z.ai/guides/llm/glm-5-turbo

### Alibaba / Qwen

优先级最高的一批：

- `Qwen2.5-32B / 14B / 7B / 3B / 1.5B / 0.5B`
- `Qwen3-4B / 1.7B / 0.6B`
- `Qwen2.5-Omni-3B`
- `Qwen3.5-27B / 9B / 4B / 2B / 0.8B`
- `Qwen3.6-27B`
- `Qwen2.5-Coder-32B / 7B / 1.5B`

来源：

- https://qwenlm.github.io/blog/qwen2.5/
- https://qwenlm.github.io/blog/qwen3/
- https://qwenlm.github.io/blog/qwen2.5-omni/
- https://qwenlm.github.io/blog/qwen2.5-coder-family/
- https://huggingface.co/Qwen/Qwen3.5-27B
- https://huggingface.co/Qwen/Qwen3.6-27B

## 3. 明确需要复核或候选移除的条目

这组不是“立即删除”，而是下一轮优先做官方口径复核。

### 历史 / 非 canonical / 过粗条目

- `anthropic/claude-3.7-sonnet`
- `openai/o1-pro`
- `openai/o4-mini`
- `xai/grok-4`
- `baidu/ernie-5.0-base`
- `zhipu/glm-4`

### 可能因为 benchmark 集不匹配而不值得继续保留

- `alibaba/qwen2-vl-72b`
- `alibaba/qwen2.5-vl`
- `alibaba/qwen3-omni-30b-a3b`
- `alibaba/qwen3-vl-235b-a22b`

原因：

- 它们虽然是官方模型，但当前公开 benchmark 主要落在视觉、视频、音频或多模态集合，和当前 `metrics.yaml` 的通用文本指标集合不匹配。

来源：

- https://arxiv.org/abs/2409.12191
- https://arxiv.org/abs/2502.13923
- https://github.com/QwenLM/Qwen3-Omni
- https://huggingface.co/Qwen/Qwen3-VL-235B-A22B-Instruct

### 官方主线但应保留，不能只因为空分数就误删

- `anthropic/claude-sonnet-4.5`
- `anthropic/claude-sonnet-4.6`
- `anthropic/claude-opus-4.5`
- `anthropic/claude-opus-4.6`
- `anthropic/claude-opus-4.7`
- `openai/gpt-5*`
- `openai/o3*`
- `google/gemini-2.5-flash-lite`
- `google/gemini-3-flash-preview`
- `xai/grok-4.3`
- `xai/grok-build-0.1`

原因：

- 这些条目虽然缺参数或缺当前 benchmark，但官方主线身份清楚，不能简单因为 `scores: {}` 就删掉。

## 4. 下一轮执行顺序

1. 先处理 `Alibaba / Qwen`，因为缺失模型多，而且很多缺卡都有官方 benchmark 可直接映射到当前 `metrics.yaml`。
2. 再处理 `OpenAI / Google / Baidu / Zhipu / Tencent` 的高置信主线补卡。
3. 最后处理候选移除条目，逐个核实是否真要从仓库移出，而不是只在研究文档里标注历史状态。
