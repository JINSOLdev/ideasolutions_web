<template>
    <div>
        <h2 class="px-4 py-4">전체 문의글</h2>
        <hr class="mx-4" />

        <!-- PostFilter에 params 객체를 v-model로 바인딩 -->
        <PostFilter v-model:title="params.title" v-model:size="params.size" />

        <hr class="mx-4" />

        <AppGrid :items="posts">
            <template v-slot="{ item }">
                <PostItem :title="item.title" :contents="item.contents" :createdAt="item.createdAt" @click="goPage(item.id)" />
            </template>
        </AppGrid>

        <!-- 페이지네이션 -->
        <AppPagination :current-page="params.page" :page-count="pageCount" @page="(page) => (params.page = page)" />
    </div>
</template>

<script>
import { adminGetPosts } from '@/api/posts.js';
import { ref, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import PostItem from '@/components/posts/PostItem.vue';
import PostFilter from '@/components/posts/PostFilter.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppGrid from '@/components/AppGrid.vue';

export default {
    components: {
        PostItem,
        AppPagination,
        AppGrid,
        PostFilter,
    },
    setup() {
        const router = useRouter();
        const posts = ref([]); 
        const params = ref({
            title: '', 
            contents: '', 
            sortProperty: 'updatedAt', 
            order: 'desc', 
            size: 3, 
            page: 1, 
        });

        // pagination 계산
        const totalCount = ref(0); 
        const pageCount = computed(() => {
            return totalCount.value ? Math.ceil(totalCount.value / params.value.size) : 1;
        });

        // 게시물 데이터를 서버에서 가져오기
        const adminFetchPosts = async () => {
            try {
                const adjustedParams = { ...params.value, page: params.value.page - 1 }; // 페이지는 0부터 시작하므로 조정
                console.log('params.size: ', adjustedParams.size);

                const { data } = await adminGetPosts(adjustedParams);

                posts.value = data.response.list || [];
                console.log('Fetched posts: ', posts.value);

                // 서버에서 totalElements로 총 게시물 수 설정
                totalCount.value = data.response.totalElements || 0;
                console.log(`totalCount.value: `, totalCount.value);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        // params 값이 변경되면 자동으로 fetchPosts 호출
        watchEffect(adminFetchPosts); 

        // 게시글 상세 페이지로 이동
        const goPage = (id) => {
            router.push({
                name: 'AdminPostDetail',
                params: {
                    id,
                },
            });
        };

        return { goPage, params, posts, totalCount, pageCount };
    },
};
</script>
