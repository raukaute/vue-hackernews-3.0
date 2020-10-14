<template>
  <div class="blue">
    {{ data }}
    <span>Check SCSS</span>
  </div>
</template>

<script>
import { ref, ssrContextKey } from 'vue';

export default {
  inject: [ssrContextKey],
  name: 'SomeComponent',
  setup(props, opts) {
    const data = ref('I am data');
    return {
      data,
    };
  },
  serverPrefetch() {
    let ctx = this[ssrContextKey];
    ctx.fetch = ['Some Data'];
    // console.log(this[ssrContextKey])
  },
};
</script>

<style lang="scss">
.blue {
  color: blue;
  font-size: 20px;

  span {
    color: red;
  }
}
</style>
