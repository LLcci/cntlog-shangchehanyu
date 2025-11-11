<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <motion.div
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :in-view-options="{ once: true }"
        >
          <UPageHeader
            title="博客"
            description="一些我关于技术、产品、架构的文章"
          />
        </motion.div>
        <UBlogPosts>
          <motion.div
            v-for="post in blogs"
            :key="post.path"
            :initial="{ opacity: 0, transform: 'scale(0)' }"
            :while-in-view="{ opacity: 1, transform: 'scale(1)' }"
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
              variant="soft"
            />
          </motion.div>
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
import { motion } from "motion-v";

const { data: blogs } = await useAsyncData("blogs-all", () => {
  return queryCollection("blogs")
    .select("title", "description", "image", "date", "path")
    .order("date", "DESC")
    .all();
});

useSeoMeta({
  title: "上车函予技术博客 - 前端开发、后端架构与云原生技术分享",
  description:
    "上车函予的技术博客，分享前端开发、后端架构、云原生技术、Node.js、Vue3、NestJS等现代Web开发实践经验与深度思考。",
  keywords:
    "前端开发,后端架构,云原生技术,Node.js,Vue3,NestJS,Web开发,技术博客,编程实践,开发经验",
});
</script>
<style scoped></style>
