<template>
    <div>
        <nav class="mt-5" aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="isPrevPage">
                    <a class="page-link" href="#" @click.prevent="$emit('page', currentPage - 1)" :class="{ disabled: currentPage <= 1 }">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>

                <li v-for="page in pageCount" :key="page" class="page-item" :class="{ active: currentPage === page }">
                    <a class="page-link" href="#" @click.prevent="$emit('page', page)">{{ page }}</a>
                </li>

                <li class="page-item" :class="isNextPage">
                    <a class="page-link" href="#" @click.prevent="$emit('page', currentPage + 1)" :class="{ disabled: currentPage >= pageCount }">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    props: {
        currentPage: {
            type: Number,
            required: true,
            default: 1,
        },
        pageCount: {
            type: Number,
            required: true,
        },
    },
    emits: ['page'],
    setup(props) {
        const isPrevPage = computed(() => ({ disabled: !(props.currentPage > 1) }));
        const isNextPage = computed(() => ({
            disabled: !(props.currentPage < props.pageCount),
        }));

        return { isPrevPage, isNextPage };
    },
};
</script>

<style scoped></style>
