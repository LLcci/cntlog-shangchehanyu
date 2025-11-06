---
title: 2025最新vite+Cesium项目配置
image: /Cesium0.jpg
date: 2025-05-15
description: 解决Vite+Cesium项目配置问题，实现地球正常渲染的完整方案。
keywords: Vite,Cesium,项目配置,地球渲染,静态文件配置,vite-plugin-static-copy,CESIUM_BASE_URL,三维地图,前端开发,构建配置
---

当你根据官方文档，尝试创建 Vite + Cesium 时，大部分文章都会推荐你使用`vite-plugin-cesium`这个插件。

但是，你在项目运行后也许会发现，地球无法正常渲染，并提示错误信息：

> `VM138:1 Uncaught (in promise) SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`

<img src="/Cesium1.jpg" style="max-width: 800px; height: auto;" >

## 官方 Blog 提供的方法

我在 Cesium 官网的 Blog 中找到了一个解决方案：[Configuring Vite or Webpack for CesiumJS](https://cesium.com/blog/2024/02/13/configuring-vite-or-webpack-for-cesiumjs/)。

`vite-plugin-cesium`无法生效的原因。我没有去详细调查，如果有大佬知道，欢迎留言告诉我。

Bolg 中提到，要在项目中集成 Cesium，除了包含 npm 包外，还需要做两件事：

1. 包含 Cesium Widgets CSS。
2. 提供 CesiumJS 库中的静态文件访问（这包括预构建的内容以及其他非 JS 资源）。

## 包含 Cesium Widgets CSS

这一步非常简单，只需要在`main.js`中导入`cesium/Widgets/widgets.css`即可。

```js [main.js]
import "cesium/Widgets/widgets.css";
```

## 提供 CesiumJS 库中的静态文件访问

有 4 个目录的静态文件需要包含在你的构建中：

- node_modules/cesium/Build/Cesium/Workers
- node_modules/cesium/Build/Cesium/ThirdParty
- node_modules/cesium/Build/Cesium/Assets
- node_modules/cesium/Build/Cesium/Widgets

在 Vite 中，我们需要使用`viteStaticCopy`这个插件。

```
npm i -D vite-plugin-static-copy
```

然后在`vite.config.js`中配置：

```js [vite.config.js]
import { viteStaticCopy } from 'vite-plugin-static-copy'
const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "cesiumStatic";
// ...
viteStaticCopy({
  targets: [
    { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
    { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
    { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
    { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
  ],
}),
// ...
```

cesiumBaseUrl 可以设置为你构建目录中 CesiumJS 资产文件的任何位置。需要确保将全局变量 window.CESIUM_BASE_URL 设置为此路径，以便 CesiumJS 代码可以访问它需要的文件。

在 Vite 中我们使用 defineConfig 选项的 define 属性：

```js [vite.config.js]
// ...
define: {
  CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl),
},
// ...
```

## 可以正常显示啦

<img src="/Cesium2.jpg" style="max-width: 800px; height: auto;" >
