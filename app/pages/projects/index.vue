<template>
  <UContainer class="mb-16">
    <UPage>
      <motion.div
        :initial="{ opacity: 0 }"
        :while-in-view="{
          opacity: 1,
        }"
        :in-view-options="{ once: true }"
      >
        <UPageHeader title="项目集" description="一些我的个人项目" />
      </motion.div>
      <motion.div
        v-for="(project, index) in projects"
        :key="project.id"
        class="mt-4"
        :initial="{ opacity: 0 }"
        :while-in-view="{
          opacity: 1,
        }"
        :in-view-options="{ once: true }"
      >
        <UPageHero
          class="bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-4xl"
          :title="project.title"
          :description="project.description"
          :links="project.links"
          orientation="horizontal"
          :reverse="index % 2 === 1"
        >
          <motion.div
            :class="index % 2 === 1 ? 'origin-top-left' : 'origin-top-right'"
            :initial="{
              rotate: index % 2 === 1 ? 15 : -15,
            }"
            :while-in-view="{
              rotate: 0,
            }"
            :transition="{ duration: 0.8, type: 'spring', delay: 0.2 }"
          >
            <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="border border-accent rounded-xl shadow-2xl shadow-accent"
            />
          </motion.div>
        </UPageHero>
      </motion.div>
    </UPage>
  </UContainer>
</template>
<script setup lang="ts">
import { motion } from "motion-v";
const { data: projects } = await useAsyncData("projects", () => {
  return queryCollection("projects").all();
});
</script>
<style scoped></style>
