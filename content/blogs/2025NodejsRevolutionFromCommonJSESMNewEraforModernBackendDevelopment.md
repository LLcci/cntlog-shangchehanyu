---
title: 2025 年 Node.js 革命：从 CommonJS 到 ESM，现代后端开发的新纪元
image: /nodejs.jpg
date: 2025-08-08
description: 探讨2025年Node.js从CommonJS到ESM的演进及现代后端开发新特性。
keywords: Node.js,ESM模块,CommonJS,现代后端开发,Web API集成,内置测试,工作线程,异步模式,流处理,安全监控
---

> 原文链接：[https://kashw1n.com/blog/nodejs-2025/](https://kashw1n.com/blog/nodejs-2025/)

自早期以来，Node.js 经历了显著的变革。如果你从事 Node.js 开发已有数年，你很可能亲眼目睹了这一演变过程——从充斥着回调函数、以 CommonJS 为主导的局面，发展到如今简洁、基于标准的开发体验。

这些变化不仅仅是表面上的；它们代表了我们处理服务器端 JavaScript 开发方式的根本性转变。现代的 Node.js 采用了网络标准，减少了外部依赖，并提供了更直观的开发者体验。让我们来探讨这些变革，了解为什么它们对您在 2025 年的应用程序至关重要。

## 1. 模块系统：ESM 成为新标准

模块系统可能是你会注意到最大差异的地方。CommonJS 曾经很好地为我们服务，但 ES 模块（ESM）已成为明显的赢家，它提供了更好的工具支持，并与网络标准保持一致。

### 旧方式（CommonJS）

让我们看看过去是如何组织模块结构的。这种方法需要显式导出和同步导入：

```js
// math.js
function add(a, b) {
  return a + b;
}
module.exports = { add };

// app.js
const { add } = require("./math");
console.log(add(2, 3));
```

这运行良好，但它有局限性——无法进行静态分析，无法进行摇树优化，并且与浏览器标准不一致。

### 现代方式（Node 中的 ES 模块：前缀）

现代的 Node.js 开发采用 ES 模块，并增加了一个关键特性——为内置模块添加`node:`前缀。这种明确的命名方式避免了混淆，使依赖关系一目了然：

```js
// math.js
export function add(a, b) {
  return a + b;
}

// app.js
import { add } from "./math.js";
import { readFile } from "node:fs/promises"; // 现代的node:前缀
import { createServer } from "node:http";

console.log(add(2, 3));
```

`node:`前缀不仅仅是一种约定，它还向开发者和工具明确表明，你导入的是 Node.js 内置模块，而非 npm 包。这可以避免潜在的冲突，并使你的代码对其依赖关系更加明确。

### 顶级等待：简化初始化

最具变革性的特性之一是顶级`await`。无需再为了在模块级别使用`await`而将整个应用程序包装在一个异步函数中：

```js
// app.js - 无包装函数的简洁初始化
import { readFile } from "node:fs/promises";

const config = JSON.parse(await readFile("config.json", "utf8"));
const server = createServer(/* ... */);

console.log("应用程序使用配置启动:", config.appName);
```

这消除了我们曾经随处可见的立即调用异步函数表达式（IIFE）这一常见模式。你的代码变得更加线性，也更容易理解。

## 2. 内置 Web API：减少外部依赖

Node.js 大力采用了 web 标准，将 web 开发者已经熟悉的 API 直接引入到运行时。这意味着依赖更少，跨环境的一致性更高。

### Fetch API：无需再依赖 HTTP 库

还记得曾经每个项目都需要使用 axios、node-fetch 或类似的库来进行 HTTP 请求吗？那些日子已经过去了。Node.js 现在原生支持 Fetch API：

```js
// 旧方法 - 需要外部依赖
const axios = require("axios");
const response = await axios.get("https://api.example.com/data");

// 现代方法 - 具有增强功能的内置fetch
const response = await fetch("https://api.example.com/data");
const data = await response.json();
```

但现代方法不仅仅是替换你的 HTTP 库。它还内置了完善的超时和取消支持：

```js
async function fetchData(url) {
  try {
    // 内置的超时支持
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error("请求超时");
    }
    throw error;
  }
}
```

这种方法无需使用超时库，并提供了一致的错误处理体验。`AbortSignal.timeout()`方法特别巧妙——它会创建一个信号，在指定时间后自动中止。

### 中止控制器：优雅地取消操作

现代应用程序需要优雅地处理取消操作，无论是用户发起的还是由于超时而导致的。`AbortController`提供了一种标准化的方式来取消操作：

```js
// 干净利落地取消长时间运行的操作
const controller = new AbortController();

// 设置自动取消
setTimeout(() => controller.abort(), 10000);

try {
  const data = await fetch("https://slow-api.com/data", {
    signal: controller.signal,
  });
  console.log("收到数据:", data);
} catch (error) {
  if (error.name === "AbortError") {
    console.log("请求已取消 - 这是预期行为");
  } else {
    console.error("意外错误:", error);
  }
}
```

这种模式适用于许多 Node.js API，不仅仅是 fetch。你可以在文件操作、数据库查询以及任何支持取消的异步操作中使用相同的 AbortController。

## 3. 内置测试：无需外部依赖的专业测试

过去，进行测试需要在 Jest、Mocha、Ava 或其他框架之间做出选择。如今，Node.js 包含了一个功能完备的测试运行器，无需任何外部依赖即可满足大多数测试需求。

### 使用 Node.js 内置测试运行器进行现代测试

内置的测试运行器提供了一个简洁、熟悉的 API，给人一种现代且完备的感觉：

```js
// test/math.test.js
import { test, describe } from "node:test";
import assert from "node:assert";
import { add, multiply } from "../math.js";

describe("Math functions", () => {
  test("adds numbers correctly", () => {
    assert.strictEqual(add(2, 3), 5);
  });

  test("handles async operations", async () => {
    const result = await multiply(2, 3);
    assert.strictEqual(result, 6);
  });

  test("throws on invalid input", () => {
    assert.throws(() => add("a", "b"), /Invalid input/);
  });
});
```

使其特别强大的是它与 Node.js 开发工作流程的无缝集成方式：

```js
# 使用内置运行器运行所有测试
node --test

# 开发时的监听模式
node --test --watch

# 覆盖率报告（Node.js 20+）
node --test --experimental-test-coverage
```

监视模式在开发过程中特别有用——当你修改代码时，测试会自动重新运行，无需任何额外配置即可立即提供反馈。

## 4. 复杂的异步模式

虽然异步/等待（async/await）并不是新特性，但围绕它的模式已经显著成熟。现代 Node.js 开发更有效地利用了这些模式，并将它们与更新的 API 结合起来。

### 异步/等待与增强的错误处理

现代错误处理将异步/等待与复杂的错误恢复和并行执行模式相结合：

```js
import { readFile, writeFile } from "node:fs/promises";

async function processData() {
  try {
    // 并行执行独立操作
    const [config, userData] = await Promise.all([
      readFile("config.json", "utf8"),
      fetch("/api/user").then((r) => r.json()),
    ]);

    const processed = processUserData(userData, JSON.parse(config));
    await writeFile("output.json", JSON.stringify(processed, null, 2));

    return processed;
  } catch (error) {
    // 带上下文的结构化错误日志记录
    console.error("处理失败:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
```

这种模式将并行执行以提升性能与全面的错误处理相结合。`Promise.all()`确保独立的操作并发运行，而 try/catch 则提供了一个具有丰富上下文的单一错误处理点。

### 使用异步迭代器进行现代事件处理

事件驱动编程已经超越了简单的事件监听器。异步迭代器提供了一种更强大的方式来处理事件流：

```js
import { EventEmitter, once } from "node:events";

class DataProcessor extends EventEmitter {
  async *processStream() {
    for (let i = 0; i < 10; i++) {
      this.emit("data", `chunk-${i}`);
      yield `processed-${i}`;
      // 模拟异步处理时间
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.emit("end");
  }
}

// 以异步迭代器的方式消费事件
const processor = new DataProcessor();
for await (const result of processor.processStream()) {
  console.log("Processed:", result);
}
```

这种方法特别强大，因为它将事件的灵活性与异步迭代的控制流结合了起来。你可以按顺序处理事件，自然地处理背压，并干净利落地跳出处理循环。

## 5. 与 Web 标准集成的高级流

流仍然是 Node.js 最强大的功能之一，但它们已经发展为接受 Web 标准并提供更好的互操作性。

### 现代流处理

随着更好的 API 和更清晰的模式，流处理变得更加直观：

```js
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";

// 使用简洁、专注的逻辑创建转换流
const upperCaseTransform = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

// 使用强大的错误处理机制处理文件
async function processFile(inputFile, outputFile) {
  try {
    await pipeline(
      createReadStream(inputFile),
      upperCaseTransform,
      createWriteStream(outputFile)
    );
    console.log("文件处理成功");
  } catch (error) {
    console.error("管道失败:", error);
    throw error;
  }
}
```

使用 Promise 的`pipeline`函数提供了自动清理和错误处理功能，消除了流处理中许多传统的痛点。

### Web 流互操作性

现代的 Node.js 可以与 Web 流无缝协作，从而与浏览器代码和边缘运行时环境实现更好的兼容性：

```js
// 创建一个网络流（与浏览器兼容）
const webReadable = new ReadableStream({
  start(controller) {
    controller.enqueue("Hello ");
    controller.enqueue("World!");
    controller.close();
  },
});

// 在网络流和Node.js流之间进行转换
const nodeStream = Readable.fromWeb(webReadable);
const backToWeb = Readable.toWeb(nodeStream);
```

这种互操作性对于需要在多种环境中运行或在服务器与客户端之间共享代码的应用程序至关重要。

## 6. 工作线程：适用于 CPU 密集型任务的真正并行处理

JavaScript 的单线程特性对于 CPU 密集型任务并不总是理想的。工作线程提供了一种在保持 JavaScript 简单性的同时有效利用多核的方法。

### 无阻塞的后台处理

工作线程非常适合执行那些计算成本高昂、否则会阻塞主事件循环的任务：

```js
// worker.js - 隔离的计算环境
import { parentPort, workerData } from "node:worker_threads";

function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.number);
parentPort.postMessage(result);
```

主应用程序可以在不阻塞其他操作的情况下委托繁重的计算任务：

```js
// main.js - 非阻塞委托
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";

async function calculateFibonacci(number) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      fileURLToPath(new URL("./worker.js", import.meta.url)),
      { workerData: { number } }
    );

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// 你的主应用程序保持响应
console.log("Starting calculation...");
const result = await calculateFibonacci(40);
console.log("Fibonacci result:", result);
console.log("Application remained responsive throughout!");
```

这种模式使你的应用程序能够利用多个 CPU 核心，同时保持熟悉的 async/await 编程模型。

## 7. 增强的开发体验

现代的 Node.js 通过内置工具来优先考虑开发者体验，这些工具以前需要外部包或复杂的配置。

### 监视模式与环境管理

借助内置的监视模式和环境文件支持，开发工作流程已大幅简化：

```js
{
  "name": "现代节点应用",
  "type": "模块",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "node --watch --env-file=.env app.js",
    "test": "node --test --watch",
    "start": "node app.js"
  }
}
```

`--watch`标志消除了对 nodemon 的需求，而`--env-file`标志则消除了对 dotenv 的依赖。这样一来，您的开发环境变得更加简单和快速：

```js
// 使用--env-file可自动加载.env文件
// DATABASE_URL=postgres://localhost:5432/mydb
// API_KEY=secret123

// app.js - 环境变量可立即使用
console.log("正在连接到:", process.env.DATABASE_URL);
console.log("API密钥已加载:", process.env.API_KEY ? "是" : "否");
```

这些特性通过减少配置开销并消除重启周期，让开发过程更加轻松愉快。

## 8. 现代安全与性能监控

安全性和性能已成为首要关注点，通过内置工具来监控和控制应用程序行为。

### 增强安全性的权限模型

实验性权限模型允许你按照最小权限原则，限制应用程序的可访问范围：

```js
# 使用受限的文件系统访问运行
node --experimental-permission --allow-fs-read=./data --allow-fs-write=./logs app.js

# 网络限制
node --experimental-permission --allow-net=api.example.com app.js
# 上述allow-net功能目前尚未可用，相关拉取请求已合并到node.js代码仓库，将在未来版本中提供
```

这对于处理不可信代码或需要证明符合安全要求的应用程序来说尤其有价值。

### 内置性能监测

现在，平台已内置性能监控功能，无需使用外部应用性能监控（APM）工具进行基础监控：

```js
import { PerformanceObserver, performance } from "node:perf_hooks";

// 设置自动性能监测
const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 100) {
      // 记录缓慢的操作
      console.log(`检测到缓慢操作: ${entry.name} 耗时 ${entry.duration}ms`);
    }
  }
});
obs.observe({ entryTypes: ["function", "http", "dns"] });

// 检测你自己的操作
async function processLargeDataset(data) {
  performance.mark("processing-start");

  const result = await heavyProcessing(data);

  performance.mark("processing-end");
  performance.measure("data-processing", "processing-start", "processing-end");

  return result;
}
```

这无需外部依赖即可实现应用程序性能的可视化，帮助您在开发早期识别瓶颈。

## 9. 应用程序分发与部署

现代的 Node.js 通过诸如单可执行应用程序和改进的打包等功能，使应用程序分发变得更加简单。

### 单可执行文件应用程序

现在，你可以将 Node.js 应用程序打包成单个可执行文件，从而简化部署和分发流程：

```js
# 创建一个自包含的可执行文件
node --experimental-sea-config sea-config.json
```

配置文件定义了应用程序的打包方式：

```js
{
  "main": "app.js",
  "output": "my-app-bundle.blob",
  "disableExperimentalSEAWarning": true
}
```

这对于命令行界面（CLI）工具、桌面应用程序，或者任何你希望在无需用户单独安装 Node.js 的情况下分发应用程序的场景而言，都特别有价值。

## 10. 现代错误处理与诊断

错误处理已不再局限于简单的 try/catch 块，而是涵盖了结构化错误处理和全面的诊断功能。

### 结构化错误处理

现代应用程序借助结构化、带上下文的错误处理，能提供更丰富的调试信息：

```javascript
class AppError extends Error {
  constructor(message, code, statusCode = 500, context = {}) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

// 带有丰富上下文的使用示例
throw new AppError("数据库连接失败", "DB_CONNECTION_ERROR", 503, {
  host: "localhost",
  port: 5432,
  retryAttempt: 3,
});
```

这种方式在为调试和监控提供更丰富错误信息的同时，还能在整个应用中维持一致的错误接口。

### 高级诊断功能

Node.js 具备完善的诊断能力，可帮助你了解应用程序内部的运行情况：

```javascript
import diagnostics_channel from "node:diagnostics_channel";

// 创建自定义诊断通道
const dbChannel = diagnostics_channel.channel("app:database");
const httpChannel = diagnostics_channel.channel("app:http");

// 订阅诊断事件
dbChannel.subscribe((message) => {
  console.log("数据库操作：", {
    operation: message.operation,
    duration: message.duration,
    query: message.query,
  });
});

// 发布诊断信息
async function queryDatabase(sql, params) {
  const start = performance.now();

  try {
    const result = await db.query(sql, params);

    dbChannel.publish({
      operation: "query",
      sql,
      params,
      duration: performance.now() - start,
      success: true,
    });

    return result;
  } catch (error) {
    dbChannel.publish({
      operation: "query",
      sql,
      params,
      duration: performance.now() - start,
      success: false,
      error: error.message,
    });
    throw error;
  }
}
```

这些诊断信息可被监控工具获取、记录下来用于分析，或用于触发自动修复操作。

## 11. 现代包管理与模块解析

包管理和模块解析已变得更加复杂，对单体仓库、内部包和灵活的模块解析提供了更好的支持。

### 导入映射与内部包解析

现代 Node.js 支持导入映射，让你能够创建清晰的内部模块引用：

```json
{
  "imports": {
    "#config": "./src/config/index.js",
    "#utils/*": "./src/utils/*.js",
    "#db": "./src/database/connection.js"
  }
}
```

这为内部模块创建了清晰、稳定的接口：

```javascript
// 清晰的内部导入，在重构代码结构时不会失效
import config from "#config";
import { logger, validator } from "#utils/common";
import db from "#db";
```

这些内部导入让重构工作更轻松，还能清晰区分内部依赖和外部依赖。

### 动态导入实现灵活加载

动态导入支持复杂的加载模式，包括条件加载和代码拆分：

```javascript
// 根据配置或环境加载功能模块
async function loadDatabaseAdapter() {
  const dbType = process.env.DATABASE_TYPE || "sqlite";

  try {
    const adapter = await import(`#db/adapters/${dbType}`);
    return adapter.default;
  } catch (error) {
    console.warn(`数据库适配器 ${dbType} 不可用，将回退到 sqlite`);
    const fallback = await import("#db/adapters/sqlite");
    return fallback.default;
  }
}

