# 更新日志

## 2026-07-06 — 添加 Moonshot AI（Kimi）旗舰大模型 ModelCard

### 修改原因

根据数据收集任务要求，为 `llm-radar` 补充 Moonshot AI（月之暗面 / Kimi）在 2024–2026 年间发布的最重要旗舰大语言模型配置，覆盖 reasoning（Kimi K1.5）、open-weights agentic（Kimi K2）、multimodal agentic（Kimi K2.5）三条主线，使项目可用于雷达图对比。

### 修改文件

1. **`models/moonshot/kimi-k1.5.yaml`**
   - 新增 Kimi K1.5 模型卡片（2025-01-22 发布）。
   - 关键字段：closed-weights、reasoning、multimodal、128k 上下文、text+image 输入、text 输出。
   - 分数：MMLU 87.4、IFEval 87.2、math-level-5 (MATH-500) 96.2、HumanEval-Mul 81.5。
   - 来源：arXiv `2501.12599`。

2. **`models/moonshot/kimi-k2.yaml`**
   - 新增 Kimi K2 模型卡片（2025-07-28 发布）。
   - 关键字段：MoE 架构、1T total / 32B active、128k 上下文、text 输入/输出、open-weights/reasoning 标签。
   - 分数：MMLU 89.5、MMLU-Pro 81.1、GPQA-Diamond 75.1、SWE-Bench Verified 65.8、math-level-5 (MATH-500) 97.4、IFEval 89.8、DROP 93.5。
   - 来源：arXiv `2507.20534` + 官方 GitHub `MoonshotAI/Kimi-K2`。

3. **`models/moonshot/kimi-k2.5.yaml`**
   - 新增 Kimi K2.5 模型卡片（2026-02-02 发布）。
   - 关键字段：MoE 架构、1T total / 32B active、256k 上下文、text+image+video 输入、text 输出、open-weights/multimodal/reasoning 标签。
   - 分数：MMLU-Pro 87.1、GPQA-Diamond 87.6、SWE-Bench Verified 76.8。
   - 来源：arXiv `2602.02276` + Hugging Face 模型卡。

4. **`docs/research/moonshot-sources.md`**
   - 记录本次搜索到的 Moonshot AI 官方来源 URL、来源类型、包含信息。
   - 说明 Kimi K1.5 参数规模/架构未公开，以及部分 benchmark 未报告的原因。

5. **`docs/papers/moonshot/kimi-k1.5.pdf`**
   - 从 arXiv 下载的 Kimi K1.5 技术报告 PDF。

6. **`docs/papers/moonshot/kimi-k2.pdf`**
   - 从 arXiv 下载的 Kimi K2 技术报告 PDF。

7. **`docs/papers/moonshot/kimi-k2.5.pdf`**
   - 从 arXiv 下载的 Kimi K2.5 技术报告 PDF。

8. **`assets/logos/moonshot.svg`**
   - 从 Moonshot AI 官方品牌指南下载的 Kimi "K Only" SVG 标志，作为 `moonshot` 公司 logo 使用。

9. **`metrics.yaml`**
   - 新建文件，定义模型卡片中使用的全部 benchmark key（`mmlu-pro`、`mmlu`、`gpqa`、`humaneval`、`swe-bench`、`math-level-5`、`gsm8k`、`arena-elo`、`ifeval`、`bbh`、`drop`、`hellaswag`、`arc-c`、`winogrande`），确保后续 `scripts/build-index.ts` 校验通过。

10. **`companies.yaml`**
    - 新增 `moonshot` 公司元数据条目（`name: Moonshot AI`，`website: https://moonshot.ai`），确保 ModelCard 中的 `company: moonshot` 引用可解析。

### 数据来源与置信度

