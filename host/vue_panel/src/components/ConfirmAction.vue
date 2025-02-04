<script setup lang="js">
const emit = defineEmits(['close', 'action'])
</script>

<template>
  <div
    class="absolute left-0 top-0 w-full h-screen bg-[#00000033] flex items-center justify-center"
  >
    <div class="bg-white p-5 rounded-lg flex flex-col gap-5">
      <div class="flex flex-row items-center justify-between">
        <p class="text-lg font-medium">Подтвердите действие</p>
        <button @click="emit('close')" class="text-gray-500">Закрыть</button>
      </div>
      <p><slot></slot></p>
      <button
        @click="emit('action')"
        class="bg-blue-500 text-white rounded-lg p-2 active:scale-[1.02] active:bg-blue-600 w-full transition-all"
      >
        Подтвердить
      </button>
    </div>
  </div>
</template>
