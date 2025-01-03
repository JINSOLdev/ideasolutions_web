<template>
    <div>
        <div class="row g-3">
            <div v-for="(item, index) in items" :key="index" :class="colClass">
                <slot :item="item" :index="index"></slot>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        items: {
            type: Array,
            required: true,
        },
        colClass: {
            type: String,
            default: 'col-12',
        },
    },
};
</script>

<style scoped></style>
