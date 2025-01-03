<template>
    <AppCard class="mx-4">
        <h5 class="card-title">{{ title }}</h5>
        <p class="card-text">{{ contents }}</p>
        <p>{{ createdAt }}</p>
    </AppCard>
</template>

<script>
import AppCard from '@/components/AppCard.vue';

export default {
    components: {
        AppCard,
    },

    name: 'PostCard',
    props: {
        title: {
            type: String,
            required: true,
        },
        contents: {
            type: String,
        },
        createdAt: {
            type: [String, Date, Number],
        },
    },
    // mounted() {
    //     console.log('PostItem props:', this.title, this.contents, this.createdAt); // 콘솔에 props 값 확인
    // },
};
</script>

<style scoped></style>
