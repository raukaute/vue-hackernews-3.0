<template>
  <div class="news-list-nav">
    <router-link v-if="page > 1" :to="`/${feed}/${page - 1}`">
      &lt; prev
    </router-link>
    <a v-else class="disabled">&lt; prev</a>
    <span>{{ page }}/{{ maxPage }}</span>
    <router-link v-if="hasMore" :to="`/${feed}/${page + 1}`">
      more &gt;
    </router-link>
    <a v-else class="disabled">more &gt;</a>
  </div>
</template>

<script setup="props">
import { computed } from 'vue';

export default {
  props: {
    feed: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    maxPage: {
      type: Number,
      required: true,
    },
  },
};

export const hasMore = computed(() => props.page < props.maxPage);
</script>


<style lang="scss">
.news-list-nav, .news-list {
  background-color: #fff;
  border-radius: 2px;
}

.news-list-nav {
  position: fixed;
  top: 55px;
  z-index: 998;
  left: 0;
  right: 0;
  padding: 15px 30px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  a {
    margin: 0 1em;
  }

  .disabled {
    opacity: 0.8;
  }
}
</style>