- 所有分数均来自 Moonshot AI 官方 arXiv 技术报告表格中的原始数值，按 percentage 尺度原样记录。
- Kimi K2 / K2.5 的架构与参数量来自官方技术报告明确描述（K2 为 1.04T total / 32B active MoE；K2.5 基于 K2）。
- Kimi K1.5 参数规模与架构官方未披露，已在 YAML 与来源文档中明确标记。
- 品牌主色 `#1783FF` 取自官方 SVG logo 中的蓝色。
- 未使用任何第三方复测、社区 leaderboard 或匿名来源。

### 修改影响

- `models/moonshot/` 目录下现在有 3 个有效的 ModelCard YAML 文件，可供后续 `scripts/build-index.ts` 扫描生成 `public/model-index.json`。
- `metrics.yaml` 与 `companies.yaml` 已补充，当前 Moonshot 模型卡片可直接通过构建校验。
- `assets/logos/moonshot.svg` 已存在，构建时不会因 logo 缺失产生警告。

### 待后续确认/补充

- 若 Moonshot AI 后续公开 Kimi K1.5 的参数量与架构，可回填 `parameters` 与 `architecture` 字段。
- 若官方发布新的 benchmark 分数（如 Arena ELO、GSM8K 等），可补充到对应模型卡片。

---

## 2026-07-05 — 添加 Meta 旗舰大模型 ModelCard

### 修改原因

根据数据收集任务要求，为 `llm-radar` 补充 Meta 公司在 2024–2026 年间发布的最重要旗舰大语言模型配置，使项目具备首批可用于雷达图对比的真实模型数据。

### 修改文件

1. **`models/meta/llama-4-maverick.yaml`**
   - 新增 Llama 4 Maverick Instruct 模型卡片。
   - 关键字段：MoE 架构、400B total / 17B active、1M 上下文、text+image 输入、text+code 输出、open-weights/chat/multimodal 标签。
   - 分数：MMLU-Pro 80.5、GPQA Diamond 69.8（均来自官方 Model Card 的 Instruction tuned 评测表）。

2. **`models/meta/llama-4-scout.yaml`**
   - 新增 Llama 4 Scout Instruct 模型卡片。
   - 关键字段：MoE 架构、109B total / 17B active、10M 上下文、text+image 输入、text+code 输出。
   - 分数：MMLU-Pro 74.3、GPQA Diamond 57.2。

3. **`models/meta/llama-3.1-405b.yaml`**
   - 新增 Llama 3.1 405B Instruct 模型卡片。
   - 关键字段：Dense 架构、405B 参数、128k 上下文、text 输入、text+code 输出。
   - 分数：MMLU 88.6、MMLU-Pro 73.3、IFEval 88.6、GPQA 50.7、HumanEval 89.0、GSM8K 96.8、ARC-C 96.9。

4. **`docs/research/meta-sources.md`**
   - 记录本次搜索到的所有原始来源 URL、来源类型、包含信息。
   - 说明未收录 Llama 3.3 70B / Llama 4 Behemoth 的原因。

5. **`docs/papers/meta/llama-3-herd-of-models.pdf`**
   - 下载并保存 Meta 官方 arXiv 技术报告《The Llama 3 Herd of Models》PDF（arXiv:2407.21783）。

### 数据来源与置信度

- 所有分数均来自 Meta 官方 GitHub Model Card（`meta-llama/llama-models`），属于发布方原始来源。
- Llama 3.1 额外引用同一份官方 arXiv 技术报告作为交叉来源。
- 未使用任何第三方复测、社区 leaderboard 或匿名来源。

### 修改影响

- `models/meta/` 目录下现在有 3 个有效的 ModelCard YAML 文件，可供后续 `scripts/build-index.ts` 扫描生成 `public/model-index.json`。
- 当前模型卡片中使用的 benchmark key（`mmlu`、`mmlu-pro`、`gpqa`、`humaneval`、`gsm8k`、`ifeval`、`arc-c`）均来自任务指定的常见集合，后续需在 `metrics.yaml` 中定义对应指标以确保构建校验通过。
- 三个模型均引用 `assets/logos/meta.svg`，该 logo 文件尚未创建；根据项目规则，logo 缺失时构建会发出警告但不阻断构建。

