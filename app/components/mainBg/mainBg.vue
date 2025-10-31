<template>
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
</template>
<script setup lang="ts"></script>
<style scoped></style>
