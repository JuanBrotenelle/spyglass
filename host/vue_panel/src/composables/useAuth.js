import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export function useAuth() {
  const router = useRouter()
  const token = ref(sessionStorage.getItem('token'))

  async function checkToken() {
    if (!token.value) return

    try {
      await axios.post(
        'https://console-test873.com:3000/api/v1/users/checktoken',
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        },
      )
    } catch (error) {
      console.error('Ошибка при проверке токена:', error)
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('login')
      sessionStorage.removeItem('password')
      router.push({ name: 'auth' })
    }
  }

  function handleStorageChange(event) {
    if (event.key === 'token') {
      token.value = event.newValue
    }
  }

  onMounted(() => {
    window.addEventListener('storage', handleStorageChange)
    checkToken()
  })

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })

  return {
    token,
  }
}
