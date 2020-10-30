<template>
  <div class="user-view">
    <template v-if="user">
      <h1>User : {{ user.id }}</h1>
      <ul class="meta">
        <li><span class="label">Created:</span> {{ user.created }}</li>
        <li><span class="label">Karma:</span> {{ user.karma }}</li>
        <li v-if="user.about" v-html="user.about" class="about"></li>
      </ul>
      <p class="links">
        <a :href="'https://news.ycombinator.com/submitted?id=' + user.id"
          >submissions</a
        >
        |
        <a :href="'https://news.ycombinator.com/threads?id=' + user.id"
          >comments</a
        >
      </p>
    </template>
    <template v-else-if="user === false">
      <h1>User not found.</h1>
    </template>
    <template v-else-if="user.loading">
      <h1>...loading</h1>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()

store.dispatch('FETCH_USER', { id: route.params.id })

export const user = computed(() => store.state.users[route.params.id])

export default {
  serverPrefetch() {
    const { id } = this.$route.params

    return this.$store.dispatch('FETCH_USER', { id })
  },
}
</script>

<style lang="scss">
.user-view {
  background-color: #fff;
  box-sizing: border-box;
  padding: 2em 3em;

  h1 {
    margin: 0;
    font-size: 1.5em;
  }

  .meta {
    list-style-type: none;
    padding: 0;
  }

  .label {
    display: inline-block;
    min-width: 4em;
  }

  .about {
    margin: 1em 0;
  }

  .links a {
    text-decoration: underline;
  }
}
</style>
