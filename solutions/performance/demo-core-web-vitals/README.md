# Web Vitals Demo 项目

这是一个使用 Vite + React + TypeScript 创建的 Web Vitals 演示项目，展示了如何使用 Google 的 `web-vitals` 库来测量核心网页性能指标。

## 🚀 快速开始

```bash
# 1. 安装依赖
yarn

# 2. 启动开发服务器
yarn dev

# 3. 在浏览器中访问 http://localhost:5173
```

## 📊 支持的性能指标

该演示项目监控以下 **2025 年推荐的** Core Web Vitals 指标：

| 指标 | 全称 | 说明 | 评分标准 |
|------|------|------|----------|
| **FCP** | First Contentful Paint | 首次内容绘制 | <1.8s 🟢 / <3.0s 🟡 / >3.0s 🔴 |
| **LCP** | Largest Contentful Paint | 最大内容绘制 | <2.5s 🟢 / <4.0s 🟡 / >4.0s 🔴 |
| **CLS** | Cumulative Layout Shift | 累积布局偏移 | <0.1 🟢 / <0.25 🟡 / >0.25 🔴 |
| **TTFB** | Time to First Byte | 首字节时间 | <800ms 🟢 / <1800ms 🟡 / >1800ms 🔴 |
| **INP** | Interaction to Next Paint | 交互到下次绘制 🔥 | <200ms 🟢 / <500ms 🟡 / >500ms 🔴 |

> **重要更新**: 
> - ✅ **INP** 是替代 FID 的新指标，更能反映页面的整体交互响应性
> - ❌ **FID** (First Input Delay) 已被 Google 标记为废弃，将在下个主要版本中移除
> - 🔄 **API 更新**: web-vitals v3 使用 `onXXX()` 函数替代了 `getXXX()` 函数

## 🎯 功能特性

- ✅ **实时监控**: 页面加载时自动开始监控各项指标
- ✅ **交互式测试**: 提供按钮来触发不同类型的性能事件
- ✅ **可视化展示**: 用颜色编码直观显示每个指标的表现
- ✅ **详细说明**: 每个指标都有中文说明和评分标准
- ✅ **控制台日志**: 在开发者工具中查看详细的指标数据

## 📝 使用说明

1. **查看实时指标**: 页面加载后会自动开始收集性能指标
2. **测试 LCP**: 点击"显示大内容"按钮观察 LCP 变化
3. **测试 FID/INP**: 点击"点击测试"按钮测试交互响应性能
4. **查看详细日志**: 打开浏览器开发者工具的 Console 面板
5. **测试 CLS**: 尝试滚动页面、调整窗口大小等操作

## 🛠️ 技术栈

- **Vite**: 快速构建工具
- **React 19**: 最新 UI 框架
- **TypeScript**: 类型安全
- **web-vitals**: Google 官方性能测量库

## 💡 性能测试建议

为了获得更准确的性能数据：
- 使用无痕模式浏览器
- 关闭浏览器扩展
- 在不同网络条件下测试
- 使用 Chrome DevTools 的 Performance 面板进行深入分析

## 🏗️ 构建和部署

```bash
# 构建生产版本
yarn build

# 预览构建结果
yarn preview
```

## 📚 相关资源

- [Web Vitals 官方文档](https://web.dev/vitals/)
- [web-vitals GitHub 仓库](https://github.com/GoogleChrome/web-vitals)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
