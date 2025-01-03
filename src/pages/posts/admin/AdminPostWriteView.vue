<template>
    <div>
        <h2 class="px-4 py-4">{{ id ? '게시글 수정' : '고객문의 작성' }}</h2>
        <hr class="mx-4" />
        <PostForm v-model="form" @submit.prevent="save">
            <template #actions>
                <div class="px-3">
                    <button type="button" class="btn btn-outline-dark me-2" @click="goListPage()">목록</button>
                    <button class="btn btn-primary">{{ id ? '수정' : '저장' }}</button>
                </div>
            </template>
        </PostForm>
    </div>
</template>

<script>
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { adminCreatePost, adminGetPostById, adminUpdatePost } from '@/api/posts';
import PostForm from '@/components/posts/PostForm.vue';

export default {
    components: {
        PostForm,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();

        const id = route.params.id;
        console.log(`id는:`, id);

        const form = ref({
            title: '',
            contents: '',
        });

        // 컴포넌트가 마운트될 때 (글 수정일 경우에만) 기존 데이터 불러오기
        onMounted(() => {
            console.log('컴포넌트 마운트 시 id는:', id);
            if (id) {
                adminFetchPost(); // id가 있으면 기존 글 데이터를 불러옴
            }
        });

        // 경로 변경 시마다 데이터를 다시 가져오는 로직
        onBeforeRouteUpdate((to, from) => {
            if (to.params.id !== from.params.id) {
                adminFetchPost(); // id가 바뀌면 새로운 글을 불러옴
            }
        });

        // URL 변경 시 id 변경된 값 콘솔에 찍기
        watch(
            () => route.params.id,
            (newId) => {
                console.log('변경된 id는:', newId);
            }
        );

        // 글을 수정하기 위해 서버에서 데이터 가져오기
        const adminFetchPost = async () => {
            try {
                const { data } = await adminGetPostById(id);
                form.value.title = data.response.title;
                form.value.contents = data.response.contents;
            } catch (error) {
                console.error('Error fetching post:', error.message);
                alert('게시글을 불러오는 데 실패했습니다.');
            }
        };

        // 새 글을 작성하거나 기존 글 수정하기
        const save = () => {
            if (id) {
                adminUpdatePost(id, form.value)
                    .then(() => {
                        alert('수정 성공!');
                        router.push({
                            name: 'AdminPostList',
                        });
                    })
                    .catch(() => {
                        alert('수정 실패!');
                    });
            } else {
                adminCreatePost(form.value)
                    .then(() => {
                        alert('저장 성공!');
                        router.push({
                            name: 'AdminPostList',
                        });
                    })
                    .catch(() => {
                        alert('저장 실패!');
                    });
            }
        };

        const goListPage = () => {
            router.push({
                name: 'AdminPostList',
            });
        };

        return { goListPage, form, save, id };
    },
};
</script>

<style scoped></style>
