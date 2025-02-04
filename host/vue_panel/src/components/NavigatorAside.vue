<script lang="js" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const varMenu = ref(false)
const activePage = ref('menu')

function handlerMenu() {
  varMenu.value = !varMenu.value
}

function routingPage(page, ap) {
  router.push({ name: page })
  varMenu.value = !varMenu.value
  activePage.value = ap
}
</script>

<template>
  <div
    v-if="varMenu"
    class="fixed top-0 left-0 h-screen bg-white shadow-2xl drop-shadow-lg z-[99999] p-5"
  >
    <div class="">
      <button
        @click="handlerMenu"
        class="text-gray-500 cursor-pointer active:scale-[1.05] transition-all"
      >
        Закрыть
      </button>
    </div>
    <div class="flex flex-col items-start mt-10 gap-3">
      <a
        @click.prevent="routingPage('home', 'menu')"
        class="w-full active:bg-gray-200 transition-all py-5 pl-1 pr-5 rounded-lg cursor-pointer hover:bg-gray-100"
        :class="{ 'bg-gray-200': activePage === 'menu' }"
        >Главная</a
      >
      <a
        @click.prevent="routingPage('settings', 'settings')"
        class="w-full active:bg-gray-200 transition-all py-5 pl-1 pr-5 rounded-lg cursor-pointer hover:bg-gray-100"
        :class="{ 'bg-gray-200': activePage === 'settings' }"
        >Настройки</a
      >
      <a
        @click.prevent="routingPage('scripts', 'scripts')"
        class="w-full active:bg-gray-200 transition-all py-5 pl-1 pr-5 rounded-lg cursor-pointer hover:bg-gray-100"
        :class="{ 'bg-gray-200': activePage === 'scripts' }"
        >Инжектируемые скрипты</a
      >
    </div>
  </div>

  <div
    @click="handlerMenu"
    v-else
    class="fixed top-2 left-2 z-[99999] p-5 drop-shadow-lg rounded-full bg-white cursor-pointer"
  >
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.05 5H0.95C0.42533 5 0 5.42533 0 5.95V6.05C0 6.57467 0.42533 7 0.95 7H17.05C17.5747 7 18 6.57467 18 6.05V5.95C18 5.42533 17.5747 5 17.05 5Z"
        fill="black"
      />
      <path
        d="M17.05 10H0.95C0.42533 10 0 10.4253 0 10.95V11.05C0 11.5747 0.42533 12 0.95 12H17.05C17.5747 12 18 11.5747 18 11.05V10.95C18 10.4253 17.5747 10 17.05 10Z"
        fill="black"
      />
      <path
        d="M17.05 0H0.95C0.42533 0 0 0.425329 0 0.95V1.05C0 1.57467 0.42533 2 0.95 2H17.05C17.5747 2 18 1.57467 18 1.05V0.95C18 0.425329 17.5747 0 17.05 0Z"
        fill="black"
      />
    </svg>
  </div>
</template>

<style scoped></style>
