<template>
  <motion.div
    class="w-screen h-2 origin-left bg-accent fixed top-0 left-0 z-100"
    :style="{ scaleX }"
  ></motion.div>
</template>
<script setup lang="ts">
import { motion, useScroll, useSpring } from "motion-v";

const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, {
  damping: 30,
});
</script>
