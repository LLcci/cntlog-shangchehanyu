<template>
  <div class="p-8">
    <ContentRenderer v-if="post" :value="post" />
    <div v-else>post not found</div>
  </div>
</template>
<script setup lang="ts">
const id = useRoute().params.id;
const { data: post } = await useAsyncData(`blogs-${id}`, () => {
  return queryCollection("blogs").path(`/blogs/${id}`).first();
});

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
  keywords: post.value?.keywords,
});
</script>
<style scoped></style>
