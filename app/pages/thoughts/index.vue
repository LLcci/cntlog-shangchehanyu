<template>
  <motion.div :initial="{ opacity: 0 }" :while-in-view="{ opacity: 1 }">
    <UContainer>
      <UPageHeader
        title="思绪"
        description="记录下自己的胡思乱想"
      ></UPageHeader>
      <UTimeline
        class="mt-8"
        :items="thoughts!.list"
        color="secondary"
        :ui="{
          title: 'text-xl',
          date: 'text-md',
          description: 'text-lg',
        }"
      />
    </UContainer>
  </motion.div>
</template>
<script setup lang="ts">
import { motion } from "motion-v";
const { data: thoughts } = await useAsyncData("thoughts", () => {
  return queryCollection("thoughts").first();
});
</script>
<style scoped></style>
