<script setup lang="js">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import axios from 'axios'
import tinycolor from 'tinycolor2'

const isEditing = ref(false)
const router = useRouter()

const props = defineProps({
  user: Object,
  modelValue: {
    type: String,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'updateCommentField',
  'showHistory',
])

function handleCommentUpdate() {
  emit('updateCommentField')
  isEditing.value = !isEditing.value
}

async function orderQueue() {
  try {
    const uuid = props.user.uuid
    const response = await axios.post(
      'https://console-test873.com:3000/queue',
      {
        uuid: uuid,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      },
    )
    console.log(response)
  } catch (error) {
    console.log(error)
  }
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

const formatDate = date => {
  const d = new Date(date)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  const hours = String(d.getUTCHours() + 3).padStart(2, '0')
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}
</script>

<template>
  <tr>
    <td class="text-center border p-2">{{ props.user.id }}</td>
    <td class="text-center border">
      <div class="flex items-center justify-center">
        <img :src="detectStatusImage(props.user.status)" class="w-3" alt="" />
      </div>
    </td>
    <td class="border text-center">
      {{
        user.status === 'online'
          ? 'Онлайн'
          : `Был(-a) ${timeSinceLastOnline(user.lastOnline)}`
      }}
    </td>
    <td class="text-center border p-2">{{ props.user.uuid }}</td>
    <td class="text-center border p-2">{{ props.user.otherInfo.IP }}</td>
    <td class="text-center border p-2">
      <span
        :class="['fi fi-' + props.user.otherInfo.CountryCode.toLowerCase()]"
      ></span>
      {{ props.user.otherInfo.Geo }}
    </td>
    <td class="text-center border p-2">
      <div class="flex flex-col items-center justify-center gap-1">
        <div
          class="flex flex-row items-center justify-center gap-1"
          v-for="(browser, index) in props.user.otherInfo.Browser"
          :key="index"
        >
          <img :src="detectBrowserImage(browser)" class="w-5" alt="" />{{
            browser
          }}
        </div>
      </div>
    </td>
    <td
      @click="
        props.user.historyLength > 0 ? emit('showHistory', props.user.uuid) : ''
      "
      class="text-center border p-2"
      :class="{
        'text-blue-500 cursor-pointer select-none underline flex flex-col items-center justify-center':
          props.user.historyLength > 0,
      }"
    >
      {{ props.user.historyLength }}
      <div class="flex flex-row flex-wrap gap-1 items-center justify-center">
        <div
          class="text-xs px-2 py-1 rounded-full no-underline"
          :style="{
            'background-color': domain.color,
            color: tinycolor(domain.color).isLight() ? '#000' : '#fff',
          }"
          v-for="(domain, index) in props.user.otherInfo.MatchedDomains"
          :key="index"
        >
          {{ domain.domain }}
        </div>
      </div>
    </td>
    <td class="text-center border p-2">{{ props.user.cookieLength }}</td>
    <td class="text-center border p-2">
      <input
        class="border-2 outline-none px-2"
        v-if="isEditing"
        type="text"
        :value="props.modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        @blur="handleCommentUpdate"
      />
      <span
        v-else
        @click="handleCommentUpdate"
        class="select-none cursor-pointer"
        >{{ modelValue || 'Кликните, чтобы изменить' }}</span
      >
    </td>
    <td class="text-center border p-2">
      {{ formatDate(props.user.otherInfo.Created_at) }}
    </td>
    <td class="text-center border p-2">
      <button
        v-if="props.user.status === 'online'"
        @click="orderQueue"
        class="bg-blue-500 text-white rounded-lg p-2 active:scale-[1.02] active:bg-blue-600 transition-all"
      >
        Сделать скриншот
      </button>
      <span v-else>Нет доступных действий</span>
    </td>
    <td
      @click="router.push({ name: 'user', params: { id: props.user.uuid } })"
      class="text-center border p-2 text-blue-500 underline cursor-pointer select-none"
    >
      Подробнее о клиенте
    </td>
  </tr>
</template>
