<template>
  <div id="app">
    <header class="header">
      <nav class="inner" role="navigation">
        <span class="home">
          <img class="logo" src="@/assets/logo-48.png" alt="logo" />
          <router-link to="/" exact></router-link>
        </span>
        <router-link v-for="(list, key) in fds" :key="key" :to="`/${key}`">
          {{ list.title }}
        </router-link>
        <a
          class="github"
          href="https://v3.vuejs.org/"
          target="_blank"
          rel="noopener banner"
        >
          Built with Vue@Next
        </a>
      </nav>
    </header>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { feeds } from '@/common/api';

export const fds = feeds;

</script>

<style lang="scss">
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  background-color: #f2f3f5;
  margin: 0;
  padding: 0;
  color: #2e495e;
  overflow-y: scroll;
}

a {
  color: #2e495e;
  text-decoration: none;
}

.header {
  background-color: #2e495e;
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

    &.router-link-active,
    &.nuxt-link-active {
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
  width: 24px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}

.view {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.appear-active {
  transition: opacity 0.4s ease;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}

.appear,
.page-enter,
.page-leave-active {
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
