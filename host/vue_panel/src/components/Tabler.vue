<script setup lang="js">
import { ref, onBeforeMount, watch } from 'vue'
import Table from './table/Table.vue'
import { useAdminStore } from '../stores/storeAdmin'
import debounce from 'debounce'

const adminStore = useAdminStore()
const { createEventSource } = adminStore

const activeTab = ref('Все')
const tabs = ['Все', 'Онлайн', 'Сегодня', 'Оффлайн', 'Активные', 'Архив']
const search = ref('')
const quantity = ref(20)
const strict = ref(1)

function handleSorting() {
  switch (activeTab.value) {
    case 'Все':
      return 'none'
    case 'Онлайн':
      return 'online'
    case 'Сегодня':
      return 'today'
    case 'Оффлайн':
      return 'offline'
    case 'Активные':
      return 'active'
    case 'Архив':
      return 'archive'
  }
}

const debouncedChangeSorting = debounce(
  (quantity, sort, order, strictMode, searchTerm) => {
    createEventSource(quantity, sort, order, strictMode, searchTerm)
  },
  0,
)

function updateSorting() {
  debouncedChangeSorting(
    quantity.value,
    handleSorting(),
    1,
    strict.value,
    search.value,
  )
}

watch([activeTab, search, quantity], updateSorting)

onBeforeMount(() => {
  updateSorting()
})

function loadMoreUsers() {
  quantity.value += 20
}
</script>

<template>
  <div class="max-w-[1920px] mx-auto bg-white p-5 rounded-lg">
    <div class="flex flex-row">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="
          () => {
            activeTab = tab
            strict = 1
          }
        "
        :class="[
          'text-gray-500 rounded-t-lg p-2',
          { 'border-b-[#ffffff] border-2': activeTab === tab },
        ]"
      >
        {{ tab }}
      </button>
    </div>
    <hr class="border-[1px] mt-[-2px]" />
    <div class="mt-5 relative w-fit">
      <img
        src="/images/index/Magnifier.svg"
        class="absolute top-0 right-2 translate-y-[35%] pointer-events-none"
        alt="Magnifying glass icon"
      />
      <input
        type="text"
        v-model="search"
        @input="
          () => {
            strict = 0
          }
        "
        placeholder="Поиск по IP, Гео, Комментарию"
        class="border-2 outline-none p-2 pr-8 w-[300px] rounded-lg"
      />
    </div>
    <Table />
  </div>

  <button
    v-if="adminStore.users.length === quantity"
    @click="loadMoreUsers"
    class="mt-5 bg-blue-500 text-white p-2 rounded-lg"
  >
    Показать больше
  </button>
</template>
