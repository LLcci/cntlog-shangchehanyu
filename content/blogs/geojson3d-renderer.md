---
title: geojson-3d-renderer：从原理到实践，打造高性能3D地理可视化库
image: geojson-3d-renderer.jpg
date: 2025-11-25
description: 基于Three.js + Vue的3D GeoJSON可视化库，支持墨卡托投影和性能优化
keywords: geojson-3d-renderer, GeoJSON, Three.js, TresJS
---

## geojson-3d-renderer: 3D GeoJSON 可视化

geojson-3d-renderer 是我制作的一个功能强大的 3D GeoJSON 可视化库，兼容 Three.js、Vue.js + Three.js 和 TresJS 环境。提供 Vue 组件、钩子和工具函数，用于在 3D 空间中渲染 GeoJSON 数据，并支持自定义材质。

[演示示例](https://llcci.github.io/geojson-3d-renderer-demo/)

[中文文档](https://github.com/LLcci/geojson-3d-renderer/blob/main/README_CN.md)

[Github](https://github.com/LLcci/geojson-3d-renderer)

- 🗺️ 基于墨卡托投影的 3D GeoJSON 可视化
- 🎨 可自定义材质的几何体生成（形状和线条）
- ⚡ Vue 3 Composition API 支持
- 📦 支持 Tree-shaking，轻量级
- 🔧 TypeScript 支持

## 用法

### 安装

```bash
npm install geojson-3d-renderer
# 或
yarn add geojson-3d-renderer
# 或
pnpm add geojson-3d-renderer
```

### Vue 组件

> 需要在 Vue.js、Three.js 和 TresJS 环境中使用

```vue
<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[0, 0, 50]" />
    <OrbitControls />
    <GeoJson
      url="https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json"
      :mercator-center="[104.0, 37.5]"
      :options="{
        mercatorScale: 30,
        extrudeDepth: 1,
        lineOffset: 0.01,
      }"
    />
  </TresCanvas>
</template>

<script setup>
import { TresCanvas, TresPerspectiveCamera } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { GeoJson } from 'geojson-3d-renderer'
</script>
```

### Composition API

> 需要在 Vue.js、Three.js 环境中使用

```vue
<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[0, 0, 50]" />
    <OrbitControls />
    <TresGroup>
      <TresMesh v-if="shapeGeometry" :geometry="shapeGeometry">
        <TresMeshBasicMaterial color="#409EFF" />
      </TresMesh>
      <TresLineSegments v-if="lineGeometry" :geometry="lineGeometry">
        <TresLineBasicMaterial color="#000000" />
      </TresLineSegments>
    </TresGroup>
  </TresCanvas>
</template>

<script setup>
import {
  TresCanvas,
  TresPerspectiveCamera,
  TresGroup,
  TresMesh,
  TresLineSegments,
} from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { useGeojson } from 'geojson-3d-renderer'

const { mergedShapeGeometry: shapeGeometry, mergedLineGeometry: lineGeometry } = useGeojson(
  'https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json',
  [104.0, 37.5],
  {
    mercatorScale: 30,
    extrudeDepth: 1,
    lineOffset: 0.01,
  }
)
</script>
```

### 工具函数 (Utility Function)

> 需要在 Three.js 环境中使用

```ts
import { genGeojsonGeometry } from 'geojson-3d-renderer/utils'

const { mergedShapeGeometry, mergedLineGeometry } = await genGeojsonGeometry(
  'https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json',
  [104.0, 37.5],
  {
    mercatorScale: 30,
    extrudeDepth: 1,
    lineOffset: 0.01,
  }
)
```

## 原理解析

### 整体架构设计

`genGeojsonGeometry.ts` 是整个库的核心模块，负责将 GeoJSON 数据转换为 Three.js 可渲染的几何体。其整体架构设计遵循了职责分离原则：

```text
// 模块职责划分
genGeojsonGeometry()
├── 数据加载 (d3.json)
├── 投影转换 (d3.geoMercator)
├── 几何体生成
│   ├── 填充几何体 (ExtrudeGeometry)
│   └── 线段几何体 (BufferGeometry)
└── 几何体合并 (BufferGeometryUtils)
```

下面主要介绍几何体的生成与合并

### Three.js 几何体构建

#### 填充几何体生成

填充几何体使用 Three.js 的 ExtrudeGeometry 实现：

```ts
const createGeometryFromPolygon = (polygon: number[][], projection: GeoProjection) => {
  const shape = new Shape()
  let firstPoint = true

  polygon.forEach((coord) => {
    const [x, y] = projection(coord as [number, number]) || [0, 0]
    if (firstPoint) {
      shape.moveTo(x, -y)  // 注意：Y 坐标取反，适应 Three.js 坐标系
      firstPoint = false
    } else {
      shape.lineTo(x, -y)
    }
  })

  const extrudeSettings = {
    depth: mergedOptions.extrudeDepth,  // 挤出深度
    bevelEnabled: false,               // 禁用斜面
  }

  return new ExtrudeGeometry(shape, extrudeSettings)
}
```

#### 线段几何体生成

线段几何体使用 Three.js 的 BufferGeometry 实现：

```ts
const createLineSegmentsFromPolygon = (polygon: number[][], projection: GeoProjection) => {
  const n = polygon.length
  if (n < 2) return new BufferGeometry()
  
  // 使用 TypedArray 优化性能
  const vertexCount = n * 2
  const positions = new Float32Array(vertexCount * 3)
  let ptr = 0
  
  for (let i = 0; i < n; i++) {
    const a = polygon[i] as [number, number]
    const b = polygon[(i + 1) % n] as [number, number]
    const [ax, ay] = projection(a) || [0, 0]
    const [bx, by] = projection(b) || [0, 0]
    
    // 线段起点
    positions[ptr++] = ax
    positions[ptr++] = -ay
    positions[ptr++] = lineZPosition  // Z 轴偏移

    // 线段终点  
    positions[ptr++] = bx
    positions[ptr++] = -by
    positions[ptr++] = lineZPosition
  }
  
  const lineGeometry = new BufferGeometry()
  lineGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return lineGeometry
}
```

### 几何体合并优化

为了提高渲染性能，库使用 `BufferGeometryUtils.mergeGeometries` 进行几何体合并：

```ts
if (mergedOptions.needShapeGeometry) {
  mergedShapeGeometry = BufferGeometryUtils.mergeGeometries(shapeGeometryList)
  mergedShapeGeometry.computeBoundingSphere()
}

if (mergedOptions.needLineGeometry) {
  mergedLineGeometry = BufferGeometryUtils.mergeGeometries(lineGeometryList)
  mergedLineGeometry.computeBoundingSphere()
}
```

## 结束啦

这就是我做的一个将geojson渲染为3d的包啦

如果你有更好的方法或者建议，欢迎在下面留言，或者在 GitHub 提 issues

掰掰啦~~~
