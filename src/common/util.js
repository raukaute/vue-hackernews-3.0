import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export const toHost = (url) => {
  return computed(() => {
    const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    const parts = host.split('.').slice(-3)
    if (parts[0] === 'www') parts.shift()

    return parts.join('.')
  })
}
