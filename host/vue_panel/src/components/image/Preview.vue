<script setup lang="js">
const emit = defineEmits(['close'])
const props = defineProps({
  image: String,
})
</script>

<template>
  <div
    class="z-[9999999] h-screen w-full absolute top-0 left-0 flex items-center justify-center"
  >
    <img
      :src="`https://console-test873.com:3000${props.image}`"
      alt=""
      class="h-4/5 z-[9999999999]"
    />
    <div
      @click="emit('close')"
      class="w-full h-full bg-[#00000033] absolute top-0 left-0 z-[99999991]"
    ></div>
  </div>
</template>
