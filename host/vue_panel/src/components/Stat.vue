<script setup lang="js">
const props = defineProps({
  stat: Object,
})
</script>

<template>
  <div
    class="min-w-[275px] relative bg-white p-5 rounded-lg drop-shadow-lg shadow-xl w-fit flex flex-row gap-10 justify-between select-none transition-all hover:scale-105"
  >
    <div
      class="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-lg z-20 bg-gradient"
    ></div>
    <div class="h-16 flex flex-col items-start justify-between">
      <h1 class="text-3xl font-semibold">{{ stat.value }}</h1>
      <p class="text-xs text-gray-500">{{ stat.title }}</p>
    </div>
    <img
      :src="stat.img"
      class="h-20 contrast-[0.1] pointer-events-none"
      alt=""
    />
  </div>
</template>

<style scoped>
.bg-gradient {
  background: linear-gradient(
    90deg,
    rgba(27, 27, 27, 0) 0%,
    rgba(255, 255, 255, 1) 95%
  );
}
</style>
