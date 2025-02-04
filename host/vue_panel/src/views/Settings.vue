<script setup lang="js">
import axios from 'axios'
import { reactive, ref, watch } from 'vue'
import Loader from '../components/loader/Loader.vue'

const form = reactive({
  password: '',
  newPassword: '',
  newPasswordRepeat: '',
})
const handlerStatusButton = ref(true)
const isLoading = ref(false)
const error = ref('')

async function changePassword() {
  isLoading.value = true

  const formData = {
    login: sessionStorage.getItem('login'),
    password: form.password,
    newPassword: form.newPassword,
  }

  try {
    const response = await axios.post(
      'https://console-test873.com:3000/api/v1/auth/changepassword',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      },
    )
    console.log(response)
    sessionStorage.setItem('token', response.data.access_token)
    sessionStorage.setItem('password', form.newPassword)
    isLoading.value = false
    alert('Пароль успешно изменен')
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

watch(form, () => {
  if (form.password !== sessionStorage.getItem('password')) {
    handlerStatusButton.value = true
    error.value = 'Неправильно введен текущий пароль'
  } else if (
    form.newPassword !== form.newPasswordRepeat &&
    form.newPassword !== '' &&
    form.newPasswordRepeat !== ''
  ) {
    handlerStatusButton.value = true
    error.value = 'Пароли не совпадают'
  } else if (form.newPassword.length < 6) {
    handlerStatusButton.value = true
    error.value = 'Новый пароль должен быть не менее 6 символов'
  } else {
    handlerStatusButton.value = false
    error.value = ''
  }
})
</script>

<template>
  <div
    class="w-full bg-white shadow-xl p-5 drop-shadow-lg flex flex-row items-center justify-between"
  >
    <h1 class="text-xl ml-20">Настройки</h1>
  </div>
  <div class="max-w-[1920px] mx-auto mt-10">
    <div class="max-w-[1920px] mx-auto mt-10 ml-10">
      <h1 class="text-xl font-semibold">Пароль</h1>
      <div class="mt-5 flex flex-col gap-2">
        <input
          type="password"
          v-model="form.password"
          class="border-2 p-2 rounded-lg outline-none w-[250px]"
          placeholder="Текущий пароль"
        />
        <input
          v-model="form.newPassword"
          type="password"
          class="border-2 p-2 rounded-lg outline-none w-[250px]"
          placeholder="Новый пароль"
        />
        <input
          v-model="form.newPasswordRepeat"
          type="password"
          class="border-2 p-2 rounded-lg outline-none w-[250px]"
          placeholder="Подтверждение пароля"
        />
        <span class="text-red-500 text-sm">{{ error }}</span>
        <button
          @click="changePassword"
          :disabled="handlerStatusButton || isLoading"
          class="bg-blue-500 text-white p-2 rounded-lg w-[250px] flex items-center justify-center active:scale-[1.01] active:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <Loader v-if="isLoading" />
          <span v-else>Сохранить</span>
        </button>
      </div>
    </div>
  </div>
</template>
