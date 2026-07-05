# LLM Radar 构建目标（Goal）

## 目标

根据 `PRD.md` 与 `CONTEXT.md`，完整构建 `llm-radar` 项目：

1. 通过联网搜索，从各模型发布方的原始论文、技术报告或官方 leaderboard 中收集至少 15 个主流大模型的真实 benchmark 分数与元数据。
2. 将收集到的数据整理为 `metrics.yaml`、`companies.yaml` 与 `models/{company}/{model}.yaml`。
3. 使用 Vite + React 18 + TypeScript + shadcn/ui + Tailwind CSS + ECharts 实现前端雷达图站点。
4. 实现构建脚本 `scripts/build-index.ts`，自动扫描 YAML 并生成 `public/model-index.json`，包含完整校验逻辑。
5. 编写接缝测试（Vitest）覆盖 Data-to-Deploy 与雷达图 option 生成两个 Seam。
6. 配置 GitHub Actions（`.github/workflows/deploy.yml`），仅在 `cicd` 分支推送时构建并部署到 `gh-pages`。
7. 将代码推送到 `git@github.com:WhitePlusMS/llm-radar.git` 的 `master` 分支，再通过 `cicd` 分支触发 GitHub Pages 部署，最终验证网站可公开访问且无可见 bug。

## 完成标准（Proof）

- [ ] `npm install` 后，`npm run build` 退出码为 0。
- [ ] `npm test` 退出码为 0，所有接缝测试通过。
- [ ] `public/model-index.json` 中存在至少 15 个模型、对应公司与 benchmark 定义。
- [ ] `dist/` 目录包含可部署的静态文件，首页 `index.html` 可以正常打开。
- [ ] 本地 `npm run preview` 中，雷达图能渲染多个模型、支持勾选 benchmark、平均线显示正确、缺失分数显示为 N/A。
- [ ] GitHub 仓库 `master` 分支包含完整代码（README、.gitignore、源码、数据、配置、工作流）。
- [ ] GitHub Actions 在 `cicd` 分支推送后成功运行，并将产物部署到 `gh-pages`。
- [ ] 通过 `https://whiteplusms.github.io/llm-radar/` 访问站点，页面无白屏、无控制台报错、所有交互正常。

## 范围与边界（Scope）

- **仅构建 PRD/CONTEXT 中约定的功能**：配置驱动的雷达图、模型对比、benchmark 自选、平均线、N/A 可视化、来源追溯、URL 状态同步、响应式布局、数据表格视图。
- **不实现 Out of Scope 内容**：自动抓取、后端服务、复合评分/排行榜、深色模式、模型详情页、价格/速度、多语言、实时协作。
- **数据来源**：只采用模型发布方原始论文、技术报告或官方 leaderboard；不采用第三方复测或匿名来源。
- **修改范围**：当前工作目录 `E:/项目demo/llm-radar` 及其关联的 GitHub 仓库 `WhitePlusMS/llm-radar`。
- **推送策略**：开发中代码推 `master`；部署触发推 `cicd`。

## 执行循环（Loop）

1. **数据收集**：按公司/模型并发搜索论文与技术报告，下载 PDF 或记录 URL，提取关键 benchmark 分数与元数据。
2. **数据整理**：将提取结果写入 YAML，每完成一批运行 `npx tsx scripts/build-index.ts` 校验。
3. **骨架实现**：初始化 Vite + React 项目，安装依赖，配置 TypeScript 严格模式，实现类型、构建脚本、数据加载、雷达图 option、状态管理、组件。
4. **测试验证**：编写并运行接缝测试，修复失败项。
5. **构建与预览**：运行完整 `npm run build` 与 `npm run preview`，人工检查页面行为。
6. **推送与部署**：尝试提交到 `master` 并推送到 GitHub；创建/更新 `cicd` 分支推送以触发 Actions；验证 Pages 站点上线。

## 无人值守与失败处理规则

- **不等待用户在线**：构建过程中遇到任何需要人工确认或外部授权的步骤（如 Git 认证弹窗、GitHub 2FA、SSH 密钥交互、GitHub Actions 仓库设置调整），不暂停等待用户，而是记录 blocker 后继续执行可独立推进的任务。
- **Git 推送失败**：如果 `git push` 因网络、权限或认证失败，记录失败原因到 `BLOCKERS.md`，继续完成本地构建、测试和产物生成；第二天早上由用户手动处理 Git 认证或网络问题后重新推送。
- **GitHub Actions 失败**：如果 Actions 因仓库 Pages 未启用、权限不足或工作流配置错误而失败，记录详细日志与所需手动操作到 `BLOCKERS.md`，不阻塞本地验证和代码完整性。
- **模型数据缺失**：若某个模型找不到发布方原始来源，跳过该模型并记录原因，继续收集其他模型，确保最终至少有 15 个有效模型。
- **结构性构建错误**：如果 `npm run build` 或 `npm test` 因代码/数据错误失败，必须修复后再推进，因为这类错误会阻止上线。
- **最终交付物**：除完整代码外，生成 `BLOCKERS.md`，汇总所有需要用户早上处理的事项（如 Git 认证、GitHub Pages 启用、SSH 配置等），确保用户能一键完成剩余操作。

## 停止规则（Stop Rule）

- 若某个模型找不到发布方原始来源，跳过该模型并记录原因，继续下一个，不阻塞整体构建。
- 若构建脚本或前端出现无法通过常规调试修复的结构性问题，暂停并报告具体错误与已尝试方案。
- 若 GitHub Actions 因仓库设置（如 Pages 未启用、权限不足）无法部署，记录详细日志与所需手动操作。
- 若联网搜索工具不可用或外部服务持续失败，记录影响范围并切换到已收集数据继续构建。

## 说明

- 本目标作为 `/goal` 模式的长周期目标使用，支持跨多轮自动执行。
- 不设硬性 turn/token 预算，按上述里程碑逐步交付，并在关键节点向用户汇报（或记录到日志文件供早上查看）。
