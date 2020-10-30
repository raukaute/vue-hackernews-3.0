<template>
  <div class="view">
    <item-list-nav v-bind="$attrs" />
    <div class="news-list">
      <item-list v-bind="$attrs" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import ItemListNav from '@/components/ItemListNav.vue';
import ItemList from '@/components/ItemList.vue';

export default {
  inheritAttrs: false,
  components: { ItemListNav, ItemList },
};
</script>

<style lang="scss">
.news-list {
  background-color: #fff;
  border-radius: 2px;
}

.news-list {
  position: absolute;
  margin: 30px 0;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}
</style>
