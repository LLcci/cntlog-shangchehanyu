<template>
  <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }">
    <UContainer>
      <UPage>
        <UBreadcrumb class="mt-8 lg:block hidden" :items="items" />
        <UPageHeader :title="post?.title" :description="date" />
        <UPageBody>
          <ContentRenderer
            v-if="post"
            class="bg-gray-50 dark:bg-gray-800 p-8 opacity-90 rounded-xl border border-accent"
            :value="post"
          />
          <div v-else>post not found</div>
          <UContentSurround :surround="surround" />
        </UPageBody>
        <template #right>
          <UContentToc
            :links="post?.body?.toc?.links"
            title="目录"
            highlight
            highlight-color="secondary"
          >
            <template #bottom>
              <UButton
                v-if="yNum > 0.1"
                icon="i-lucide-arrow-big-up-dash"
                color="secondary"
                variant="subtle"
                @click="scrollToTop"
                >回到顶部</UButton
              >
            </template>
          </UContentToc>
        </template>
      </UPage>
    </UContainer>
  </motion.div>
</template>
<script setup lang="ts">
import { motion, useMotionValueEvent, useScroll, animate } from "motion-v";
const route = useRoute();
const { data: post } = await useAsyncData(`blogs-${route.params.id}`, () => {
  return queryCollection("blogs").path(`/blogs/${route.params.id}`).first();
});

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings("blogs", route.path, {
    fields: ["description"],
  }).order("date", "DESC");
});

const date = computed(() => {
  return new Date(post.value!.date).toLocaleDateString().replaceAll("/", "-");
});

const items = ref([
  {
    label: "博客",
    icon: "i-lucide-book-open",
    to: "/blogs",
  },
  {
    label: post.value?.title,
    to: post.value?.path,
  },
]);

const { scrollYProgress } = useScroll();
const yNum = ref(0);
useMotionValueEvent(scrollYProgress, "change", (latest) => {
  yNum.value = latest;
});

const scrollToTop = () => {
  animate(window.scrollY, 0, {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    onUpdate: (latest) => {
      window.scrollTo(0, latest);
    },
  });
};

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
  keywords: post.value?.keywords,
});
</script>
<style scoped></style>
