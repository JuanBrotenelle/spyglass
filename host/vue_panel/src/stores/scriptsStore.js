import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useScriptsStore = defineStore(
  'scripts',
  () => {
    const scripts = reactive([])

    const applyArray = array => {
      scripts.splice(0, scripts.length, ...array)
    }

    const findScript = uuid => {
      return scripts.find(script => script.uuidFile === uuid)
    }

    return {
      scripts,
      applyArray,
      findScript,
    }
  },
  {
    persist: {
      enabled: true,
      key: 'scripts',
      storage: sessionStorage,
    },
  },
)
