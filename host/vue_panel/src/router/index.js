import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem('token')) {
          next({ name: 'auth' })
        } else {
          next()
        }
      },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/Auth.vue'),
    },
    {
      path: '/user/:id',
      name: 'user',
      component: () => import('../views/Client.vue'),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem('token')) {
          next({ name: 'auth' })
        } else {
          next()
        }
      },
    },
    {
      path: '/history/download/:id',
      name: 'history',
      component: () => import('../views/HistoryDownload.vue'),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem('token')) {
          next({ name: 'auth' })
        } else {
          next()
        }
      },
    },
    {
      path: '/cookies/download/:id',
      name: 'cookies',
      component: () => import('../views/CookiesDownload.vue'),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem('token')) {
          next({ name: 'auth' })
        } else {
          next()
        }
      },
    },
    {
      path: '/scripts',
      name: 'scripts',
      component: () => import('../views/Scripts.vue'),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem('token')) {
          next({ name: 'auth' })
        } else {
          next()
        }
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem('token')) {
          next({ name: 'auth' })
        } else {
          next()
        }
      },
    },
    {
      path: '/scripts/script/:uuid',
      name: 'script',
      component: () => import('../views/ScriptMore.vue'),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem('token')) {
          next({ name: 'auth' })
        } else {
          next()
        }
      },
    },
  ],
})

export default router
