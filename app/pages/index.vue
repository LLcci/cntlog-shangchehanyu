<template>
  <div class="size-fit mt-16 m-auto">
    <Magnet :padding="30" :magnet-strength="25">
      <div class="flex">
        <div class="w-3xs">
          <div class="relative h-94 animate__animated animate__fadeInLeft">
            <div
              class="absolute w-full top-0 left-0 h-94 bg-[url('~/assets/images/profile_bg.jpg')] rounded-4xl bg-cover bg-center"
            >
              <div
                class="w-full h-full bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-4xl"
              />
            </div>
            <div
              class="absolute w-full top-0 left-0 h-94 border border-accent rounded-4xl p-4 shadow-2xl shadow-accent flex flex-col items-center justify-center"
            >
              <img
                class="w-24 h-24 rounded-full"
                src="~/assets/images/avatar.svg"
              />
              <div class="text-lg font-bold mt-2">上车函予</div>
              <div class="flex items-center mt-2">
                <UIcon name="i-lucide-mail" />
                <div class="text-sm">: 374166002@qq.com</div>
              </div>
              <div class="mt-2">
                <template v-if="!isDark">
                  <UBadge
                    icon="i-lucide-blocks"
                    size="md"
                    color="primary"
                    variant="subtle"
                    >架构</UBadge
                  >
                  <UBadge
                    class="ml-2"
                    icon="i-lucide-rocket"
                    size="md"
                    color="primary"
                    variant="subtle"
                    >全栈</UBadge
                  >
                  <br />
                  <UBadge
                    class="mt-2"
                    icon="i-lucide-disc-3"
                    size="md"
                    color="primary"
                    variant="subtle"
                    >动画</UBadge
                  >
                  <UBadge
                    class="mt-2 ml-2"
                    icon="i-lucide-boxes"
                    size="md"
                    color="primary"
                    variant="subtle"
                    >3D</UBadge
                  >
                </template>
                <template v-else>
                  <UBadge
                    icon="i-lucide-blocks"
                    size="md"
                    color="secondary"
                    variant="solid"
                    >架构</UBadge
                  >
                  <UBadge
                    class="ml-2"
                    icon="i-lucide-rocket"
                    size="md"
                    color="secondary"
                    variant="solid"
                    >全栈</UBadge
                  >
                  <br />
                  <UBadge
                    class="mt-2"
                    icon="i-lucide-disc-3"
                    size="md"
                    color="secondary"
                    variant="solid"
                    >动画</UBadge
                  >
                  <UBadge
                    class="mt-2 ml-2"
                    icon="i-lucide-boxes"
                    size="md"
                    color="secondary"
                    variant="solid"
                    >3D</UBadge
                  >
                </template>
              </div>
            </div>
          </div>
          <div
            class="flex items-center justify-center border border-accent rounded-4xl p-4 shadow-2xl shadow-accent mt-4 font-bold text-sm animate__animated animate__fadeInUp"
          >
            <span>实事求是</span>
            <RotatingText
              main-class-name="ml-2 px-2 bg-success text-white overflow-hidden py-0.5 justify-center rounded-lg"
              :initial="{ y: '100%' }"
              :animate="{ y: 0 }"
              :exit="{ y: '-120%' }"
              :stagger-duration="0.025"
              split-level-class-name="overflow-hidden pb-0.5"
              :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
              :texts="['以人为本', '分享创新', '总结经验教训']"
            />
          </div>
        </div>
        <div class="w-2xl ml-8">
          <div
            class="border border-accent rounded-4xl shadow-2xl shadow-accent p-4 animate__animated animate__fadeInDown"
          >
            <TextType
              class-name="text-secondary"
              :text-colors="textColors"
              :typing-speed="100"
              :pause-duration="2000"
              :text="thoughtList"
            />
          </div>
          <UBlogPost
            class="border border-accent rounded-4xl shadow-2xl mt-4 shadow-accent animate__animated animate__fadeInRight"
            title="Introducing Nuxt Icon v1"
            description="Discover Nuxt Icon v1 - a modern, versatile"
            image="https://nuxt.com/assets/blog/nuxt-icon/cover.png"
            date="2024-11-25"
            to="https://nuxt.com/blog/nuxt-icon-v1-0"
            target="_blank"
            orientation="horizontal"
            variant="soft"
          />
          <UBlogPost
            class="border border-accent rounded-4xl shadow-2xl mt-4 shadow-accent animate__animated animate__fadeInRight"
            title="Introducing Nuxt Icon v1"
            description="Discover Nuxt Icon v1 - a modern, versatile"
            image="https://nuxt.com/assets/blog/nuxt-icon/cover.png"
            date="2024-11-25"
            to="https://nuxt.com/blog/nuxt-icon-v1-0"
            target="_blank"
            orientation="horizontal"
            variant="soft"
          />
          <div
            class="mt-4 flex justify-end animate__animated animate__fadeInUp"
          >
            <UButton
              trailing-icon="i-lucide-move-right"
              color="secondary"
              to="/blogs"
              variant="link"
              :ui="{
                leadingIcon: 'text-primary',
              }"
            >
              查看更多
            </UButton>
          </div>
        </div>
      </div>
    </Magnet>
  </div>
</template>
<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const textColors = computed(() =>
  isDark.value ? ["hsl(191, 50%, 90%)"] : ["hsl(191, 50%, 10%)"]
);

const thoughtList = ref([
  "这里是我的个人网站，祝你在这里玩的开心~下面是我的一些想法",
  "讲骚话，有助于提升感情，哈哈😂😂",
  "一本讲Shaders非常好的书，《The Book of Shaders》，强烈推荐！👍👍",
]);
</script>
