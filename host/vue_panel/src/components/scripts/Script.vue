<script setup lang="js">
import { useRouter } from 'vue-router'
import tinycolor from 'tinycolor2'

const emits = defineEmits(['delete'])

const router = useRouter()
const props = defineProps({
  script: Object,
  index: Number,
})

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
  <tr class="bg-white text-center">
    <td>{{ props.index + 1 }}.</td>
    <td class="flex flex-row items-center justify-center">
      <p
        class="py-2 px-4 rounded-lg w-fit"
        :style="{
          backgroundColor: props.script.color,
          color: tinycolor(props.script.color).isLight() ? '#000' : '#fff',
        }"
      >
        {{ props.script.domain }}
      </p>
    </td>
    <td>{{ props.script.file }}</td>
    <td>{{ formatDate(props.script.created_at) }}</td>
    <td class="py-2 flex flex-row items-center justify-center gap-2">
      <button
        @click="
          router.push({
            name: 'script',
            params: { uuid: props.script.uuidFile },
          })
        "
        class="bg-blue-500 text-white rounded-lg p-2 active:scale-[1.02] active:bg-blue-600 transition-all"
      >
        Подробнее
      </button>
      <button
        @click="emits('delete', props.script.uuidFile)"
        class="bg-red-500 text-white rounded-lg p-2 active:scale-[1.02] active:bg-red-600 transition-all"
      >
        Удалить
      </button>
    </td>
  </tr>
</template>