### 待后续确认/补充

- `metrics.yaml` 中需要添加上述 benchmark key 的定义。
- 可考虑后续补充 Meta logo SVG（`assets/logos/meta.svg`）。

---

## 2026-07-06 — 添加 Alibaba（Qwen）旗舰大模型 ModelCard

### 修改原因

根据数据收集任务要求，为 `llm-radar` 补充 Alibaba（通义千问 / Qwen）在 2024–2026 年间发布的最重要旗舰大语言模型配置，覆盖 chat、reasoning、multimodal 三条主线，使项目可用于雷达图对比。

### 修改文件

1. **`models/alibaba/qwen3.yaml`**
   - 新增 Qwen3 模型卡片。
   - 关键字段：MoE 架构、235B total / 22B active、128k 上下文、text 输入/输出、open-weights/reasoning 标签。
   - 分数：MMLU 87.81、MMLU-Pro 68.18、GPQA 47.47、GSM8K 94.39、MATH 71.84（记为 math-level-5）、BBH 88.87、IFEval 83.4（thinking 模式）。
   - 来源：arXiv `2505.09388` + 官方博客 `qwenlm.github.io/blog/qwen3/`。

2. **`models/alibaba/qwen2.5.yaml`**
   - 新增 Qwen2.5 模型卡片。
   - 关键字段：Dense 架构、72B total / 72B active、128k 上下文、text 输入/输出、open-weights 标签。
   - 分数：MMLU 86.1、MMLU-Pro 71.1、GPQA 49.0、GSM8K 95.8、MATH 83.1（记为 math-level-5）、BBH 86.3、HumanEval 86.6、IFEval 84.1、ARC-C 72.4、HellaSwag 87.6、WinoGrande 83.9。
   - 来源：arXiv `2412.15115` + 官方博客 `qwenlm.github.io/blog/qwen2.5/`。

3. **`models/alibaba/qwen3.5-omni.yaml`**
   - 新增 Qwen3.5-Omni 模型卡片。
   - 关键字段：Thinker-Talker Hybrid Attention MoE 架构、总/激活参数量未公开（`undisclosed`）、256k 上下文、text/image/audio/video 输入、text/audio 输出、closed-weights/multimodal 标签。
   - 分数：MMLU-Pro 85.9、GPQA 83.9、IFEval 89.7。
   - 来源：arXiv `2604.15804`。

4. **`docs/research/alibaba-sources.md`**
   - 列出搜索到的 Alibaba/Qwen 原始来源 URL。
   - 说明未收录 QwQ / Qwen2.5-VL / Coder / Math 的原因，以及未报告 benchmark（swe-bench、arena-elo 等）和 Qwen3.5-Omni 精确参数未披露的情况。

5. **`docs/papers/alibaba/qwen3.pdf`**
   - 从 arXiv 下载的 Qwen3 技术报告 PDF。

6. **`docs/papers/alibaba/qwen2.5.pdf`**
   - 从 arXiv 下载的 Qwen2.5 技术报告 PDF。

7. **`docs/papers/alibaba/qwen3.5-omni.pdf`**
   - 从 arXiv 下载的 Qwen3.5-Omni 技术报告 PDF。

8. **`companies.yaml`**
   - 新增 `alibaba` 公司元数据条目（`name: Alibaba`，`website: https://www.alibabacloud.com`），确保 ModelCard 中的 `company: alibaba` 引用可解析。

### 数据来源与置信度

- 所有分数均来自 Alibaba Qwen 团队官方 arXiv 技术报告表格中的原始数值，按 percentage 尺度原样记录。
- Qwen3 IFEval 取 thinking 模式数值（Table 11: 83.4；non-thinking 模式 Table 12 为 83.2）。
- Qwen2.5 MATH 分数在 YAML 中映射为 `math-level-5`，与仓库中 Tencent/Zhipu 等已有 ModelCard 的做法保持一致。
- Qwen3.5-Omni 参数规模官方未披露，已在 YAML 与来源文档中明确标记。
- 未使用任何第三方复测、社区 leaderboard 或匿名来源。

