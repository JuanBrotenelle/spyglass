<script setup>
import { RouterView } from 'vue-router'
import NavigatorAside from '@/components/NavigatorAside.vue'
import { useAuth } from './composables/useAuth'

//useAuth()
</script>

<template>
  <NavigatorAside
    v-if="
      $route.name !== 'auth' &&
      $route.name !== 'user' &&
      $route.name !== 'history' &&
      $route.name !== 'cookies' &&
      $route.name !== 'script'
    "
  />

  <RouterView />
</template>

<style scoped></style>
