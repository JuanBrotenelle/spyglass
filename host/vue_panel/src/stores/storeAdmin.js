import { ref, reactive, onBeforeUnmount, onMounted, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

export const useAdminStore = defineStore(
  'admin',
  () => {
    const users = reactive([])
    const isLoading = ref(false)
    const isUpdatingComment = ref(false)
    let eventSource = null

    function createEventSource(quantity, sort, order, strict, search) {
      isLoading.value = true
      if (eventSource) eventSource.close()

      eventSource = new EventSource(
        `https://console-test873.com:3000/api/v1/users/stream?quantity=${quantity}&sort=${sort}&order=${order}&strict=${strict}&search=${search}&token=${sessionStorage.getItem(
          'token',
        )}`,
      )

      eventSource.onmessage = event => {
        if (isUpdatingComment.value) return
        const data = JSON.parse(event.data)
        users.splice(0, users.length, ...data)
        isLoading.value = false
      }

      eventSource.onerror = async error => {
        console.error('Ошибка SSE соединения:', error)
        users.splice(0, users.length)
        isLoading.value = false
        eventSource.close()
      }
    }

    function loadUsersFromSession() {
      const storedUsers = sessionStorage.getItem('admin')
      if (storedUsers) {
        users.splice(0, users.length, ...JSON.parse(storedUsers).users)
      }
    }

    onMounted(() => {
      loadUsersFromSession()
    })

    async function updateComment(uuid, comment) {
      try {
        await axios.post(
          'https://console-test873.com:3000/api/v1/comment',
          { uuid, comment },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          },
        )
      } catch (error) {
        console.log(error)
      }
    }

    onBeforeUnmount(() => {
      if (eventSource) eventSource.close()
    })

    return {
      users,
      isLoading,
      isUpdatingComment,
      createEventSource,
      updateComment,
    }
  },
  {
    persist: {
      enabled: true,
      key: 'admin',
      storage: sessionStorage,
    },
  },
)
