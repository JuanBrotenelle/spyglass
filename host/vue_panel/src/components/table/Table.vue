<script setup lang="js">
import { ref, onMounted, watch } from 'vue'
import { useAdminStore } from '../../stores/storeAdmin'
import User from './User.vue'
import Loader from '../loader/Loader.vue'
import History from '../history/History.vue'

const adminStore = useAdminStore()
const { users, isLoading, updateComment } = adminStore
const showHistory = ref(false)
const uuidForHistory = ref('')

function handlerShowHistory(uuid) {
  showHistory.value = !showHistory.value
  uuidForHistory.value = uuid
}

function handleCommentUpdate(index, newComment) {
  users[index].otherInfo.Comment = newComment
  updateComment(users[index].uuid, newComment)
}

const columns = [
  'ID',
  'Статус',
  'В сети',
  'UUID',
  'IP',
  'Гео',
  'Браузер',
  'История браузера',
  'Куки',
  'Комментарий',
  'Создан',
  'Действия',
  'Подробнее',
]
</script>

<template>
  <History
    v-if="showHistory"
    :uuid="uuidForHistory"
    :length="users.find(user => user.uuid === uuidForHistory)?.historyLength"
    @close="handlerShowHistory($event)"
  />

  <div class="max-w-[1920px] mx-auto mt-5 bg-white rounded-lg">
    <table class="min-w-full bg-white border">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column"
            class="py-2 px-4 border text-center bg-gray-50 font-semibold text-gray-500"
          >
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody v-if="users.length > 0">
        <User
          v-for="(user, index) in users"
          :key="user.id"
          :user="user"
          :modelValue="user.otherInfo.Comment"
          @update:modelValue="handleCommentUpdate(index, $event)"
          @showHistory="handlerShowHistory($event)"
        />
      </tbody>
    </table>
    <div
      v-if="users.length === 0"
      class="w-full text-center text-gray-500 flex items-center justify-center font-semibold py-5 bg-gray-50"
    >
      <span v-if="!isLoading">Пользователи отсутствуют</span>
    </div>
    <div
      v-if="isLoading"
      class="w-full text-center text-gray-500 flex items-center justify-center font-semibold py-5 bg-gray-50"
    >
      <Loader />
    </div>
  </div>
</template>