### 修改影响

- `models/alibaba/` 目录下现在有 3 个有效的 ModelCard YAML 文件，可供后续 `scripts/build-index.ts` 扫描生成 `public/model-index.json`。
- 三个模型均引用 `assets/logos/alibaba.svg`，该 logo 文件尚未创建；根据项目规则，logo 缺失时构建会发出警告但不阻断构建。
- 当前模型卡片中使用的 benchmark key 需要在 `metrics.yaml` 中定义对应指标以确保构建校验通过。

### 待后续确认/补充

- `metrics.yaml` 中需要添加 Qwen 系列使用的 benchmark key 定义。
- 可考虑后续补充 Alibaba logo SVG（`assets/logos/alibaba.svg`）。

---

## 2026-07-05 — 添加 OpenAI 旗舰大模型 ModelCard

### 修改原因

根据数据收集任务要求，为 `llm-radar` 补充 OpenAI 公司在 2024–2025 年间发布的最重要旗舰大语言模型配置，覆盖多模态 chat 模型与 reasoning 模型，使项目具备可用于雷达图对比的真实模型数据。

### 修改文件

1. **`models/openai/gpt-4o.yaml`**
   - 新增 GPT-4o 模型卡片（2024-05-13）。
   - 关键字段：closed-weights、multimodal、128k 上下文、text/image/audio/video 输入、text/image/audio 输出。
   - 分数：MMLU 85.7、GPQA Diamond 46.0、SWE-bench Verified 33.2、IFEval 81.0（均来自 OpenAI 官方 GPT-4.1 发布页中的 GPT-4o 2024-11-20 快照对比表）。
   - 说明：参数规模与架构未公开；原始 announce 页面未列具体 benchmark 数值。

2. **`models/openai/o1.yaml`**
   - 新增 OpenAI o1 模型卡片（2024-12-05）。
   - 关键字段：closed-weights、reasoning、200k 上下文、text/image 输入、text 输出。
   - 分数：MMLU 91.8、GPQA Diamond 75.7、SWE-bench Verified 48.9、MATH (math-level-5) 96.4（均来自 OpenAI 官方 o1 API 发布页中的 `o1-2024-12-17` 对比表）。
   - 说明：参数规模与架构未公开。

3. **`models/openai/o3.yaml`**
   - 新增 OpenAI o3 模型卡片（2025-04-16）。
   - 关键字段：closed-weights、reasoning、multimodal、200k 上下文、text/image 输入、text 输出。
   - 分数：GPQA Diamond 87.7、SWE-bench Verified 71.7（来自 OpenAI 官方 o3/o4-mini 发布公告）。
   - 说明：参数规模与架构未公开；官方公告主要强调 SWE-bench、Codeforces、AIME、GPQA、MMMU 等，但仅有 GPQA/SWE-bench 在允许分数集合内有明确数值。

4. **`docs/research/openai-sources.md`**
   - 记录本次搜索到的 OpenAI 官方来源 URL、来源类型、包含信息。
   - 说明未填报的 benchmark 字段及原因。
   - 说明 o3 系统卡 PDF 未成功下载到本地。

### 数据来源与置信度

- 所有分数均来自 OpenAI 官方博客/系统卡中公布的原始数值，按 percentage / raw 尺度原样记录。
- 未采用 LMSYS Arena ELO 等第三方 leaderboard 数据，严格遵循 ScoreSourcePolicy。
- 品牌主色采用 OpenAI 标志性绿色 `#10A37F`。

### 修改影响

- `models/openai/` 目录下现在有 3 个有效的 ModelCard YAML 文件，可供后续 `scripts/build-index.ts` 扫描生成 `public/model-index.json`。
- 当前模型卡片中使用的 benchmark key（`mmlu`、`gpqa`、`swe-bench`、`ifeval`、`math-level-5`）均来自任务指定的常见集合，后续需在 `metrics.yaml` 中定义对应指标以确保构建校验通过。
- 三个模型均引用 `assets/logos/openai.svg`，该 logo 文件尚未创建；根据项目规则，logo 缺失时构建会发出警告但不阻断构建。

