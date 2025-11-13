<template>
  <div class="size-fit lg:mt-16 mt-8 m-auto">
    <Magnet :padding="30" :magnet-strength="25" :disabled="smallerThanLg">
      <div class="lg:flex">
        <div class="w-80 lg:w-3xs">
          <motion.div
            class="h-60 lg:h-94 lg:sticky lg:top-37"
            :initial="{ x: '-100%', opacity: 0 }"
            :while-in-view="{ x: 0, opacity: 1 }"
            :transition="{ duration: 0.8 }"
            :in-view-options="{ once: true }"
          >
            <div
              class="absolute w-full top-0 left-0 h-60 lg:h-94 bg-[url('~/assets/images/profile_bg.jpg')] rounded-4xl bg-cover bg-center"
            >
              <div
                class="w-full h-full bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-4xl"
              />
            </div>
            <div
              class="absolute w-full top-0 left-0 h-60 lg:h-94 border border-accent rounded-4xl p-4 shadow-2xl shadow-accent flex flex-col items-center justify-center"
            >
              <img
                class="lg:w-24 lg:h-24 w-16 h-16 rounded-full"
                src="~/assets/images/avatar.svg"
                alt="avatar"
              />
              <div class="text-lg font-bold mt-2">上车函予</div>
              <div class="flex items-center mt-2">
                <UIcon name="i-lucide-mail" />
                <div class="text-sm">: 374166002@qq.com</div>
              </div>
              <div class="mt-2">
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
              </div>
            </div>
          </motion.div>
          <motion.div
            class="flex items-center justify-center lg:sticky lg:top-137 border border-accent rounded-4xl p-4 shadow-2xl shadow-accent mt-4 font-bold text-sm"
            :initial="{ y: '100%', opacity: 0 }"
            :while-in-view="{ y: 0, opacity: 1 }"
            :transition="{ duration: 0.8 }"
            :in-view-options="{ once: true }"
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
          </motion.div>
        </div>
        <div class="w-80 lg:w-3xl lg:ml-8 mt-4 lg:mt-0 pb-4">
          <motion.div
            class="border border-accent rounded-4xl shadow-2xl shadow-accent p-4"
            :initial="{ y: '-100%', opacity: 0 }"
            :while-in-view="{ y: 0, opacity: 1 }"
            :transition="{ duration: 0.8 }"
            :in-view-options="{ once: true }"
          >
            <TextType
              v-if="thoughts"
              class-name="text-secondary cursor-pointer"
              :text-colors="textColors"
              :typing-speed="100"
              :pause-duration="2000"
              :text="thoughts.list.map((item) => item.title)"
              @click="router.push('/thoughts')"
            />
          </motion.div>
          <motion.div
            v-for="post in blogs"
            :key="post.path"
            :initial="{
              opacity: 0,
              transform: 'translate(0, -50%) scale(1, 0)',
            }"
            :while-in-view="{
              opacity: 1,
              transform: 'translate(0, 0) scale(1)',
            }"
            :transition="{ type: 'spring', visualDuration: 0.3 }"
            :in-view-options="{ once: true }"
          >
            <UBlogPost
              class="border border-accent rounded-4xl shadow-2xl mt-4 shadow-accent"
              :title="post.title"
              :description="post.description"
              :image="post.image"
              :date="post.date"
              :to="post.path"
              orientation="horizontal"
              variant="soft"
            />
          </motion.div>
        </div>
      </div>
    </Magnet>
  </div>
</template>
<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { motion } from "motion-v";

const router = useRouter();

const { data: blogs } = await useAsyncData("blogs-index", () => {
  return queryCollection("blogs")
    .select("title", "description", "image", "date", "path")
    .order("date", "DESC")
    .all();
});

const { data: thoughts } = await useAsyncData("thoughts", () => {
  return queryCollection("thoughts").first();
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const smallerThanLg = breakpoints.smaller("lg");

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const textColors = computed(() =>
  isDark.value ? ["hsl(191, 50%, 90%)"] : ["hsl(191, 50%, 10%)"],
);
</script>
