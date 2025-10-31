<template>
  <UApp>
    <div class="w-screen h-screen fixed top-0 left-0 -z-1">
      <LiquidEther
        :colors="[
          'hsl(165, 80%, 80%)',
          'hsl(160, 80%, 80%)',
          'hsl(155, 80%, 80%)',
        ]"
        :mouse-force="20"
        :cursor-size="100"
        :is-viscous="false"
        :viscous="30"
        :iterations-viscous="32"
        :iterations-poisson="32"
        :resolution="0.5"
        :is-bounce="false"
        :auto-demo="true"
        :auto-speed="0.5"
        :auto-intensity="2.2"
        :takeover-duration="0.25"
        :auto-resume-delay="500"
        :auto-ramp-duration="0.6"
      />
    </div>
    <UNavigationMenu :items="items" />
    <button @click="handleThemeToggle">切换主题</button>
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const nextTheme = computed(() =>
  colorMode.value === "dark" ? "light" : "dark"
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

const items = ref([]);
</script>