### 待后续确认/补充

- `metrics.yaml` 中需要添加本批次使用的 benchmark key 的定义。
- 可考虑后续补充 OpenAI logo SVG（`assets/logos/openai.svg`）。
- 可尝试重新下载 o3 系统卡 PDF 到 `docs/papers/openai/`。

---

## 2026-07-06 — 添加 Baichuan（百川智能）旗舰大模型 ModelCard

### 修改原因

根据数据收集任务要求，为 `llm-radar` 补充 Baichuan（百川智能）公司在 2024–2025 年间发布的最重要旗舰大语言模型配置，覆盖对话、推理、多模态三类模型。

### 修改文件

1. **`models/baichuan/baichuan4.yaml`**
   - 新增 Baichuan4 模型卡片（2024-05-22 发布）。
   - 关键字段：closed-weights、32k 上下文、text 输入/输出。
   - 录入分数：无（官方新闻稿未报告 MMLU-Pro / GPQA / HumanEval 等国际化 benchmark 数值）。

2. **`models/baichuan/baichuan-m1-preview.yaml`**
   - 新增 Baichuan-M1-preview 模型卡片（2025-01-24 发布）。
   - 关键字段：closed-weights、reasoning、multimodal；text+image 输入、text 输出。
   - 录入分数：无（仅有官方媒体通稿的定性描述，无原始 benchmark 数值）。

3. **`models/baichuan/baichuan-omni.yaml`**
   - 新增 Baichuan-Omni 模型卡片（2024-10-11 发布）。
   - 关键字段：open-weights、multimodal、Dense 架构、7B total / 7B active、text+image+video+audio 输入、text 输出。
   - 录入分数：mmlu = 65.3（来自 arXiv 论文 Table 1）。

4. **`docs/research/baichuan-sources.md`**
   - 记录搜索到的 Baichuan 官方来源 URL。
   - 说明未找到来源/未报告分数的模型及原因。
   - 记录 Baichuan-M1-14B 论文来源备查。

5. **`docs/papers/baichuan/baichuan-omni.pdf`**
   - 从 arXiv 下载的 Baichuan-Omni 技术报告 PDF。

6. **`docs/papers/baichuan/baichuan-m1.pdf`**
   - 从 arXiv 下载的 Baichuan-M1 论文 PDF（对应 Baichuan-M1-14B）。

### 数据来源与置信度

- Baichuan4 与 Baichuan-M1-preview 信息来自百川智能官方新闻稿及政府/科技媒体报道。
- Baichuan-Omni 分数来自发布方 arXiv 论文原文表格，按 percentage 尺度原样记录。
- 未使用任何第三方复测、社区 leaderboard 或匿名来源。

### 修改影响

- `models/baichuan/` 目录下现在有 3 个有效的 ModelCard YAML 文件，可供后续 `scripts/build-index.ts` 扫描生成 `public/model-index.json`。
- 当前模型卡片中使用的 benchmark key（`mmlu`）来自任务指定的常见集合，后续需在 `metrics.yaml` 中定义对应指标以确保构建校验通过。
- 三个模型均引用 `assets/logos/baichuan.svg`，该 logo 文件尚未创建；根据项目规则，logo 缺失时构建会发出警告但不阻断构建。

### 待后续确认/补充

- `companies.yaml` 与 `metrics.yaml` 在仓库中尚未创建，需补充 `baichuan` 公司及 `mmlu` 指标定义以保证构建脚本通过校验。
- 可考虑后续补充 Baichuan logo SVG（`assets/logos/baichuan.svg`）。

## 2026-07-06 — 添加 Anthropic 旗舰大模型 ModelCard

### 修改原因