// 条件加载可选功能
async function loadOptionalFeatures() {
  const features = [];

  if (process.env.ENABLE_ANALYTICS === "true") {
    const analytics = await import("#features/analytics");
    features.push(analytics.default);
  }

  if (process.env.ENABLE_MONITORING === "true") {
    const monitoring = await import("#features/monitoring");
    features.push(monitoring.default);
  }

  return features;
}
```

这种模式能让你构建出可适应环境的应用程序，只加载实际需要的代码。

## 前进之路：2025 年现代 Node.js 的关键要点

审视当前 Node.js 开发的现状，可总结出几个关键原则：

- **拥抱 Web 标准**：使用 node: 前缀、fetch API、AbortController 和 Web 流，以获得更好的兼容性并减少依赖
- **充分利用内置工具**：测试运行器、监视模式和环境文件支持，减少了外部依赖和配置复杂性
- **采用现代异步模式**：顶级 await、结构化错误处理和异步迭代器让代码更易读、更易维护
- **合理使用工作线程**：对于 CPU 密集型任务，工作线程能提供真正的并行处理，且不会阻塞主线程
- **采用渐进式增强**：使用权限模型、诊断通道和性能监控，构建健壮、可观测的应用程序
- **优化开发者体验**：监视模式、内置测试和导入映射带来更愉悦的开发流程
- **规划分发方式**：单可执行文件应用程序和现代打包方式简化了部署流程

Node.js 从一个简单的 JavaScript 运行时转变为全面的开发平台，这一变化令人瞩目。通过采用这些现代模式，你不仅能编写符合时代潮流的代码，还能构建出更易维护、性能更优且与更广泛的 JavaScript 生态系统相契合的应用程序。

现代 Node.js 的魅力在于它在不断演进的同时保持了向后兼容性。你可以逐步采用这些模式，它们能与现有代码协同工作。无论你是启动一个新项目，还是对现有项目进行现代化改造，这些模式都为更稳健、更愉悦的 Node.js 开发提供了清晰的路径。

随着 2025 年的推进，Node.js 仍在持续发展，但我们在此探讨的这些基础模式，为构建在未来数年都能保持现代化和可维护性的应用程序奠定了坚实基础。
