<script setup lang="js">
import Script from '@/components/scripts/Script.vue'
import CreateScript from '@/components/scripts/CreateScript.vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useScriptsStore } from '@/stores/scriptsStore'

const varCreatingScript = ref(false)
const scriptsStore = useScriptsStore()

const scriptsArray = computed(() => scriptsStore.scripts)

async function createScript(formData) {
  try {
    const response = await axios.post(
      'https://console-test873.com:3000/api/v1/scripts/add',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      },
    )

    if (response && Array.isArray(response.data)) {
      scriptsStore.applyArray(response.data)
    }
  } catch (error) {
    console.log(error)
  }
}

async function getScripts() {
  try {
    const response = await axios.post(
      'https://console-test873.com:3000/api/v1/scripts/getall',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      },
    )

    if (response && Array.isArray(response.data)) {
      scriptsStore.applyArray(response.data)
    }
  } catch (error) {
    console.log(error)
  }
}

async function deleteScript(uuid) {
  try {
    const response = await axios.post(
      'https://console-test873.com:3000/api/v1/scripts/delete',
      {
        uuidFile: uuid,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      },
    )

    if (response && Array.isArray(response.data)) {
      scriptsStore.applyArray(response.data)
    }
  } catch (error) {
    console.log(error)
  }
}

function handleCreatingScript() {
  varCreatingScript.value = !varCreatingScript.value
}

onMounted(async () => {
  await getScripts()
})
</script>

<template>
  <CreateScript
    v-if="varCreatingScript"
    @close="handleCreatingScript"
    @create="createScript"
  />
  <div
    class="w-full bg-white shadow-xl p-5 drop-shadow-lg flex flex-row items-center justify-between"
  >
    <h1 class="text-xl ml-20">Инжектируемые скрипты</h1>
  </div>
  <div class="max-w-[1920px] px-5 mx-auto mt-10">
    <div class="w-full flex flex-row items-center justify-between">
      <button
        @click="handleCreatingScript"
        class="bg-blue-500 text-white rounded-lg p-2 active:scale-[1.02] active:bg-blue-600 transition-all"
      >
        Создать скрипт
      </button>
    </div>
    <table class="w-full mt-5">
      <thead class="">
        <tr>
          <td class="text-center border p-2 bg-gray-50 text-lg font-semibold">
            #
          </td>
          <td class="text-center border p-2 bg-gray-50 text-lg font-semibold">
            Домен
          </td>
          <td class="text-center border p-2 bg-gray-50 text-lg font-semibold">
            Инжектируемый файл
          </td>
          <td class="text-center border p-2 bg-gray-50 text-lg font-semibold">
            Создан
          </td>
          <td class="text-center border p-2 bg-gray-50 text-lg font-semibold">
            Действия
          </td>
        </tr>
      </thead>
      <tbody v-if="scriptsArray.length > 0" class="border">
        <Script
          @delete="deleteScript"
          v-for="(script, index) in scriptsArray"
          :key="index"
          :script="script"
          :index="index"
        />
      </tbody>
      <tbody v-else class="border">
        <tr>
          <td class="text-center p-5" colspan="5">Нет скриптов</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