根据数据收集任务要求，为 `llm-radar` 补充 Anthropic 在 2024–2026 年间发布的最重要旗舰大语言模型配置，覆盖 multimodal（Claude 3.5 Sonnet）、hybrid reasoning（Claude 4 Opus）与最新旗舰（Claude Fable 5）三条主线，使项目可用于雷达图对比。

### 修改文件

1. **`models/anthropic/claude-3.5-sonnet.yaml`**
   - 新增 Claude 3.5 Sonnet（2024-10-22 升级版）模型卡片。
   - 关键字段：Dense 架构、200k 上下文、text+image 输入、text 输出、closed-weights/multimodal 标签。
   - 分数：MMLU 88.7、MMLU-Pro 78.0、GPQA-Diamond 65.0、HumanEval 93.7、SWE-bench Verified 49.0、math-level-5 (MATH) 78.3、DROP 88.3、BBH 93.2、IFEval 90.2。
   - 来源：官方 Model Card Addendum PDF。

2. **`models/anthropic/claude-4-opus.yaml`**
   - 新增 Claude 4 Opus 模型卡片（2025-05-22 发布）。
   - 关键字段：Dense 架构、200k 上下文、text+image 输入、text 输出、closed-weights/reasoning/multimodal 标签。
   - 分数：SWE-bench Verified 72.5、GPQA-Diamond 74.9。
   - 来源：官方发布博客 + System Card PDF。

3. **`models/anthropic/claude-fable-5.yaml`**   - 新增 Claude Fable 5 模型卡片（2026-06-09 发布）。   - 关键字段：Dense 架构、1M 上下文、text+image 输入、text 输出、closed-weights/reasoning/multimodal 标签。   - 分数：SWE-bench Verified 95.0、GPQA-Diamond 94.1（Mythos 5 同底模型结果）。   - 来源：官方 System Card PDF + 发布博客。

4. **`docs/research/anthropic-sources.md`**   - 记录本次搜索到的 Anthropic 官方来源 URL、来源类型、包含信息。   - 说明参数规模未公开及部分 benchmark 未报告的原因。

5. **`docs/papers/anthropic/claude-3-5-sonnet-oct-addendum.pdf`**   - 从 Anthropic 官网下载的 Claude 3.5 Sonnet 十月升级版 Model Card Addendum。

6. **`docs/papers/anthropic/claude-4-system-card.pdf`**   - 从 Anthropic 官网下载的 Claude Opus 4 & Sonnet 4 System Card。

7. **`docs/papers/anthropic/claude-fable-5-mythos-5-system-card.pdf`**   - 从 Anthropic 官网下载的 Claude Fable 5 & Mythos 5 System Card。

### 数据来源与置信度

- 所有分数均来自 Anthropic 官方博客或 system/model card PDF 中的原始数值，按 percentage 尺度原样记录。
- Claude 3.5 Sonnet 的 MATH 分数在来源中报告为 Hendrycks MATH  overall；在 YAML 中映射为 `math-level-5` 并附注释说明。
- 参数规模官方未披露，已在 YAML 与来源文档中明确标记。
- 品牌主色 `#CC785C` 取自 Anthropic 公开设计资料中的 Coral / Primary 色值。
- 未使用任何第三方复测、社区 leaderboard 或匿名来源。

### 修改影响

- `models/anthropic/` 目录下现在有 3 个有效的 ModelCard YAML 文件，可供后续 `scripts/build-index.ts` 扫描生成 `public/model-index.json`。
- 当前模型卡片中使用的 benchmark key 来自任务指定的常见集合，后续需在 `metrics.yaml` 中定义对应指标以确保构建校验通过。
- 三个模型均引用 `assets/logos/anthropic.svg`，该 logo 文件尚未创建；根据项目规则，logo 缺失时构建会发出警告但不阻断构建。

### 待后续确认/补充

- `companies.yaml` 与 `metrics.yaml` 在仓库中尚未创建，需补充 `anthropic` 公司及所使用指标定义以保证构建脚本通过校验。
- 可考虑后续补充 Anthropic logo SVG（`assets/logos/anthropic.svg`）。
