<template>
  <li class="news-item">
    <span class="score">{{ item.points }}</span>
    <span class="title">
      <template v-if="isAbsolute(item.url)">
        <a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a>
        <span class="host"> ({{ itemUrl }})</span>
      </template>
      <template v-else>
        <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
      </template>
    </span>
    <br />
    <span class="meta">
      <span v-if="item.type !== 'job'" class="by">
        by <router-link :to="'/user/' + item.user">{{ item.user }}</router-link>
      </span>
      <span class="time">&nbsp;{{ item.time_ago }}</span>
      <span v-if="item.type !== 'job'" class="comments-link">
        |
        <router-link :to="'/item/' + item.id"
          >{{ item.comments_count }} comments</router-link
        >
      </span>
    </span>
  </li>
</template>

<script>
import { toHost, timeAgo } from '@/common/util'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const isAbsolute = (url) => /^https?:\/\//.test(url)
    const itemUrl = toHost(props.item.url)

    return {
      isAbsolute,
      itemUrl,
    }
  },
}
</script>

<style lang="scss">
.news-item {
  background-color: #fff;
  padding: 20px 30px 20px 80px;
  border-bottom: 1px solid #eee;
  position: relative;
  line-height: 20px;

  .score {
    color:#3eaf7c;
    font-size: 1.1em;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 0;
    width: 80px;
    text-align: center;
    margin-top: -10px;
  }

  .meta,
  .host {
    font-size: 0.85em;
    color: #595959;

    a {
      color: #595959;
      text-decoration: underline;

      &:hover {
        color:#3eaf7c;
      }
    }
  }
}
</style>
