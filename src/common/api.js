
import { useStore } from 'vuex'
import axios from 'axios'
const isArray = Array.isArray
const $axios = axios.create({ baseURL: 'https://api.hackerwebapp.com' })

export const validFeeds = {
  news: { title: 'News', pages: 10 },
  newest: { title: 'Newest', pages: 12 },
  ask: { title: 'Ask', pages: 2 },
  show: { title: 'Show', pages: 2 },
  jobs: { title: 'Jobs', pages: 1 },
}

export const api = {
  async getFeeds(feed, page, commit, optimistic) {
    commit(optimistic)
    const { data } = await $axios.get(`/${feed}?page=${page}`)
    commit(data)
  },

  async getUser(id, commit, optimistic) {
    commit(optimistic)
    const { data } = await $axios.get(`/user/${id}`)
    commit(data)
  },

  async getItem(id, commit, optimistic) {
    commit(optimistic)
    const { data } = await $axios.get(`/item/${ id }`)
    commit(data)
  }
}

export function fetchItems(feed, page, isServer = false) {
  const store = useStore()
  let f = feed
  let p = page
  let pages = []

  // watcher
  if (isArray(feed) && isArray(page)) {
    ;[f, p] = feed
    ;[fOld, pOld] = page

    pages = f !== fOld ? [p, p + 1] : p > pOld ? [p + 1] : [p - 1]
    // serverPrefetch, mounted
  } else {
    if (isServer) {
      pages = [p]
    } else {
      pages = p > 1 ? [p, p + 1, p - 1] : [p, p + 1]
    }
  }
  console.log(pages)
  console.log(feed)
  pages.forEach((p) => store.dispatch('FETCH_FEED', { f, p }))
}
