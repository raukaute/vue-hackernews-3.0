<template>
  <header class="header">
    <nav class="inner" role="navigation">
      <router-link to="/" class="logo" exact>
        <span>V</span>
      </router-link>

      <router-link
        v-for="(list, key) in feeds"
        :key="key"
        :to="{ name: 'feed-page', params: { feed: key } }"
      >
        {{ list.title }}
      </router-link>
      <a
        class="github"
        href="https://github.com/vuejs/vue-next"
        target="_blank"
        rel="noopener banner"
      >
        Built with Vue@Next
      </a>
    </nav>
  </header>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.params.feed" />
    </transition>
  </router-view>
</template>

<script setup>
import { validFeeds } from '@/common/api'

export const feeds = validFeeds
</script>

<style lang="scss">
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  background-color: #f2f3f5;
  margin: 0;
  padding-top: 55px;
  color: #2e495e;
  overflow-y: scroll;
}

a {
  color: #2e495e;
  text-decoration: none;
}

.header {
  background-color: #3eaf7c;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: 55px;

  .inner {
    max-width: 800px;
    box-sizing: border-box;
    margin: 0px auto;
    padding: 15px 5px;
  }

  a {
    color: #fff;
    line-height: 24px;
    transition: color 0.15s ease;
    display: inline-block;
    vertical-align: middle;
    font-weight: 300;
    letter-spacing: 0.075em;
    margin-right: 1.8em;

    &:hover {
      color: #fff;
    }

    &.router-link-active {
      color: #fff;
      font-weight: 600;
    }

    &:nth-child(6) {
      margin-right: 0;
    }
  }

  .github {
    color: #fff;
    font-size: 0.9em;
    margin: 0;
    float: right;
  }
}

.view {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.logo {
  position: relative;
  width: 24px;
  height: 24px;
  padding: 2px;
  background-color: #fff;
  margin-right: 10px;

  vertical-align: middle;

  span {
    display: inline-block;
    font-weight: 600;
    width: 100%;
    text-align: center;
    color: #fff;
    background-color: #3eaf7c;
  }
}

.view {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

@media (max-width: 860px) {
  .header .inner {
    padding: 15px 30px;
  }
}

@media (max-width: 600px) {
  .header {
    .inner {
      padding: 15px;
    }

    a {
      margin-right: 1em;
    }

    .github {
      display: none;
    }
  }
}
</style>
