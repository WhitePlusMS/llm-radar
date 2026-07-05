# LLM Radar 部署阻塞项

> 生成时间：2026-07-06 00:48（北京时间）
>
> 本文件汇总了无人值守构建期间需要用户手动处理的事项。请按以下步骤操作后即可完成上线。

## 阻塞 1：GitHub Pages 未启用，导致 deploy job 失败

### 现象

- `cicd` 分支推送后 GitHub Actions 已触发。
- **build job**：成功（代码编译、测试、Vite 构建均通过）。
- **deploy job**：失败。
- Actions Run：`https://github.com/WhitePlusMS/llm-radar/actions/runs/28747864585`

### 根因

仓库尚未启用 GitHub Pages，或 Pages 的 Source 未设置为 **GitHub Actions**。`actions/deploy-pages@v4` 在 Pages 未启用时会失败。

### 手动操作步骤

1. 打开仓库设置：
   `https://github.com/WhitePlusMS/llm-radar/settings/pages`
2. 在 **Source** 下拉框中选择：
   **GitHub Actions**
3. 点击 **Save**。
4. 返回 Actions 页面，找到失败的 run：
   `https://github.com/WhitePlusMS/llm-radar/actions/runs/28747864585`
5. 点击右上角 **Re-run jobs** -> **Re-run all jobs**。
6. 等待 `deploy` job 完成。
7. 部署成功后，站点地址为：
   `https://whiteplusms.github.io/llm-radar/`

### 验证上线

- 访问 `https://whiteplusms.github.io/llm-radar/`
- 页面应显示 LLM Radar 标题、模型选择器、benchmark 选择器、雷达图与来源列表。
- 打开浏览器控制台，确认无红色报错。

## 其他潜在事项

### 本地 PDF 论文归档

- `docs/papers/` 目录下已下载约 180 MB 原始论文/报告 PDF，已排除在 git 之外（见 `.gitignore`）。
- 这些文件保留在本地 `E:/项目demo/llm-radar/docs/papers/`，无需推送。

### Logo 占位图

- `assets/logos/` 下已生成 15 个公司占位 SVG logo（品牌色圆形 + 首字母）。
- 如需使用真实品牌 logo，可后续替换对应 SVG 文件。

### 模型数据持续更新

- 当前收录 45 个模型、14 个 benchmark、15 家公司，均来自发布方原始来源。
- 新增模型时，在 `models/{company}/{model}.yaml` 添加文件；新增 benchmark 时，先在 `metrics.yaml` 中定义。

## 当前已验证通过的项目

- [x] `npm test`：10 个测试全部通过
- [x] `npm run build`：TypeScript 编译与 Vite 构建成功
- [x] `public/model-index.json`：包含 45 个模型、14 个 benchmark、15 家公司
- [x] `dist/` 产物包含 `index.html`、`model-index.json`、JS/CSS 资源
- [x] `master` 分支已推送到 `git@github.com:WhitePlusMS/llm-radar.git`
- [x] `cicd` 分支已推送并触发 GitHub Actions
- [ ] GitHub Pages 启用并重新运行 deploy（待处理）
