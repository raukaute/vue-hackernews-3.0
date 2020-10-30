import { createStore } from 'vuex'
import { api, validFeeds } from '@/common/api'

const state = () => {
  const s = {
    items: {
      /* [id: number]: Item */
    },
    users: {
      /* [id: string]: User */
    },
    feeds: {
      /* [page: number] : [ [id: number] ] */
    },
  }
  for (let feed in validFeeds) {
    s.feeds[feed] = {}
  }
  return s
}

const mutations = {
  SET_FEED: (state, { feed, ids, page }) => {
    state.feeds[feed][page] = ids
  },
  SET_ITEM: (state, { item }) => {
    if (item) {
      state.items[item.id] = item
    }
  },
  SET_ITEMS: (state, { items }) => {
    items.forEach((item) => (state.items[item.id] = item))
  },
  SET_USER: (state, { id, user }) => {
    state.users[id] = user || false
  },
}

const actions = {
  async FETCH_FEED({ commit, state }, { feed, page }) {
    await api.getFeeds(
      feed,
      page,
      (items) => {
        const ids = items.map((item) => item.id)
        commit('SET_FEED', { feed, ids, page })
        commit('SET_ITEMS', { items })
      },
      (state.feeds[feed][page] || []).map((id) => state.items[id])
    )
  },

  async FETCH_ITEM({ commit, state }, { id }) {
    await api.getItem(
      id,
      (item) => commit('SET_ITEM', { item }),
      Object.assign({ id, loading: true, comments: [] }, state.items[id])
    )
  },

  async FETCH_USER({ commit, state }, { id }) {
    await api.getUser(
      id,
      (user) => commit('SET_USER', { id, user }),
      Object.assign({ id, loading: true }, state.users[id])
    )
  },
}

const getters = {
  getItems: (state) => (feed, page) => {
    return (state.feeds[feed][page] || []).map((id) => state.items[id])
  },
}

if (module.hot) {
  module.hot.accept([actions, mutations], () => {
    store.hotUpdate({
      actions,
      mutations,
    })
  })
}

export function _createStore() {
  return createStore({
    state,
    mutations,
    actions,
    getters,
  })
}
