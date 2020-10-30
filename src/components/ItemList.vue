<template>
  <!-- This will throw hydration mismatch warning as by def transition-group will not be rendered on server -->
  <transition name="slide-left" mode="out-in"
    ><div :key="feed + page" v-if="page > 0" class="news-list">
      <transition-group tag="ul" name="item">
        <item v-for="item in items" :key="item.id" :item="item" />
      </transition-group>
    </div>
  </transition>
</template>

<script>
import { computed, onMounted, watch, toRefs } from 'vue'
import { useStore } from 'vuex'
import Item from './Item.vue'

export default {
  props: {
    page: {
      type: Number,
      required: true,
    },
    feed: {
      type: String,
      required: true,
    },
    maxPage: {
      type: Number,
      required: true,
    },
  },

  components: {
    Item,
  },

  setup(props) {
    const store = useStore()
    const { feed, page } = toRefs(props)

    watch([feed, page], ([f, p], [fOld, pOld]) => {
      const pages = f !== fOld ? [p, p + 1] : p > pOld ? [p + 1] : [p - 1]

      pages.forEach((p) => store.dispatch('FETCH_FEED', { feed: f, page: p }))
    })

    onMounted(() => {
      const pages =
        page.value > 1
          ? [page.value, page.value + 1, page.value - 1]
          : [page.value, page.value + 1]
      pages.forEach((page) =>
        store.dispatch('FETCH_FEED', { feed: feed.value, page: page })
      )
    })

    return {
      items: computed(() => store.getters.getItems(feed.value, page.value)),
    }
  },

  serverPrefetch() {
    let feed = this.feed
    let page = this.page

    return this.$store.dispatch('FETCH_FEED', { feed, page })
  },
}
</script>

<style lang="scss">
.news-list {
  transition: all .5s cubic-bezier(0.55, 0, 0.1, 1)
}

.slide-left-enter,
.slide-right-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}

.slide-left-leave-to,
.slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}
.item-move,
.item-enter-active,
.item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.item-enter {
  opacity: 0;
  transform: translate(30px, 0);
}

.item-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(30px, 0);
}

@media (max-width: 600px) {
  .news-list {
    margin: 10px 0;
  }
}
</style>
