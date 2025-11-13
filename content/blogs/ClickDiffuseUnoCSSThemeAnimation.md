---
title: 点击即扩散：使用 View Transition API 实现 UnoCSS 官网同款主题切换动画
image: unocss1.gif
date: 2025-10-31
description: 使用View Transition API实现UnoCSS官网同款主题切换动画效果。
keywords: View Transition API,UnoCSS,主题切换,动画效果,前端动画,CSS动画,Vue3,Web API,点击扩散,伪元素动画
---

## unocss 官网有意思的主题切换动画

最近项目里经常使用 unocss，下意识点了下 unocss 官网的主题切换动画，有点意思，搞一下。

<img src="unocss1.gif" alt="unocss 官网主题切换动画" />

## 让我们开始吧

### 快速创建一个 vue 项目

过程略

### 接下来就是关键的 ViewTransition

这是一个在 2025 年 10 月新增的 Web Api。

> 官方的解释是：
>
> [View Transitions API](https://developer.mozilla.org/zh-CN/docs/Web/API/ViewTransition) 的 ViewTransition 接口表示视图过渡，并提供了在过渡到达不同状态时运行代码的功能（例如，准备运行动画，或动画完成），或跳过视图过渡。

简单理解就是，这个 API 可以帮助我们创建两个伪元素，分别代表了过渡前和过渡后的状态。

也就是`::view-transition-old(root)`和`::view-transition-new(root)`。

这里的 root 指的是根元素，也就是 html。

当然你可以通过使用[`view-transition-name`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/view-transition-name)来为指定的元素创建对应的伪元素。

这里不需要这么做，我们需要的是整个页面，有兴趣的话可以尝试一下。

接下来我们就需要用[`startViewTransition`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/startViewTransition)来开始一个新的过渡，并返回一个[`ViewTransition`](https://developer.mozilla.org/zh-CN/docs/Web/API/ViewTransition)对象。

最后我们需要等待伪元素创建完成后，使用[`Element.animate`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animate)为这两个伪元素添加动画。

ok, lets coding。

### code start

使用[The 4 color formula](https://codepen.io/whosajid/pen/GRbXaoB)创建一组主题色，并在`main.css`中定义颜色变量，记得引入`main.css`。

```css [main.css]
:root {
  --color-primary: hsl(191, 50%, 90%);
  --color-secondary: hsl(191, 50%, 10%);
  --color-tertiary: hsl(251, 80%, 20%);
  --color-accent: hsl(131, 80%, 20%);
}

:root[class="dark"] {
  --color-primary: hsl(191, 50%, 10%);
  --color-secondary: hsl(191, 50%, 90%);
  --color-tertiary: hsl(251, 80%, 80%);
  --color-accent: hsl(131, 80%, 80%);
}
```

在`uno.config.ts`中配置主题，并添加`@unocss/transformer-directives`插件，启用`@apply`指令。

```ts [uno.config.ts]
import { defineConfig } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  theme: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      tertiary: "var(--color-tertiary)",
      accent: "var(--color-accent)",
    },
  },
  transformers: [transformerDirectives()],
});
```

为 HTML 设置主题色。

```css [main.css]
html {
  @apply bg-primary text-secondary;
}
```

初始配置结束，接下来为主题色添加过渡动画。

我就在`app.vue`中开始演示，我喜欢使用 [VueUse](https://vueuse.org/) 中的 [`useColorMode`](https://vueuse.org/core/useColorMode/) 来监听主题状态。

```ts [app.vue]
const colorMode = useColorMode();

const nextTheme = computed(() =>
  colorMode.value === "dark" ? "light" : "dark",
);

const switchTheme = () => {
  colorMode.value = nextTheme.value;
};
```

创建一个按钮，点击切换主题，我这里只展示点击方法。

```ts [app.vue]
const handleThemeToggle = (event: MouseEvent) => {
  // 检查浏览器是否支持View Transition API
  if (!document.startViewTransition) {
    switchTheme();
    return;
  }

  startViewTransition(event);
};
```

`startViewTransition`是过渡动画实现的核心方法，让我们一点一点拆解。

首先获得鼠标点击的位置，以及计算点击动画圆形的半径。

```ts [app.vue]
const startViewTransition = (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
};
```

然后使用`document.startViewTransition`开始一个新的过渡，并在回调函数中切换主题。

```ts [app.vue]
const startViewTransition = (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    switchTheme();
  });
};
```

接下来等待过渡创建完成后，使用`Element.animate`为伪元素添加动画，我们先尝试只为`::view-transition-new(root)`添加动画。

```ts [app.vue]
const startViewTransition = (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    switchTheme();
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 600,
        easing: "cubic-bezier(.76,.32,.29,.99)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
};
```

如果你这时直接点击按钮时，会发现圆形动画效果已经出现，但是在圆形动画结束前，主题切换已经完成了。

这是因为`::view-transition-old(root)`和`::view-transition-new(root)`默认具有一个过渡效果，我们需要将其禁用。

```css [main.css]
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
}
```

再试一下，我们会得到这样一个效果。

<img src="unocss2.gif" alt="theme-switch-animation-1" />

已经很接近了，不是么？

接下来我们要考虑的是：

- 由`light`->`dark`的时，保持现在的过渡动画。
- 由`dark`->`light`的时，添加一个反向的过渡动画。

由于`::view-transition-new(root)`默认是在`::view-transition-old(root)`之上显示。

而我们在`dark`->`light`切换时，需要的是为`::view-transition-old(root)`添加动画。

因此，我们需要修改他们的`z-index`属性，让他们在合适的层级上显示。

让我们在`main.css`中定义两个变量，并引用他们。

```css [main.css]
:root {
  --color-primary: hsl(191, 50%, 90%);
  --color-secondary: hsl(191, 50%, 10%);
  --color-tertiary: hsl(251, 80%, 20%);
  --color-accent: hsl(131, 80%, 20%);
  --view-transition-old-zindex: 9999;
  --view-transition-new-zindex: 1;
}

:root[class="dark"] {
  --color-primary: hsl(191, 50%, 10%);
  --color-secondary: hsl(191, 50%, 90%);
  --color-tertiary: hsl(251, 80%, 80%);
  --color-accent: hsl(131, 80%, 80%);
  --view-transition-old-zindex: 1;
  --view-transition-new-zindex: 9999;
}

::view-transition-old(root) {
  z-index: var(--view-transition-old-zindex);
}
::view-transition-new(root) {
  z-index: var(--view-transition-new-zindex);
}
```

接下来让我们修改`startViewTransition`方法，根据当前主题状态，为不同的伪元素添加动画。

```ts [app.vue]
const startViewTransition = (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    switchTheme();
  });

  transition.ready.then(() => {
    const isDark = colorMode.value === "dark";
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark ? clipPath : clipPath.reverse(),
      },
      {
        duration: 600,
        easing: "cubic-bezier(.76,.32,.29,.99)",
        pseudoElement: isDark
          ? "::view-transition-new(root)"
          : "::view-transition-old(root)",
      },
    );
  });
};
```

大功告成！

<img src="unocss3.gif" alt="theme-switch-animation-2" />

## 完整代码如下

```css [main.css]
:root {
  --color-primary: hsl(191, 50%, 90%);
  --color-secondary: hsl(191, 50%, 10%);
  --color-tertiary: hsl(251, 80%, 20%);
  --color-accent: hsl(131, 80%, 20%);
  --view-transition-old-zindex: 9999;
  --view-transition-new-zindex: 1;
}

:root[class="dark"] {
  --color-primary: hsl(191, 50%, 10%);
  --color-secondary: hsl(191, 50%, 90%);
  --color-tertiary: hsl(251, 80%, 80%);
  --color-accent: hsl(131, 80%, 80%);
  --view-transition-old-zindex: 1;
  --view-transition-new-zindex: 9999;
}

html {
  @apply bg-primary text-secondary;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
}

::view-transition-old(root) {
  z-index: var(--view-transition-old-zindex);
}
::view-transition-new(root) {
  z-index: var(--view-transition-new-zindex);
}
```

```ts [app.vue]
const colorMode = useColorMode();
const nextTheme = computed(() =>
  colorMode.value === "dark" ? "light" : "dark",
);

const switchTheme = () => {
  colorMode.value = nextTheme.value;
};

const handleThemeToggle = (event: MouseEvent) => {
  // 检查浏览器是否支持View Transition API
  if (!document.startViewTransition) {
    switchTheme();
    return;
  }

  startViewTransition(event);
};

const startViewTransition = (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    switchTheme();
  });

  transition.ready.then(() => {
    const isDark = colorMode.value === "dark";
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark ? clipPath : clipPath.reverse(),
      },
      {
        duration: 600,
        easing: "cubic-bezier(.76,.32,.29,.99)",
        pseudoElement: isDark
          ? "::view-transition-new(root)"
          : "::view-transition-old(root)",
      },
    );
  });
};
```

## 到最后啦

你觉得这个效果怎么样，有没有什么更新奇的想法，欢迎在评论区分享！
