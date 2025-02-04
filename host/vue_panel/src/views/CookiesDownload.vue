<script setup lang="js">
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Loader from '@/components/loader/Loader.vue'

const route = useRoute()
const router = useRouter()

async function downloadCookies() {
  try {
    const cookies = await getAllCookies()

    const blob = new Blob([JSON.stringify(cookies, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cookies_${route.params.id}.json`
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.log(e)
  } finally {
    router.go(-1)
  }
}

async function getAllCookies() {
  try {
    const response = await axios.post(
      'https://console-test873.com:3000/api/v1/cookies',
      {
        uuid: route.params.id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      },
    )

    return response.data
  } catch (e) {
    throw e
  }
}

onMounted(() => {
  downloadCookies()
})
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <Loader />
  </div>
</template>
