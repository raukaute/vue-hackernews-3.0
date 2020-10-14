<template>
<div>
    <router-link to="/"><img src="./logo.png"></router-link>
    <router-view></router-view>
</div>
</template>

<script>
import SomeComponent from './SomeComponent.vue';

export default {
    name: 'Home',
    components: {
        SomeComponent
    },
    data() {
        return {
            title: 'Hello Vue 3 SSR'
        }
    }

}
</script>
