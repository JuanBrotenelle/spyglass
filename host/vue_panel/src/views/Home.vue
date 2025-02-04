<script setup lang="js">
import { onMounted, ref } from 'vue'
import Stats from '../components/Stats.vue'
import Tabler from '../components/Tabler.vue'
import axios from 'axios'

const db = ref(false)
const api = ref(false)
const ws = ref(false)

//77.83.175.81
async function checkAPIandDB() {
  const response = axios
    .get('https://console-test873.com:3000', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      let { data } = response

      if (data.message === 'OK') {
        api.value = true
        if (data.db === 'OK') {
          db.value = true
        }
      }
    })
}

async function checkWS() {
  const response = axios
    .get('https://console-test873.com:3001/status', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      let { data } = response
      if (data.status === 'OK') {
        ws.value = true
      }
    })

  console.log(response)
}

onMounted(async () => {
  await checkAPIandDB()
  await checkWS()
})
</script>

<template>
  <div
    class="w-full bg-white shadow-xl p-5 drop-shadow-lg flex flex-row items-center justify-between"
  >
    <h1 class="text-xl ml-20">Клиенты</h1>
    <div class="flex flex-row gap-5">
      <p :style="{ color: db ? 'green' : 'red' }">
        Статус БД: {{ db ? 'Вкл' : 'Выкл' }}
      </p>
      <p :style="{ color: api ? 'green' : 'red' }">
        Статус API: {{ api ? 'Вкл' : 'Выкл' }}
      </p>
      <p :style="{ color: ws ? 'green' : 'red' }">
        Статус WS: {{ ws ? 'Вкл' : 'Выкл' }}
      </p>
    </div>
  </div>

  <Stats />

  <Tabler />
</template>
