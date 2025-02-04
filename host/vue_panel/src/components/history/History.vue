<script lang="js" setup>
import { reactive, onMounted } from 'vue'
import Loader from '../loader/Loader.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

async function getHistory() {
  const response = await axios.get(
    `https://console-test873.com:3000/api/v1/history?uuid=${props.uuid}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    },
  )

  if (Array.isArray(response.data)) {
    historyArray.splice(0, historyArray.length, ...response.data)
  } else {
    console.error(
      'Ожидался массив, но получен другой тип данных:',
      response.data,
    )
  }
}

const copyText = text => {
  navigator.clipboard.writeText(text)
}

const emit = defineEmits(['close'])

const historyArray = reactive([])

const props = defineProps({
  uuid: String,
  length: Number,
})

onMounted(async () => {
  await getHistory()
})
</script>

<template>
  <div
    class="absolute z-[9999999] top-0 left-0 w-full h-screen bg-[#00000033] flex items-center justify-center p-10"
  >
    <div
      class="bg-white rounded-lg flex flex-col justify-center items-start scale-[0.8] p-5 max-w-[900px] w-full"
    >
      <div class="flex flex-row items-center justify-between w-full">
        <h1 class="text-xl font-semibold">История пользователя</h1>
        <button @click="emit('close', '')" class="text-gray-500">
          Закрыть
        </button>
      </div>
      <div
        v-if="historyArray.length === 0"
        class="h-full w-full flex items-center justify-center"
      >
        <Loader />
      </div>
      <div v-else class="flex h-full w-full flex-col">
        <div
          class="flex flex-col gap-5 my-10 items-center justify-start w-full overflow-auto"
        >
          <table class="w-full">
            <thead>
              <tr>
                <th
                  class="py-2 px-4 border text-center bg-gray-50 font-semibold text-gray-500"
                >
                  #
                </th>
                <th
                  class="py-2 px-4 border text-center bg-gray-50 font-semibold text-gray-500"
                >
                  Название
                </th>
                <th
                  class="py-2 px-4 border text-center bg-gray-50 font-semibold text-gray-500"
                >
                  Ссылка
                </th>
                <th
                  class="py-2 px-4 border text-center bg-gray-50 font-semibold text-gray-500"
                >
                  Визиты
                </th>
              </tr>
            </thead>
            <tbody class="">
              <tr
                v-for="(history, index) in historyArray"
                :key="index"
                class="w-full"
              >
                <td class="text-center border p-2">
                  {{ index + 1 }}
                </td>
                <td class="text-center border p-2">
                  {{ history.title }}
                </td>
                <td class="text-center border p-2">
                  <p
                    @click="copyText(history.url)"
                    class="text-blue-500 underline max-w-[200px] truncate cursor-pointer"
                  >
                    {{ history.url }}
                  </p>
                </td>
                <td class="text-center border p-2">
                  {{ history.visitCount }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="text-gray-500 text-center mb-2">
            И еще {{ props.length - historyArray.length }}
          </p>
        </div>
        <button
          @click="router.push({ name: 'history', params: { id: props.uuid } })"
          class="text-gray-500 w-full text-center bg-blue-100 transition-all p-2 rounded-lg active:scale-[1.02] active:bg-gray-200"
        >
          Экспорт истории
        </button>
      </div>
    </div>
  </div>
</template>
