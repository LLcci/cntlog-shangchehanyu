<template>
  <div class="lg:flex hidden w-full justify-center items-center">
    <div
      class="w-150 border border-accent flex justify-center items-center rounded-full shadow-xl/30 shadow-accent mt-8"
    >
      <UNavigationMenu :items="lgItems" color="secondary" />
      <USwitch
        :model-value="isDark"
        unchecked-icon="i-lucide-sun-medium"
        checked-icon="i-lucide-moon"
        color="secondary"
        @click="handleThemeToggle"
      />
    </div>
  </div>
  <UHeader class="lg:hidden" mode="slideover">
    <template #title>
      <img
        class="ml-8 w-10 h-10 rounded-full"
        src="~/assets/images/avatar.svg"
        alt=""
      />
    </template>
    <template #right>
      <UButton
        v-if="isDark"
        icon="i-lucide-sun-medium"
        size="md"
        color="secondary"
        variant="link"
        @click="handleThemeToggle"
      />
      <UButton
        v-else
        icon="i-lucide-moon"
        size="md"
        color="secondary"
        variant="link"
        @click="handleThemeToggle"
      />
      <UNavigationMenu :items="items" color="secondary" />
    </template>
    <template #body>
      <UNavigationMenu
        :items="lgItems"
        color="secondary"
        orientation="vertical"
      />
    </template>
  </UHeader>
</template>
<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed(() => colorMode.preference === "dark");

const nextTheme = computed(() =>
  colorMode.value === "dark" ? "light" : "dark"
);

const switchTheme = () => {
  colorMode.preference = nextTheme.value;
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
    Math.max(y, window.innerHeight - y)
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
      }
    );
  });
};

const lgItems = ref([
  {
    label: "首页",
    icon: "i-lucide-home",
    to: "/",
  },
  {
    label: "博客",
    icon: "i-lucide-book-text",
    to: "/blogs",
  },
  {
    label: "思绪",
    icon: "i-lucide-notebook-pen",
    to: "/thoughts",
  },
  {
    label: "项目集",
    icon: "i-lucide-projector",
    to: "/projects",
  },
  {
    label: "Github",
    icon: "i-lucide-github",
    to: "https://github.com/LLcci",
    target: "_blank",
  },
  {
    label: "Gitee",
    icon: "i-custom-gitee",
    to: "https://gitee.com/shangchehanyu_admin",
    target: "_blank",
  },
]);

const items = ref([
  {
    icon: "i-lucide-github",
    to: "https://github.com/LLcci",
    target: "_blank",
  },
  {
    icon: "i-custom-gitee",
    to: "https://gitee.com/shangchehanyu_admin",
    target: "_blank",
  },
]);
</script>
<style scoped></style>
