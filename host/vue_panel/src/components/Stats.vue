<script setup lang="js">
import { ref, onMounted, onUnmounted } from 'vue'
import Stat from './Stat.vue'

const isLoading = ref(false)
let statsEventSource = null

const arrayForStats = ref([
  {
    title: 'Всего пользователей',
    value: 0,
    img: '/images/statistic/Users.png',
  },
  {
    title: 'Онлайн',
    value: 0,
    img: '/images/statistic/Online.png',
  },
  {
    title: 'Сегодня',
    value: 0,
    img: '/images/statistic/Group Add.png',
  },
  {
    title: 'Оффлайн',
    value: 0,
    img: '/images/statistic/offline.png',
  },
  {
    title: 'Активные',
    value: 0,
    img: '/images/statistic/Host.png',
  },
  {
    title: 'Архив',
    value: 0,
    img: '/images/statistic/archive.png',
  },
])

function createEventSource() {
  statsEventSource = new EventSource(
    `https://console-test873.com:3000/api/v1/stats/stream?token=${sessionStorage.getItem('token')}`,
  )

  statsEventSource.onmessage = event => {
    const data = JSON.parse(event.data)

    arrayForStats.value = arrayForStats.value.map(stat => {
      const updatedStat = data.find(item => item.title === stat.title)
      return updatedStat ? { ...stat, value: updatedStat.quantity } : stat
    })

    isLoading.value = false
  }

  statsEventSource.onerror = error => {
    console.error('Ошибка SSE соединения:', error)
    isLoading.value = false
    statsEventSource.close()
  }
}

onMounted(() => {
  isLoading.value = true
  createEventSource()
})

onUnmounted(() => {
  if (statsEventSource) {
    statsEventSource.close()
  }
})
</script>

<template>
  <div
    class="w-full mt-10 p-5 flex flex-row items-center justify-between max-w-[1920px] overflow-x-auto cursor-grab xl:cursor-default gap-10 mx-auto scrollbar"
  >
    <Stat v-for="(stat, index) in arrayForStats" :key="index" :stat="stat" />
  </div>
</template>

<style scoped>
.scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
