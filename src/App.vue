<template>
    <div>
        <HeaderView></HeaderView>
        <router-view></router-view>
    </div>
</template>

<script>
import HeaderView from '@/layouts/TheHeader.vue';

export default {
    name: 'App',
    components: {
        HeaderView,
    },
};
</script>

<style>
html,
body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
