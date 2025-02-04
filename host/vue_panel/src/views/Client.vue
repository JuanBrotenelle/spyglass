<script setup lang="js">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/storeAdmin'
import Loader from '@/components/loader/Loader.vue'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Preview from '@/components/image/Preview.vue'
import ConfirmAction from '@/components/ConfirmAction.vue'

const storeAdmin = useAdminStore()
const route = useRoute()
const router = useRouter()

const user = computed(() =>
  storeAdmin.users.find(u => u.uuid === route.params.id),
)

function createFileClient() {
  const fileObject = {
    id: user.value.id,
    uuid: user.value.uuid,
    ip: user.value.otherInfo.IP,
    geo: user.value.otherInfo.Geo,
    country_code: user.value.otherInfo.CountryCode,
    browser: user.value.otherInfo.Browser,
    status: user.value.otherInfo.Activity,
    history: `${user.value.historyLength} records`,
    cookies: `${user.value.cookieLength} records`,
    created_at: user.value.otherInfo.Created_at,
  }

  const fileJSON = JSON.stringify(fileObject, null, 2)

  const blob = new Blob([fileJSON], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `client_${user.value.uuid}.json`

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function detectBrowserImage(browser) {
  switch (browser) {
    case 'Chrome':
      return '/images/browsers/Chrome.png'
    case 'Edge':
      return '/images/browsers/Edge.png'
    case 'Firefox':
      return '/images/browsers/Firefox.png'
    case 'Safari':
      return '/images/browsers/Safari.png'
    case 'Opera':
      return '/images/browsers/Opera.png'
    default:
      return '/images/browsers/IE.png'
  }
}

const formatDate = date => {
  const d = new Date(date)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  const hours = String(d.getUTCHours() + 3).padStart(2, '0')
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}

function detectStatusImage(status) {
  switch (status) {
    case 'online':
      return '/images/index/online.png'
    case 'offline':
      return '/images/index/offline.png'
    default:
      return '/images/index/offline.png'
  }
}

const selectedTag = ref(user.value.otherInfo.Activity)

const successTag = ref(false)
const deletedTag = ref(false)

function handlerDeletedTag() {
  deletedTag.value = !deletedTag.value
}

async function deleteUser() {
  try {
    const response = await axios.post(
      `https://console-test873.com:3000/api/v1/users/deleteuser?uuid=${user.value.uuid}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      },
    )

    if (response.data.message == 'OK') {
      router.push({ name: 'home' })
    }
  } catch (error) {
    console.log(error)
  }
}

async function changeTag() {
  try {
    const response = await axios.post(
      'https://console-test873.com:3000/api/v1/comment/tag',
      {
        uuid: user.value.uuid,
        tag: selectedTag.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      },
    )

    if (response.data.message == 'OK') {
      successTag.value = true
      setTimeout(() => {
        successTag.value = false
      }, 2000)
      return
    }
  } catch (error) {
    console.log(error)
  }
}

watch(selectedTag, async () => {
  if (selectedTag.value) {
    await changeTag()
  }
})

const previewImage = ref(false)
const image = ref('')

const handlerImage = imgPrev => {
  image.value = imgPrev
  previewImage.value = !previewImage.value
}

function timeSinceLastOnline(lastOnline) {
  const lastOnlineDate = new Date(lastOnline)
  const now = new Date()
  const deltaMilliseconds = now - lastOnlineDate

  const minutes = Math.floor(deltaMilliseconds / (1000 * 60))
  const hours = Math.floor(deltaMilliseconds / (1000 * 60 * 60))
  const days = Math.floor(deltaMilliseconds / (1000 * 60 * 60 * 24))
  const years = Math.floor(deltaMilliseconds / (1000 * 60 * 60 * 24 * 365))

  if (years > 0) {
    return `${years} г. назад`
  } else if (days > 0) {
    return `${days} д. назад`
  } else if (hours > 0) {
    return `${hours} ч. назад`
  } else {
    return `${minutes} мин. назад`
  }
}

watch(
  () => user.value.otherInfo.Comment,
  newComment => {
    if (user.value.uuid && newComment) {
      storeAdmin.updateComment(user.value.uuid, newComment)
    }
  },
)
</script>

<template>
  <ConfirmAction
    v-if="deletedTag"
    @close="handlerDeletedTag"
    @action="deleteUser"
    >Вы действительно хотите удалить пользователя?</ConfirmAction
  >
  <Preview v-if="previewImage" :image="image" @close="handlerImage" />
  <div v-show="successTag" class="absolute bottom-10 left-0 w-full">
    <div class="bg-gray-400 w-fit mx-auto rounded-lg p-2 text-white">
      <p>Статус успешно обновлен!</p>
    </div>
  </div>
  <p
    @click="$router.go(-1)"
    class="cursor-pointer text-gray-500 ml-10 mt-10 inline-block"
  >
    Назад
  </p>
  <div v-if="user" class="max-w-[1920px] mx-auto mt-10">
    <h1 class="text-2xl font-semibold">Клиент {{ $route.params.id }}</h1>
    <div class="mt-2 flex flex-row gap-5">
      <a
        href="#"
        @click.prevent="createFileClient"
        target="_blank"
        class="text-blue-500 underline cursor-pointer"
        >Скачать файл о клиенте</a
      >
      <a
        v-if="user.historyLength > 0"
        @click.prevent="
          router.push({ name: 'history', params: { id: $route.params.id } })
        "
        href="#"
        target="_blank"
        class="text-blue-500 underline cursor-pointer"
        >Экспорт истории</a
      >
      <a v-else class="text-gray-500 cursor-not-allowed"
        >Экспорт истории не доступен</a
      >
      <a
        v-if="user.cookieLength > 0"
        @click.prevent="
          router.push({ name: 'cookies', params: { id: $route.params.id } })
        "
        href="#"
        target="_blank"
        class="text-blue-500 underline cursor-pointer"
        >Экспорт куки</a
      >
      <a v-else class="text-gray-500 cursor-not-allowed"
        >Экспорт куки не доступен</a
      >
    </div>
    <table class="w-full mt-4">
      <thead>
        <tr>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">
            Статус
          </th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">
            В сети
          </th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">ID</th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">IP</th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">Гео</th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">
            Браузер
          </th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">
            Создан
          </th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">
            Кол-во записей истории
          </th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">
            Кол-во куки
          </th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">
            Кол-во скриншотов
          </th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">
            Комментарий
          </th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">Тег</th>
          <th class="text-center border p-2 bg-gray-50 text-gray-500">
            Удаление
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border text-center">
            <div class="flex items-center justify-center">
              <img :src="detectStatusImage(user.status)" class="w-3" alt="" />
            </div>
          </td>
          <td class="border text-center">
            {{
              user.status === 'online'
                ? 'Онлайн'
                : `Был(-a) ${timeSinceLastOnline(user.lastOnline)}`
            }}
          </td>
          <td class="border text-center">{{ user.id }}</td>
          <td class="border text-center">{{ user.otherInfo.IP }}</td>
          <td class="text-center border p-2">
            <span
              :class="['fi fi-' + user.otherInfo.CountryCode.toLowerCase()]"
            ></span>
            {{ user.otherInfo.Geo }}
          </td>
          <td class="text-center border p-2">
            <div class="flex flex-col items-center justify-center gap-1">
              <div
                class="flex flex-row items-center justify-center gap-1"
                v-for="(browser, index) in user.otherInfo.Browser"
                :key="index"
              >
                <img :src="detectBrowserImage(browser)" class="w-5" alt="" />{{
                  browser
                }}
              </div>
            </div>
          </td>
          <td class="border text-center">
            {{ formatDate(user.otherInfo.Created_at) }}
          </td>
          <td class="border text-center">{{ user.historyLength }}</td>
          <td class="border text-center">{{ user.cookieLength }}</td>
          <td class="border text-center">
            {{ user.images ? user.images.length : 0 }}
          </td>
          <td class="border text-center">
            <input
              type="text"
              v-model="user.otherInfo.Comment"
              class="h-10 outline-none text-center"
            />
          </td>
          <td class="border text-center">
            <select v-model="selectedTag" name="" id="">
              <option value="active">Активный</option>
              <option value="archive">Архив</option>
            </select>
          </td>
          <td class="border text-center">
            <button
              @click="handlerDeletedTag"
              class="bg-red-500 text-white rounded-lg p-2"
            >
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-5">
      <h1 class="text-xl font-medium">Скриншоты</h1>
      <div
        v-if="user.images"
        class="flex flex-row max-w-[1920px] overflow-x-scroll overflow-x-visible gap-2 mt-2 pb-5"
      >
        <div
          @click="handlerImage(image)"
          v-for="(image, index) in user.images"
          :key="index"
          class="h-[300px] min-w-[500px] bg-gray-200 rounded-lg shadow-xl drop-shadow-lg cursor-pointer border-2 border-gray-500"
        >
          <img
            :src="`https://console-test873.com:3000${image}`"
            :alt="image"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
      <div
        class="w-full h-20 flex items-center justify-center text-gray-500"
        v-else
      >
        Нет скриншотов
      </div>
    </div>
  </div>
  <div v-else class="w-full h-screen flex items-center justify-center">
    <Loader />
  </div>
</template>

<style scoped></style>
