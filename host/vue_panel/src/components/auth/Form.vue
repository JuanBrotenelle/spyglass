<script setup lang="js">
import { ref } from 'vue'
import axios from 'axios'
import Loader from '../loader/Loader.vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/storeAdmin'

const router = useRouter()

const adminStore = useAdminStore()

const isLoading = ref(false)
const login = ref('')
const password = ref('')
const error = ref('')

const loginSubmit = async () => {
  isLoading.value = true
  error.value = ''

  if (login.value === '' || password.value === '') {
    isLoading.value = false
    error.value = 'Заполните все поля'
    return
  }

  const body = {
    login: login.value,
    password: password.value,
  }

  sessionStorage.setItem('login', login.value)
  sessionStorage.setItem('password', password.value)

  try {
    const response = await axios.post(
      'https://console-test873.com:3000/api/v1/auth/login',
      JSON.stringify(body),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status === 201 && response.data.error === 'Wrong login') {
      isLoading.value = false
      error.value = 'Неверный логин'
      return
    } else if (
      response.status === 201 &&
      response.data.error === 'Wrong password'
    ) {
      isLoading.value = false
      error.value = 'Неверный пароль'
      return
    }

    if (response.data.access_token) {
      adminStore.token = response.data.access_token
      adminStore.login = login.value

      sessionStorage.setItem('token', adminStore.token)

      setTimeout(() => {
        sessionStorage.removeItem('token')
        adminStore.token = null
        adminStore.login = null
      }, 3600000)

      router.push({ name: 'home' })

      isLoading.value = false
    }
  } catch (e) {
    isLoading.value = false
    error.value = e.response.data.message
  }
}

const nextFormField = event => {
  if (event.key === 'Enter' && event.target.id === 'login') {
    document.getElementById('password').focus()
  } else if (event.key === 'Enter' && event.target.id === 'password') {
    document.getElementById('sbmbtn').click()
    document.getElementById('password').blur()
  }
}
</script>

<template>
  <div class="py-5 px-10 drop-shadow-lg shadow-xl bg-white rounded-lg">
    <h1 class="text-center font-2xl font-medium">Авторизация</h1>
    <div class="flex flex-col gap-2 mt-5">
      <input
        :disabled="isLoading"
        v-model="login"
        @keydown="nextFormField"
        type="text"
        name="login"
        id="login"
        autocomplete="off"
        class="border-2 p-2 rounded-lg"
        placeholder="Логин"
      />
      <input
        :disabled="isLoading"
        v-model="password"
        @keydown="nextFormField"
        class="border-2 p-2 rounded-lg"
        autocomplete="off"
        type="password"
        name="password"
        id="password"
        placeholder="Пароль"
      />
    </div>
    <p class="text-red-500 mt-5 text-center text-xs">{{ error }}</p>
    <button
      :disabled="isLoading"
      @click="loginSubmit"
      class="p-2 mt-5 bg-blue-600 text-white w-full rounded-lg flex flex-row items-center justify-center"
      id="sbmbtn"
    >
      <span v-if="!isLoading">Войти</span> <Loader v-else />
    </button>
  </div>
</template>
